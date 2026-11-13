import io

import pytest
from pypdf import PdfWriter

import app as webapp
from src import ocr


def blank_pdf(pages=2):
    writer = PdfWriter()
    for _ in range(pages):
        writer.add_blank_page(width=595, height=842)
    buffer = io.BytesIO()
    writer.write(buffer)
    return buffer.getvalue()


def upload(api, raw, filename):
    return api.post("/api/extract-text", data={"file": (io.BytesIO(raw), filename)},
                    content_type="multipart/form-data")


def test_scanned_pdf_goes_through_ocr(user, monkeypatch):
    seen = []
    monkeypatch.setattr(ocr, "pdf_to_text", lambda raw: seen.append(raw) or "ভাড়াটিয়া প্রতি মাসে ভাড়া দেবেন।")
    response = upload(user, blank_pdf(), "scan.pdf")
    assert response.status_code == 200
    assert response.get_json() == {"text": "ভাড়াটিয়া প্রতি মাসে ভাড়া দেবেন।", "ocr": True}
    assert len(seen) == 1


def test_pdf_with_text_skips_ocr(user, monkeypatch):
    monkeypatch.setattr(webapp, "pdf_text_layer", lambda raw: ("The tenant pays rent every month. " * 5, 1))
    monkeypatch.setattr(ocr, "pdf_to_text", lambda raw: pytest.fail("OCR should not run"))
    data = upload(user, blank_pdf(1), "contract.pdf").get_json()
    assert data["ocr"] is False
    assert data["text"].startswith("The tenant pays rent")


def test_photo_goes_through_ocr(user, monkeypatch):
    monkeypatch.setattr(ocr, "image_to_text", lambda raw: "Rent agreement")
    data = upload(user, b"fake image bytes", "photo.JPG").get_json()
    assert data == {"text": "Rent agreement", "ocr": True}


def test_missing_tesseract_is_reported(user, monkeypatch):
    def unavailable(_raw):
        raise ocr.OcrUnavailable("Tesseract is not installed")

    monkeypatch.setattr(ocr, "pdf_to_text", unavailable)
    response = upload(user, blank_pdf(), "scan.pdf")
    assert response.status_code == 503
    assert response.get_json()["error"] == "Reading scanned files is not set up on this server."


def test_empty_ocr_result(user, monkeypatch):
    monkeypatch.setattr(ocr, "pdf_to_text", lambda raw: "  \n ")
    assert upload(user, blank_pdf(), "scan.pdf").status_code == 400


def test_unsupported_file_type(user):
    response = upload(user, b"PK...", "contract.docx")
    assert response.status_code == 400
    assert response.get_json()["error"] == "Only PDF, TXT and image files are supported."


def test_page_limit(monkeypatch):
    pytest.importorskip("pypdfium2")
    monkeypatch.setattr(ocr, "OCR_MAX_PAGES", 2)
    assert len(list(ocr.pdf_pages(blank_pdf(5)))) == 2


@pytest.mark.skipif(not ocr.tesseract_command(), reason="Tesseract is not installed")
def test_real_ocr_reads_printed_english(monkeypatch):
    from PIL import Image, ImageDraw, ImageFont

    image = Image.new("RGB", (900, 160), "white")
    try:
        font = ImageFont.truetype("arial.ttf", 48)
    except OSError:
        font = ImageFont.load_default(size=48)
    ImageDraw.Draw(image).text((30, 50), "The tenant pays rent", fill="black", font=font)
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    monkeypatch.setattr(ocr, "OCR_LANGUAGES", "eng")
    assert "tenant pays rent" in ocr.image_to_text(buffer.getvalue())
