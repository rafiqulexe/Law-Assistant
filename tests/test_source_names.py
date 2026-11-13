import app as webapp
from src import source_names
from tests.conftest import FakeDocument


def write_csv(tmp_path, monkeypatch):
    (tmp_path / "laws.csv").write_text(
        ",law_title,section_description,section_name\n"
        '0,"The Evidence Act, 1872",Long text,Relevancy of facts\n'
        "1,-,Other,-\n",
        encoding="utf-8",
    )
    monkeypatch.setenv("DATA_DIR", str(tmp_path))
    source_names.csv_rows.cache_clear()


def test_csv_chunk_names_act_and_section_from_text():
    doc = FakeDocument(
        "law_title: The Penal Code, 1860\nsection_description: Whoever...\nsection_name: Theft",
        source="Data\\bdlaws_ds_formatted.csv", row=5,
    )
    source = webapp.extract_sources([doc])[0]
    assert source["label"] == "The Penal Code, 1860 - Theft"
    assert source["act"] == "The Penal Code, 1860"
    assert source["section"] == "Theft"


def test_csv_middle_chunk_is_looked_up_by_row(tmp_path, monkeypatch):
    write_csv(tmp_path, monkeypatch)
    doc = FakeDocument("...the middle of a long section...", source="Data/laws.csv", row=0)
    assert webapp.citation_label(doc.metadata, doc.page_content) == "The Evidence Act, 1872 - Relevancy of facts"


def test_csv_without_a_title_never_shows_the_file_name(tmp_path, monkeypatch):
    write_csv(tmp_path, monkeypatch)
    doc = FakeDocument("...", source="Data/laws.csv", row=1)
    label = webapp.citation_label(doc.metadata, doc.page_content)
    assert label == "Laws of Bangladesh"


def test_pdf_label_uses_a_readable_title():
    doc = FakeDocument("text", source="Data\\penal code of bangladesh .pdf", page=2)
    assert webapp.citation_label(doc.metadata, doc.page_content) == "Penal Code of Bangladesh (page 3)"
    assert source_names.file_title("artha rin adalat ain 2003 english..pdf") == "Artha Rin Adalat Ain 2003 English"
