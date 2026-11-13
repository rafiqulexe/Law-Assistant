"""Readable act and section names for law library chunks that have no act_title.

CSV rows are indexed as "column: value" lines, so the act title is often in the
chunk text. A long row is split into several chunks and the middle ones lose
those lines, so those are looked up by row number in the CSV when it is present.
"""
import csv
import os
import re
import sys
from functools import lru_cache
from pathlib import Path

EMPTY = {"", "-", "nan", "none"}


def clean(value):
    value = (value or "").strip()
    return "" if value.lower() in EMPTY else value


def fields_in_text(text):
    found = {}
    for key in ("law_title", "section_name"):
        match = re.search(rf"^{key}: (.*)$", text or "", re.M)
        if match:
            found[key] = clean(match.group(1))
    return found


def data_folder():
    return Path(os.getenv("DATA_DIR", Path(__file__).resolve().parent.parent / "Data"))


@lru_cache(maxsize=4)
def csv_rows(filename):
    """Row number -> (law_title, section_name) for one CSV in the data folder."""
    path = data_folder() / filename
    if not path.is_file():
        return {}
    csv.field_size_limit(min(sys.maxsize, 2**31 - 1))
    rows = {}
    with open(path, encoding="utf-8", newline="") as handle:
        for number, row in enumerate(csv.DictReader(handle)):
            rows[number] = (clean(row.get("law_title")), clean(row.get("section_name")))
    return rows


def file_name(source):
    # Sources indexed on Windows use backslashes, which Path on Linux keeps.
    return re.split(r"[\\/]", source)[-1]


def file_title(source):
    """'penal code of bangladesh .pdf' -> 'Penal Code of Bangladesh'."""
    stem = file_name(source)
    stem = re.sub(r"\.(pdf|csv)$", "", stem, flags=re.I).strip(" .")
    words = re.sub(r"[_\s]+", " ", stem).split()
    small = {"of", "and", "in", "the", "on", "for"}
    return " ".join(
        w if w.isupper() else (w.lower() if i and w.lower() in small else w.capitalize())
        for i, w in enumerate(words)
    )


def act_and_section(metadata, text):
    """Best known (act, section) for a chunk; either can be empty."""
    source = str(metadata.get("source", ""))
    found = fields_in_text(text)
    act, section = found.get("law_title", ""), found.get("section_name", "")
    row = metadata.get("row")
    if source.lower().endswith(".csv") and isinstance(row, (int, float)) and not (act and section):
        known = csv_rows(file_name(source)).get(int(row), ("", ""))
        act, section = act or known[0], section or known[1]
    if not act and not source.lower().endswith(".csv"):
        act = file_title(source)
    return act, section
