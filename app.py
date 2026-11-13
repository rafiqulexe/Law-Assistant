import io
import json
import logging
import os
import re
import secrets
import sqlite3
import threading
from functools import wraps
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory, session
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

from src.helper import (
    ask_for_json,
    ask_for_text,
    build_rag_chain,
    download_hugging_face_embeddings,
    get_retriever,
    index_documents,
    load_all_documents,
    split_into_chunks,
    translate_to_english,
)
from src import ocr
from src.database import get_db, init_db
from src.rate_limit import limit
from src.source_names import act_and_section
from src.prompt import contract_prompt, document_prompt, risk_prompt, system_prompt

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = Path(os.getenv("DATA_DIR", BASE_DIR / "Data"))
FRONTEND_DIST = Path(os.getenv("FRONTEND_DIST", BASE_DIR / "frontend" / "dist"))
ALLOWED_UPLOAD_EXTENSIONS = {"pdf", "csv"}
MAX_TEXT_LENGTH = int(os.getenv("MAX_TEXT_LENGTH", "20000"))
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
BANGLA_PATTERN = re.compile(r"[ঀ-৿]")
# Shared by chat and the AI tools, so one account cannot keep the model busy.
AI_REQUESTS_PER_10_MIN = int(os.getenv("AI_REQUESTS_PER_10_MIN", "30"))

app = Flask(__name__, static_folder=None)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
if not app.config["SECRET_KEY"]:
    raise RuntimeError("SECRET_KEY must be configured in the environment.")
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024
app.config["SESSION_COOKIE_HTTPONLY"] = True
# "None" lets the session work when the site is shown inside another page (Hugging Face Spaces).
app.config["SESSION_COOKIE_SAMESITE"] = os.getenv("SESSION_COOKIE_SAMESITE", "Lax")
app.config["SESSION_COOKIE_SECURE"] = os.getenv("SESSION_COOKIE_SECURE", "0") == "1"

_embeddings = None
_retriever = None
_rag_chain = None


def log_activity(kind, title, risk=None):
    with get_db() as connection:
        connection.execute(
            "INSERT INTO activity (user_id, kind, title, risk) VALUES (?, ?, ?, ?)",
            (session["user_id"], kind, title[:120], risk),
        )


# ---------------------------------------------------------------------------
# Security helpers
# ---------------------------------------------------------------------------

def csrf_token():
    token = session.get("_csrf_token")
    if not token:
        token = secrets.token_urlsafe(32)
        session["_csrf_token"] = token
    return token


@app.before_request
def protect_state_changing_requests():
    if request.method == "POST":
        supplied = request.headers.get("X-CSRFToken") or request.form.get("_csrf_token")
        if not supplied or not secrets.compare_digest(supplied, session.get("_csrf_token", "")):
            return jsonify({"error": "Invalid CSRF token."}), 403


def login_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"error": "Please sign in first."}), 401
        return view(*args, **kwargs)

    return wrapped


def listed_admin(username):
    """ADMIN_USERNAMES makes these accounts admins, for hosts where the database starts empty."""
    names = {name.strip().lower() for name in os.getenv("ADMIN_USERNAMES", "").split(",")}
    return username.lower() in names - {""}


def admin_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        # Read the flag from the database so removing an admin takes effect at once.
        with get_db() as connection:
            row = connection.execute(
                "SELECT is_admin FROM users WHERE id = ?", (session.get("user_id"),)
            ).fetchone()
        if not row or not row["is_admin"]:
            return jsonify({"error": "Administrator access required."}), 403
        return view(*args, **kwargs)

    return wrapped


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_UPLOAD_EXTENSIONS


def json_body():
    return request.get_json(silent=True) or {}


def tool_language():
    # The tools answer in the language the user picked for the site.
    return "Bangla" if json_body().get("language") == "bn" else "English"


def required_text(field):
    text = str(json_body().get(field, "")).strip()
    if not text:
        return None, (jsonify({"error": "Please provide some text first."}), 400)
    return text[:MAX_TEXT_LENGTH], None


# ---------------------------------------------------------------------------
# AI pipeline
# ---------------------------------------------------------------------------

def get_embeddings():
    global _embeddings
    if _embeddings is None:
        _embeddings = download_hugging_face_embeddings()
    return _embeddings


def get_shared_retriever():
    global _retriever
    if _retriever is None:
        _retriever = get_retriever(get_embeddings())
    return _retriever


def get_rag_chain():
    global _rag_chain
    if _rag_chain is None:
        _rag_chain = build_rag_chain(get_shared_retriever(), system_prompt)
    return _rag_chain


def citation_label(metadata, text=""):
    page = metadata.get("page")
    if metadata.get("act_title"):
        # Synced from the official website: name the act, section and date.
        return f"{metadata['act_title']} - {metadata.get('section', '')} (official, updated {metadata.get('updated_at', '')})"
    act, section = act_and_section(metadata, text)
    act = act or "Laws of Bangladesh"
    if section:
        return f"{act} - {section}"
    if isinstance(page, (int, float)):
        return f"{act} (page {int(page) + 1})"
    return act


def extract_sources(documents):
    """One entry per distinct source: a label, plus the act, section, passage and link when known."""
    sources = []
    seen = set()
    for document in documents:
        metadata = document.metadata or {}
        text = document.page_content or ""
        label = citation_label(metadata, text)
        if label in seen:
            continue
        seen.add(label)
        source = str(metadata.get("source", ""))
        act, section = act_and_section(metadata, text)
        sources.append({
            "label": label,
            "act": metadata.get("act_title") or act or "Laws of Bangladesh",
            "section": metadata.get("section") or section,
            "text": (document.page_content or "").strip()[:1500],
            "url": source if source.startswith("http") else "",
        })
    return sources


def extract_citations(documents):
    return [source["label"] for source in extract_sources(documents)]


def stored_sources(raw):
    """Messages saved before sources were stored as JSON hold one label per line."""
    if not raw:
        return []
    if raw.startswith("["):
        return json.loads(raw)
    return [{"label": label, "act": "", "section": "", "text": "", "url": ""} for label in raw.splitlines()]


def reply_language(text):
    # Bengali Unicode block is U+0980 to U+09FF.
    return "Bangla" if BANGLA_PATTERN.search(text) else "English"


def search_query(message, language, history=None):
    # Bangla-only queries match unrelated Bangla text, and follow-ups like
    # "what is its punishment?" name no law at all. A standalone English
    # version fixes both for the (mostly English) acts.
    if language != "Bangla" and not history:
        return message
    try:
        return f"{message}\n(English: {translate_to_english(message, history)})"
    except Exception:
        logger.exception("Translation failed, searching with the original question")
        return message


HISTORY_MESSAGES = 4


def recent_history(conversation_id, before_id):
    """The last few messages before the current one, oldest first."""
    with get_db() as connection:
        rows = connection.execute(
            """SELECT role, content FROM messages WHERE conversation_id = ? AND id < ?
               ORDER BY id DESC LIMIT ?""",
            (conversation_id, before_id, HISTORY_MESSAGES),
        ).fetchall()
    return [(row["role"], row["content"][:1500]) for row in reversed(rows)]


def history_messages(history):
    return [("human" if role == "user" else "ai", content) for role, content in history]


def risk_level(score, high, medium):
    if score >= high:
        return "high"
    if score >= medium:
        return "medium"
    return "low"


# ---------------------------------------------------------------------------
# Auth API
# ---------------------------------------------------------------------------

def user_payload(user):
    return {"id": user["id"], "username": user["username"], "is_admin": bool(user["is_admin"])}


@app.get("/api/csrf")
def get_csrf():
    return jsonify({"csrf_token": csrf_token()})


@app.get("/api/me")
def me():
    if "user_id" not in session:
        return jsonify({"user": None}), 401
    with get_db() as connection:
        user = connection.execute(
            "SELECT id, username, is_admin FROM users WHERE id = ?", (session["user_id"],)
        ).fetchone()
    if not user:
        session.clear()
        return jsonify({"user": None}), 401
    return jsonify({"user": user_payload(user)})


@app.post("/api/login")
@limit("login", 10, 15 * 60)
def login():
    data = json_body()
    username = str(data.get("username", "")).strip()
    password = str(data.get("password", ""))
    with get_db() as connection:
        user = connection.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid username or password."}), 401
    session.clear()
    session.update(user_id=user["id"], username=user["username"], is_admin=bool(user["is_admin"]))
    return jsonify({"user": user_payload(user), "csrf_token": csrf_token()})


@app.post("/api/register")
@limit("register", 5, 60 * 60)
def register():
    data = json_body()
    username = str(data.get("username", "")).strip()
    password = str(data.get("password", ""))
    if len(username) < 3 or len(password) < 8:
        return jsonify({"error": "Username needs 3 characters and password 8 characters."}), 400
    try:
        with get_db() as connection:
            connection.execute(
                "INSERT INTO users (username, password_hash, is_admin) VALUES (?, ?, ?)",
                (username, generate_password_hash(password), int(listed_admin(username))),
            )
    except sqlite3.IntegrityError:
        return jsonify({"error": "That username is already registered."}), 409
    return jsonify({"message": "Account created."}), 201


@app.post("/api/logout")
def logout():
    session.clear()
    return jsonify({"message": "Signed out.", "csrf_token": csrf_token()})


# ---------------------------------------------------------------------------
# Chat API
# ---------------------------------------------------------------------------

@app.post("/api/chat")
@login_required
@limit("ai", AI_REQUESTS_PER_10_MIN, 10 * 60, per="user")
def chat():
    data = json_body()
    message = str(data.get("message", "")).strip()
    conversation_id = data.get("conversation_id")
    if not message:
        return jsonify({"error": "Message cannot be empty."}), 400

    with get_db() as connection:
        if conversation_id is None:
            cursor = connection.execute(
                "INSERT INTO conversations (user_id, title) VALUES (?, ?)",
                (session["user_id"], message[:80]),
            )
            conversation_id = cursor.lastrowid
            new_conversation = True
        else:
            owned = connection.execute(
                "SELECT id FROM conversations WHERE id = ? AND user_id = ?",
                (conversation_id, session["user_id"]),
            ).fetchone()
            if not owned:
                return jsonify({"error": "Conversation not found."}), 404
            new_conversation = False
        message_id = connection.execute(
            "INSERT INTO messages (conversation_id, role, content) VALUES (?, 'user', ?)",
            (conversation_id, message),
        ).lastrowid

    try:
        language = reply_language(message)
        history = [] if new_conversation else recent_history(conversation_id, message_id)
        result = get_rag_chain().invoke({
            "input": search_query(message, language, history),
            "language": language,
            "history": history_messages(history),
        })
        answer = str(result.get("answer", "")).strip()
        if not answer:
            raise RuntimeError("The retrieval chain returned no answer.")
        sources = extract_sources(result.get("context", []))
    except Exception:
        logger.exception("Chat request failed")
        with get_db() as connection:
            if new_conversation:
                # Don't leave an empty conversation in the history list.
                connection.execute("DELETE FROM messages WHERE conversation_id = ?", (conversation_id,))
                connection.execute("DELETE FROM conversations WHERE id = ?", (conversation_id,))
            else:
                connection.execute(
                    "DELETE FROM messages WHERE id = (SELECT MAX(id) FROM messages WHERE conversation_id = ?)",
                    (conversation_id,),
                )
        return jsonify({"error": "The assistant is temporarily unavailable."}), 503

    with get_db() as connection:
        connection.execute(
            "INSERT INTO messages (conversation_id, role, content, citations) VALUES (?, 'assistant', ?, ?)",
            (conversation_id, answer, json.dumps(sources, ensure_ascii=False)),
        )
    if new_conversation:
        log_activity("chat", message)
    return jsonify({
        "answer": answer,
        "sources": sources,
        "citations": [source["label"] for source in sources],
        "conversation_id": conversation_id,
    })


@app.get("/api/conversations")
@login_required
def conversations():
    with get_db() as connection:
        rows = connection.execute(
            "SELECT id, title, created_at FROM conversations WHERE user_id = ? ORDER BY id DESC",
            (session["user_id"],),
        ).fetchall()
    return jsonify([dict(row) for row in rows])


@app.get("/api/conversations/<int:conversation_id>")
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
    messages = []
    for row in rows:
        sources = stored_sources(row["citations"])
        messages.append({
            "role": row["role"],
            "content": row["content"],
            "created_at": row["created_at"],
            "sources": sources,
            "citations": [source["label"] for source in sources],
        })
    return jsonify(messages)


@app.post("/api/conversations/<int:conversation_id>/rename")
@login_required
def rename_conversation(conversation_id):
    title = str(json_body().get("title", "")).strip()[:80]
    if not title:
        return jsonify({"error": "Please enter a title."}), 400
    with get_db() as connection:
        updated = connection.execute(
            "UPDATE conversations SET title = ? WHERE id = ? AND user_id = ?",
            (title, conversation_id, session["user_id"]),
        ).rowcount
    if not updated:
        return jsonify({"error": "Conversation not found."}), 404
    return jsonify({"id": conversation_id, "title": title})


@app.post("/api/conversations/<int:conversation_id>/delete")
@login_required
def delete_conversation(conversation_id):
    with get_db() as connection:
        owned = connection.execute(
            "SELECT id FROM conversations WHERE id = ? AND user_id = ?",
            (conversation_id, session["user_id"]),
        ).fetchone()
        if not owned:
            return jsonify({"error": "Conversation not found."}), 404
        connection.execute("DELETE FROM messages WHERE conversation_id = ?", (conversation_id,))
        connection.execute("DELETE FROM conversations WHERE id = ?", (conversation_id,))
    return jsonify({"deleted": conversation_id})


# ---------------------------------------------------------------------------
# Legal tools API
# ---------------------------------------------------------------------------

@app.post("/api/extract-text")
@login_required
@limit("ai", AI_REQUESTS_PER_10_MIN, 10 * 60, per="user")
def extract_text():
    upload = request.files.get("file")
    if not upload or not upload.filename:
        return jsonify({"error": "Please choose a file."}), 400
    extension = upload.filename.rsplit(".", 1)[-1].lower()
    if extension not in ("pdf", "txt", *IMAGE_EXTENSIONS):
        return jsonify({"error": "Only PDF, TXT and image files are supported."}), 400
    raw = upload.read()
    used_ocr = False
    try:
        if extension == "txt":
            text = raw.decode("utf-8", errors="ignore")
        elif extension == "pdf":
            text, pages = pdf_text_layer(raw)
            # A scanned PDF has no text layer, or only a few stray characters per page.
            if len(text.strip()) < 20 * max(pages, 1):
                text, used_ocr = ocr.pdf_to_text(raw), True
        else:
            text, used_ocr = ocr.image_to_text(raw), True
    except ocr.OcrUnavailable:
        return jsonify({"error": "Reading scanned files is not set up on this server."}), 503
    except Exception:
        logger.exception("Text extraction failed")
        return jsonify({"error": "Could not read that file."}), 400
    if not text.strip():
        return jsonify({"error": "No text found in that file."}), 400
    return jsonify({"text": text[:MAX_TEXT_LENGTH], "ocr": used_ocr})


IMAGE_EXTENSIONS = ("png", "jpg", "jpeg", "webp", "tif", "tiff")


def pdf_text_layer(raw):
    from pypdf import PdfReader

    reader = PdfReader(io.BytesIO(raw))
    text = "\n".join(page.extract_text() or "" for page in reader.pages)
    return text, len(reader.pages)


@app.post("/api/contract/analyze")
@login_required
@limit("ai", AI_REQUESTS_PER_10_MIN, 10 * 60, per="user")
def analyze_contract():
    text, error = required_text("text")
    if error:
        return error
    try:
        result = ask_for_json(contract_prompt.format(text=text, language=tool_language()))
        score = float(result.get("riskScore", 0))
    except Exception:
        logger.exception("Contract analysis failed")
        return jsonify({"error": "The contract could not be analyzed right now."}), 503
    result["riskScore"] = max(0, min(100, round(score)))
    log_activity("contract", f"Contract analyzed: {text[:60]}", risk_level(score, 70, 35))
    return jsonify(result)


@app.post("/api/risk/check")
@login_required
@limit("ai", AI_REQUESTS_PER_10_MIN, 10 * 60, per="user")
def check_risk():
    text, error = required_text("text")
    if error:
        return error
    try:
        passages = get_shared_retriever().invoke(text[:2000])
        context = "\n\n".join(doc.page_content for doc in passages)
        result = ask_for_json(risk_prompt.format(context=context, text=text, language=tool_language()))
    except Exception:
        logger.exception("Risk check failed")
        return jsonify({"error": "The document could not be checked right now."}), 503
    level = str(result.get("level", "")).lower()
    result["level"] = level if level in ("low", "medium", "high") else "medium"
    result["steps"] = [str(step) for step in result.get("steps") or []]
    result["sources"] = extract_sources(passages)
    log_activity("risk", f"Risk check: {text[:60]}", result["level"])
    return jsonify(result)


@app.post("/api/documents/generate")
@login_required
@limit("ai", AI_REQUESTS_PER_10_MIN, 10 * 60, per="user")
def generate_document():
    data = json_body()
    document_type = str(data.get("document_type", "")).strip()[:100]
    fields = data.get("fields") or {}
    if not document_type or not isinstance(fields, dict):
        return jsonify({"error": "Choose a document type and fill in the form."}), 400
    details = "\n".join(f"{str(k)[:60]}: {str(v)[:500]}" for k, v in fields.items())
    try:
        document = ask_for_text(document_prompt.format(document_type=document_type, fields=details, language=tool_language()))
        if not document:
            raise ValueError("Empty document")
    except Exception:
        logger.exception("Document generation failed")
        return jsonify({"error": "The document could not be generated right now."}), 503
    log_activity("document", f"{document_type} created")
    return jsonify({"document": document})


@app.post("/api/contact")
@limit("contact", 5, 60 * 60)
def contact():
    data = json_body()
    name = str(data.get("name", "")).strip()[:120]
    email = str(data.get("email", "")).strip()[:200]
    subject = str(data.get("subject", "")).strip()[:200]
    message = str(data.get("message", "")).strip()[:5000]
    if not name or not message or not EMAIL_PATTERN.match(email):
        return jsonify({"error": "Please enter your name, a valid email and a message."}), 400
    with get_db() as connection:
        connection.execute(
            "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
            (name, email, subject, message),
        )
    return jsonify({"message": "Thanks, we will get back to you soon."}), 201


@app.get("/api/dashboard")
@login_required
def dashboard():
    with get_db() as connection:
        counts = {
            row["kind"]: row["total"]
            for row in connection.execute(
                "SELECT kind, COUNT(*) AS total FROM activity WHERE user_id = ? GROUP BY kind",
                (session["user_id"],),
            )
        }
        recent = connection.execute(
            "SELECT kind, title, risk, created_at FROM activity WHERE user_id = ? ORDER BY id DESC LIMIT 8",
            (session["user_id"],),
        ).fetchall()
    return jsonify({"counts": counts, "recent": [dict(row) for row in recent]})


# ---------------------------------------------------------------------------
# Admin API
# ---------------------------------------------------------------------------

@app.get("/api/admin/users")
@login_required
@admin_required
def admin_users():
    with get_db() as connection:
        users = connection.execute(
            "SELECT id, username, is_admin, created_at FROM users ORDER BY id DESC"
        ).fetchall()
    data_files = sorted(p.name for p in DATA_DIR.glob("*") if p.suffix.lower() in {".pdf", ".csv"})
    return jsonify({"users": [dict(row) for row in users], "data_files": data_files})


@app.post("/api/admin/users/<int:user_id>/admin")
@login_required
@admin_required
def set_admin(user_id):
    make_admin = bool((request.get_json(silent=True) or {}).get("is_admin"))
    if user_id == session["user_id"] and not make_admin:
        return jsonify({"error": "You cannot remove your own admin access."}), 400
    with get_db() as connection:
        updated = connection.execute(
            "UPDATE users SET is_admin = ? WHERE id = ?", (int(make_admin), user_id)
        ).rowcount
    if not updated:
        return jsonify({"error": "User not found."}), 404
    return jsonify({"id": user_id, "is_admin": make_admin})


@app.get("/api/admin/messages")
@login_required
@admin_required
def admin_messages():
    with get_db() as connection:
        rows = connection.execute(
            "SELECT id, name, email, subject, message, created_at FROM contact_messages"
            " ORDER BY id DESC LIMIT 200"
        ).fetchall()
    return jsonify({"messages": [dict(row) for row in rows]})


@app.post("/api/admin/messages/<int:message_id>/delete")
@login_required
@admin_required
def delete_message(message_id):
    with get_db() as connection:
        deleted = connection.execute(
            "DELETE FROM contact_messages WHERE id = ?", (message_id,)
        ).rowcount
    if not deleted:
        return jsonify({"error": "Message not found."}), 404
    return jsonify({"deleted": message_id})


@app.post("/api/admin/upload")
@login_required
@admin_required
def upload_document():
    global _retriever, _rag_chain
    upload = request.files.get("document")
    if not upload or not upload.filename or not allowed_file(upload.filename):
        return jsonify({"error": "Only PDF and CSV files are supported."}), 400
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    destination = DATA_DIR / secure_filename(upload.filename)
    upload.save(destination)
    try:
        chunks = split_into_chunks(load_all_documents(str(DATA_DIR)))
        index_documents(chunks, get_embeddings())
    except Exception:
        logger.exception("Document indexing failed for %s", destination)
        destination.unlink(missing_ok=True)
        return jsonify({"error": "The document could not be indexed."}), 503
    _retriever = None
    _rag_chain = None
    return jsonify({"message": f"{destination.name} uploaded and indexed."})


# ---------------------------------------------------------------------------
# Law updates (synced from the official Laws of Bangladesh website)
# ---------------------------------------------------------------------------

_sync_lock = threading.Lock()


@app.get("/api/law-updates")
def law_updates():
    limit = min(request.args.get("limit", 20, type=int), 200)
    with get_db() as connection:
        rows = connection.execute(
            "SELECT act_id, title, change_type, sections, detected_at FROM law_updates ORDER BY id DESC LIMIT ?",
            (limit,),
        ).fetchall()
        last_sync = connection.execute(
            "SELECT finished_at, status FROM sync_runs WHERE finished_at IS NOT NULL ORDER BY id DESC LIMIT 1"
        ).fetchone()
        tracked = connection.execute("SELECT COUNT(*) FROM laws WHERE tracked = 1").fetchone()[0]
    site = os.getenv("LAWS_SITE_URL", "http://bdlaws.minlaw.gov.bd")
    updates = [
        {
            **dict(row),
            "sections": json.loads(row["sections"] or "[]"),
            "url": f"{site}/act-{row['act_id']}.html",
        }
        for row in rows
    ]
    return jsonify({"updates": updates, "last_sync": dict(last_sync) if last_sync else None, "tracked": tracked})


def run_sync_in_background():
    from src.law_sync import sync

    with _sync_lock:
        sync(progress=logger.info)


@app.post("/api/admin/sync-laws")
@login_required
@admin_required
def start_law_sync():
    if _sync_lock.locked():
        return jsonify({"error": "A law check is already running."}), 409
    threading.Thread(target=run_sync_in_background, daemon=True).start()
    return jsonify({"message": "Law check started. This can take a while."}), 202


@app.get("/api/admin/sync-status")
@login_required
@admin_required
def law_sync_status():
    with get_db() as connection:
        run = connection.execute("SELECT * FROM sync_runs ORDER BY id DESC LIMIT 1").fetchone()
        tracked = connection.execute("SELECT COUNT(*) FROM laws WHERE tracked = 1").fetchone()[0]
    return jsonify({"run": dict(run) if run else None, "running": _sync_lock.locked(), "tracked": tracked})


@app.errorhandler(413)
def too_large(_error):
    return jsonify({"error": "File is larger than 16 MB."}), 413


# ---------------------------------------------------------------------------
# React frontend
# ---------------------------------------------------------------------------

@app.get("/", defaults={"path": ""})
@app.get("/<path:path>")
def frontend(path):
    if path.startswith("api/"):
        return jsonify({"error": "Not found."}), 404
    if path and (FRONTEND_DIST / path).is_file():
        return send_from_directory(FRONTEND_DIST, path)
    if not (FRONTEND_DIST / "index.html").is_file():
        return "Frontend is not built. Run `npm run build` inside the frontend folder.", 503
    return send_from_directory(FRONTEND_DIST, "index.html")


with app.app_context():
    init_db()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8080")), debug=False)
