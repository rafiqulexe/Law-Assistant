import os
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def database_path():
    # Read at call time so a .env loaded after import still applies.
    return Path(os.getenv("DATABASE_PATH", BASE_DIR / "instance" / "law_assistant.db"))


def get_db():
    path = database_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(path)
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
            CREATE TABLE IF NOT EXISTS activity (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL REFERENCES users(id),
                kind TEXT NOT NULL CHECK(kind IN ('chat', 'contract', 'risk', 'document')),
                title TEXT NOT NULL,
                risk TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                subject TEXT,
                message TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            -- Every act listed on the official site. Tracked acts are embedded and kept current.
            CREATE TABLE IF NOT EXISTS laws (
                act_id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                year TEXT,
                tracked INTEGER NOT NULL DEFAULT 0,
                section_hashes TEXT,
                first_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                last_checked TEXT,
                last_changed TEXT
            );
            CREATE TABLE IF NOT EXISTS law_updates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                act_id INTEGER NOT NULL REFERENCES laws(act_id),
                title TEXT NOT NULL,
                change_type TEXT NOT NULL CHECK(change_type IN ('new', 'amended')),
                sections TEXT,
                detected_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS sync_runs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                finished_at TEXT,
                status TEXT NOT NULL DEFAULT 'running',
                acts_checked INTEGER NOT NULL DEFAULT 0,
                updates_found INTEGER NOT NULL DEFAULT 0,
                error TEXT
            );
            """
        )
