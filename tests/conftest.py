"""Test setup: a fresh SQLite file per test and no real LLM or Pinecone calls."""
import os
import tempfile
from pathlib import Path

import pytest

# Must be set before app.py is imported (it checks SECRET_KEY and creates the DB).
os.environ["SECRET_KEY"] = "test-secret"
os.environ["DATABASE_PATH"] = str(Path(tempfile.mkdtemp()) / "import.db")

import app as webapp  # noqa: E402
from src import rate_limit  # noqa: E402
from src.database import get_db, init_db  # noqa: E402


class FakeDocument:
    def __init__(self, text, **metadata):
        self.page_content = text
        self.metadata = metadata


THEFT_SECTION = FakeDocument(
    "379. Whoever commits theft shall be punished...",
    source="http://bdlaws.minlaw.gov.bd/act-11.html",
    act_title="The Penal Code, 1860",
    section="Punishment for theft",
    updated_at="2026-11-07",
)


class FakeChain:
    """Stands in for the retrieval chain and remembers what it was asked."""

    def __init__(self):
        self.calls = []
        self.fail = False

    def invoke(self, inputs):
        self.calls.append(inputs)
        if self.fail:
            raise RuntimeError("model is down")
        return {"answer": "Up to three years. This is legal information, not legal advice.",
                "context": [THEFT_SECTION]}


class FakeRetriever:
    def invoke(self, _text):
        return [THEFT_SECTION]


@pytest.fixture
def chain(monkeypatch):
    fake = FakeChain()
    monkeypatch.setattr(webapp, "get_rag_chain", lambda: fake)
    return fake


@pytest.fixture(autouse=True)
def fresh_app(tmp_path, monkeypatch):
    monkeypatch.setenv("DATABASE_PATH", str(tmp_path / "test.db"))
    init_db()
    rate_limit.reset()
    monkeypatch.setattr(webapp, "translate_to_english", lambda text, history=None: "What is the punishment for theft?")
    monkeypatch.setattr(webapp, "get_shared_retriever", lambda: FakeRetriever())
    webapp.app.config["TESTING"] = True
    yield


@pytest.fixture
def client():
    return webapp.app.test_client()


class Api:
    """Test client that handles the CSRF token like frontend/src/api/client.js."""

    def __init__(self, client):
        self.client = client
        self.token = client.get("/api/csrf").get_json()["csrf_token"]

    def get(self, url):
        return self.client.get(url)

    def post(self, url, body=None, **kwargs):
        response = self.client.post(url, json=body, headers={"X-CSRFToken": self.token}, **kwargs)
        data = response.get_json(silent=True) or {}
        if data.get("csrf_token"):
            self.token = data["csrf_token"]
        return response

    def sign_up(self, username="rafiq", password="password123", admin=False):
        self.post("/api/register", {"username": username, "password": password})
        if admin:
            with get_db() as connection:
                connection.execute("UPDATE users SET is_admin = 1 WHERE username = ?", (username,))
        return self.post("/api/login", {"username": username, "password": password})


@pytest.fixture
def api(client):
    return Api(client)


@pytest.fixture
def user(api):
    api.sign_up()
    return api
