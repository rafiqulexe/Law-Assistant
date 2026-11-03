import logging
import os
import sqlite3
import secrets
from functools import wraps
from pathlib import Path

from dotenv import load_dotenv
from flask import (
    Flask,
    jsonify,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

from src.helper import (
    build_rag_chain,
    download_hugging_face_embeddings,
    index_documents,
    load_all_documents,
    split_into_chunks,
)
from src.prompt import system_prompt

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = Path(os.getenv("DATA_DIR", BASE_DIR / "Data"))
DATABASE_PATH = Path(os.getenv("DATABASE_PATH", BASE_DIR / "instance" / "law_assistant.db"))
ALLOWED_UPLOAD_EXTENSIONS = {"pdf", "csv"}

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
if not app.config["SECRET_KEY"]:
    raise RuntimeError("SECRET_KEY must be configured in the environment.")
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = os.getenv("SESSION_COOKIE_SECURE", "0") == "1"

_rag_chain = None


def get_db():
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    with get_db() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                is_admin INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL REFERENCES users(id),
                title TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id INTEGER NOT NULL REFERENCES conversations(id),
                role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
                content TEXT NOT NULL,
                citations TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            """
        )


def csrf_token():
    token = session.get("_csrf_token")
    if not token:
        token = secrets.token_urlsafe(32)
        session["_csrf_token"] = token
    return token


@app.before_request
def protect_state_changing_requests():
    if request.method == "POST":
        supplied = request.form.get("_csrf_token") or request.headers.get("X-CSRFToken")
        if not supplied or not secrets.compare_digest(supplied, session.get("_csrf_token", "")):
            return jsonify({"error": "Invalid CSRF token."}), 403


def login_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("login", next=request.path))
        return view(*args, **kwargs)

    return wrapped


def admin_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if not session.get("is_admin"):
            return jsonify({"error": "Administrator access required."}), 403
        return view(*args, **kwargs)

    return wrapped


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_UPLOAD_EXTENSIONS


def get_rag_chain():
    global _rag_chain
    if _rag_chain is None:
        embedding_model = download_hugging_face_embeddings()
        _rag_chain = build_rag_chain(embedding_model, system_prompt)
    return _rag_chain


def extract_citations(documents):
    citations = []
    seen = set()
    for document in documents:
        metadata = document.metadata or {}
        source = metadata.get("source", "Unknown source")
        page = metadata.get("page")
        label = f"{Path(source).name} (page {page + 1})" if isinstance(page, int) else Path(source).name
        if label not in seen:
            citations.append(label)
            seen.add(label)
    return citations


def current_user():
    if "user_id" not in session:
        return None
    with get_db() as connection:
        return connection.execute(
            "SELECT id, username, is_admin FROM users WHERE id = ?", (session["user_id"],)
        ).fetchone()


@app.context_processor
def inject_user():
    return {"current_user": current_user(), "csrf_token": csrf_token}


@app.route("/")
@login_required
def index():
    return render_template("chat.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")
        with get_db() as connection:
            user = connection.execute(
                "SELECT * FROM users WHERE username = ?", (username,)
            ).fetchone()
        if user and check_password_hash(user["password_hash"], password):
            session.clear()
            session.update(user_id=user["id"], username=user["username"], is_admin=bool(user["is_admin"]))
            return redirect(request.args.get("next") or url_for("index"))
        return render_template("login.html", error="Invalid username or password.")
    return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")
        if len(username) < 3 or len(password) < 8:
            return render_template("login.html", error="Username must have 3 characters and password 8 characters.")
        try:
            with get_db() as connection:
                connection.execute(
                    "INSERT INTO users (username, password_hash) VALUES (?, ?)",
                    (username, generate_password_hash(password)),
                )
        except sqlite3.IntegrityError:
            return render_template("login.html", error="That username is already registered.")
        return redirect(url_for("login"))
    return render_template("login.html", register=True)


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.route("/get", methods=["POST"])
@login_required
def chat():
    message = request.form.get("msg", "").strip()
    conversation_id = request.form.get("conversation_id", type=int)
    if not message:
        return jsonify({"error": "Message cannot be empty."}), 400

    try:
        with get_db() as connection:
            if conversation_id is None:
                cursor = connection.execute(
                    "INSERT INTO conversations (user_id, title) VALUES (?, ?)",
                    (session["user_id"], message[:80]),
                )
                conversation_id = cursor.lastrowid
            else:
                owned = connection.execute(
                    "SELECT id FROM conversations WHERE id = ? AND user_id = ?",
                    (conversation_id, session["user_id"]),
                ).fetchone()
                if not owned:
                    return jsonify({"error": "Conversation not found."}), 404
            connection.execute(
                "INSERT INTO messages (conversation_id, role, content) VALUES (?, 'user', ?)",
                (conversation_id, message),
            )

        result = get_rag_chain().invoke({"input": message})
        answer = str(result.get("answer", "")).strip()
        if not answer:
            raise RuntimeError("The retrieval chain returned no answer.")
        citations = extract_citations(result.get("context", []))

        with get_db() as connection:
            connection.execute(
                "INSERT INTO messages (conversation_id, role, content, citations) VALUES (?, 'assistant', ?, ?)",
                (conversation_id, answer, "\n".join(citations)),
            )
        return jsonify({"answer": answer, "citations": citations, "conversation_id": conversation_id})
    except Exception:
        logger.exception("Chat request failed")
        return jsonify({"error": "The assistant is temporarily unavailable."}), 503


@app.route("/api/conversations")
@login_required
def conversations():
    with get_db() as connection:
        rows = connection.execute(
            "SELECT id, title, created_at FROM conversations WHERE user_id = ? ORDER BY id DESC",
            (session["user_id"],),
        ).fetchall()
    return jsonify([dict(row) for row in rows])


@app.route("/api/conversations/<int:conversation_id>")
@login_required
def conversation(conversation_id):
    with get_db() as connection:
        rows = connection.execute(
            """
            SELECT m.role, m.content, m.citations, m.created_at
            FROM messages m JOIN conversations c ON c.id = m.conversation_id
            WHERE c.id = ? AND c.user_id = ? ORDER BY m.id
            """,
            (conversation_id, session["user_id"]),
        ).fetchall()
    return jsonify([dict(row) for row in rows])


@app.route("/admin")
@login_required
@admin_required
def admin():
    with get_db() as connection:
        users = connection.execute(
            "SELECT username, is_admin, created_at FROM users ORDER BY id DESC"
        ).fetchall()
    return render_template("admin.html", users=users, data_dir=DATA_DIR)


@app.route("/admin/upload", methods=["POST"])
@login_required
@admin_required
def upload_document():
    upload = request.files.get("document")
    if not upload or not upload.filename or not allowed_file(upload.filename):
        return jsonify({"error": "Only PDF and CSV files are supported."}), 400
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    destination = DATA_DIR / secure_filename(upload.filename)
    upload.save(destination)
    try:
        documents = load_all_documents(str(DATA_DIR))
        chunks = split_into_chunks(documents)
        embedding_model = download_hugging_face_embeddings()
        index_documents(chunks, embedding_model)
    except Exception:
        logger.exception("Document indexing failed for %s", destination)
        destination.unlink(missing_ok=True)
        return jsonify({"error": "The document could not be indexed."}), 503
    return jsonify({"message": f"{destination.name} uploaded and indexed."})


with app.app_context():
    init_db()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8080")), debug=False)
