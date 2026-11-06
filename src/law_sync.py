"""Keep the law library in step with the official Laws of Bangladesh website.

Each run:
  1. reads the chronological index of all acts,
  2. records acts it has never seen (new laws are tracked automatically),
  3. downloads every tracked act and compares it section by section,
  4. re-embeds acts whose text changed and writes a row to law_updates.
No approval step: users are notified through the law_updates table.
"""
import hashlib
import json
import logging
import os
import re
import time

import requests
from bs4 import BeautifulSoup
from langchain_core.documents import Document

from src.database import get_db
from src.helper import (
    download_hugging_face_embeddings,
    index_name,
    split_into_chunks,
)

logger = logging.getLogger(__name__)

SITE = os.getenv("LAWS_SITE_URL", "http://bdlaws.minlaw.gov.bd")
REQUEST_DELAY = float(os.getenv("LAW_SYNC_DELAY", "2"))
HEADERS = {"User-Agent": "LexAI law sync (Bangladesh legal information project)"}

# Core acts that were in the original PDF library. More can be tracked from the admin panel.
CORE_ACTS = {
    11: "The Penal Code, 1860",
    75: "The Code of Criminal Procedure, 1898",
    24: "The Evidence Act, 1872",
    46: "The Negotiable Instruments Act, 1881",
    462: "The Special Powers Act, 1974",
    38: "The Arms Act, 1878",
    1256: "Dowry Prohibition Act, 2018",
    901: "Artha Rin Adalat Ain, 2003",
    914: "Anti-Corruption Commission Act, 2004",
}

INDEX_ROW = re.compile(
    r'<tr>\s*<td>\s*<a href="/act-(\d+)\.html">\s*(.*?)\s*</a>\s*</td>'
    r'(?:\s*<td>.*?</td>)?\s*<td>\s*<a[^>]*>\s*(.*?)\s*</a>\s*</td>\s*</tr>',
    re.S,
)


# ---------------------------------------------------------------------------
# Fetching and parsing
# ---------------------------------------------------------------------------

def fetch(path, retries=3):
    for attempt in range(retries):
        try:
            response = requests.get(SITE + path, headers=HEADERS, timeout=60)
            response.raise_for_status()
            time.sleep(REQUEST_DELAY)
            return decode(response.content)
        except requests.RequestException:
            if attempt == retries - 1:
                raise
            time.sleep(10 * (attempt + 1))


def decode(raw):
    # Most pages are UTF-16, the print pages are UTF-8.
    if raw.startswith(b"\xff\xfe") or raw.startswith(b"\xfe\xff"):
        return raw.decode("utf-16")
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        return raw.decode("utf-16", errors="replace")
    # UTF-16 text read as UTF-8 is full of NUL characters.
    return raw.decode("utf-16", errors="replace") if "\x00" in text else text


def read_index():
    """Return {act_id: (title, year)} for every act on the site."""
    html = fetch("/laws-of-bangladesh-chronological-index.html")
    acts = {}
    for act_id, title, year in INDEX_ROW.findall(html):
        acts[int(act_id)] = (clean(title), clean(year))
    # Some rows use a different layout; fall back to the first link text for those.
    for act_id, title in re.findall(r'<a href="/act-(\d+)\.html">\s*(.*?)\s*</a>', html, re.S):
        acts.setdefault(int(act_id), (clean(title), ""))
    return acts


def read_act(act_id):
    """Return (title or None, [(section_name, text), ...]) from the act's print page."""
    soup = BeautifulSoup(fetch(f"/act-print-{act_id}.html"), "html.parser")
    title_tag = soup.find("title")
    # Print pages usually have no <title>; the caller falls back to the index title.
    title = clean(title_tag.get_text()) if title_tag else None
    sections = []
    for row in soup.select("div.lineremoves"):
        head = row.select_one("div.txt-head")
        body = row.select_one("div.txt-details")
        if not body:
            continue
        text = clean(body.get_text(" "))
        if text:
            sections.append((clean(head.get_text(" ")) if head else "", text))
    return title, sections


def clean(text):
    return re.sub(r"\s+", " ", text or "").strip()


SECTION_NUMBER = re.compile(r"^\s*([0-9০-৯]+[A-Za-z]*)\s*[.।]")


def section_key(index, name, text):
    """'379|Punishment for theft'. Many sections share names like '[Repealed]',
    so the section number keeps them apart; position is the last resort."""
    match = SECTION_NUMBER.match(text)
    number = match.group(1) if match else f"#{index}"
    return f"{number}|{name}"


def section_hashes(sections):
    return {
        section_key(index, name, text): hashlib.sha1(text.encode("utf-8")).hexdigest()
        for index, (name, text) in enumerate(sections)
    }


def describe_key(key):
    number, name = key.split("|", 1)
    return name if number.startswith("#") else f"Section {number} - {name}"


def changed_sections(old, new):
    changed = [describe_key(key) for key, value in new.items() if old.get(key) != value]
    removed = [f"{describe_key(key)} (removed)" for key in old if key not in new]
    return changed + removed


# ---------------------------------------------------------------------------
# Vector store
# ---------------------------------------------------------------------------

def act_documents(act_id, title, sections, updated_at):
    url = f"{SITE}/act-{act_id}.html"
    return [
        Document(
            page_content=f"{title}\n{name}\n{text}",
            metadata={
                "source": url,
                "act_id": act_id,
                "act_title": title,
                "section": name,
                "updated_at": updated_at,
            },
        )
        for name, text in sections
    ]


def replace_act_vectors(act_id, documents, embedding_model):
    from langchain_pinecone import PineconeVectorStore

    store = PineconeVectorStore(index_name=index_name(), embedding=embedding_model)
    prefix = f"law-{act_id}-"
    old_ids = [vid for page in store.index.list(prefix=prefix) for vid in page]
    for start in range(0, len(old_ids), 1000):
        store.index.delete(ids=old_ids[start:start + 1000])
    chunks = split_into_chunks(documents)
    ids = [f"{prefix}{number}" for number in range(len(chunks))]
    for start in range(0, len(chunks), 200):
        store.add_documents(chunks[start:start + 200], ids=ids[start:start + 200])
    return len(chunks)


# ---------------------------------------------------------------------------
# Sync
# ---------------------------------------------------------------------------

def record_update(connection, act_id, title, change_type, sections):
    connection.execute(
        "INSERT INTO law_updates (act_id, title, change_type, sections) VALUES (?, ?, ?, ?)",
        (act_id, title, change_type, json.dumps(sections[:50], ensure_ascii=False)),
    )


BANGLA_DIGITS = str.maketrans("০১২৩৪৫৬৭৮৯", "0123456789")


def is_recent(year):
    """Laws from this year (or the last LAW_SYNC_RECENT_YEARS years) count as recent news."""
    years = int(os.getenv("LAW_SYNC_RECENT_YEARS", "1"))
    current = int(time.strftime("%Y"))
    digits = year.translate(BANGLA_DIGITS)
    return digits.isdigit() and int(digits) > current - years


def register_acts(connection, acts, first_run):
    """Add unseen acts and return the ids that should be announced as new laws.

    First run: track the core acts, plus this year's acts so recent laws show up at once.
    Later runs: any act not seen before is a new law, so it is tracked and announced.
    """
    known = {row["act_id"] for row in connection.execute("SELECT act_id FROM laws")}
    new_ids = []
    for act_id, (title, year) in acts.items():
        if act_id in known:
            continue
        announce = (not first_run) or is_recent(year)
        tracked = 1 if (act_id in CORE_ACTS or announce) else 0
        connection.execute(
            "INSERT INTO laws (act_id, title, year, tracked) VALUES (?, ?, ?, ?)",
            (act_id, title, year.translate(BANGLA_DIGITS), tracked),
        )
        if announce:
            new_ids.append(act_id)
    return new_ids


def sync(limit=None, progress=print):
    """Run one sync. Returns a summary dict."""
    with get_db() as connection:
        run_id = connection.execute("INSERT INTO sync_runs DEFAULT VALUES").lastrowid

    checked = updates = 0
    try:
        acts = read_index()
        with get_db() as connection:
            first_run = connection.execute("SELECT COUNT(*) FROM laws").fetchone()[0] == 0
            new_ids = set(register_acts(connection, acts, first_run))
            tracked = [
                dict(row) for row in connection.execute(
                    "SELECT act_id, title, section_hashes FROM laws WHERE tracked = 1 ORDER BY act_id"
                )
            ]
        progress(f"{len(acts)} acts on the site, {len(tracked)} tracked, {len(new_ids)} new.")

        embeddings = download_hugging_face_embeddings()
        for law in tracked[:limit]:
            act_id = law["act_id"]
            try:
                page_title, sections = read_act(act_id)
                title = page_title or law["title"]
            except Exception:
                logger.exception("Could not read act %s", act_id)
                continue
            checked += 1
            if not sections:
                continue

            new_hashes = section_hashes(sections)
            old_hashes = json.loads(law["section_hashes"] or "{}")
            if new_hashes == old_hashes:
                with get_db() as connection:
                    connection.execute(
                        "UPDATE laws SET last_checked = CURRENT_TIMESTAMP WHERE act_id = ?", (act_id,)
                    )
                progress(f"[{checked}/{len(tracked)}] {title}: no change")
                continue

            today = time.strftime("%Y-%m-%d")
            chunk_count = replace_act_vectors(
                act_id, act_documents(act_id, title, sections, today), embeddings
            )
            with get_db() as connection:
                connection.execute(
                    """UPDATE laws SET title = ?, section_hashes = ?, last_checked = CURRENT_TIMESTAMP,
                       last_changed = CURRENT_TIMESTAMP WHERE act_id = ?""",
                    (title, json.dumps(new_hashes), act_id),
                )
                # First download: a new law is news, a core act is just the baseline.
                if not old_hashes and act_id not in CORE_ACTS:
                    record_update(connection, act_id, title, "new", [])
                    updates += 1
                elif old_hashes:
                    record_update(connection, act_id, title, "amended", changed_sections(old_hashes, new_hashes))
                    updates += 1
            progress(f"[{checked}/{len(tracked)}] {title}: indexed {chunk_count} chunks")

        status, error = "done", None
    except Exception as exc:
        logger.exception("Law sync failed")
        status, error = "failed", str(exc)[:500]

    with get_db() as connection:
        connection.execute(
            """UPDATE sync_runs SET finished_at = CURRENT_TIMESTAMP, status = ?, acts_checked = ?,
               updates_found = ?, error = ? WHERE id = ?""",
            (status, checked, updates, error, run_id),
        )
    return {"status": status, "acts_checked": checked, "updates_found": updates, "error": error}
