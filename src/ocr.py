"""Reads text from scanned PDFs and photos of documents with Tesseract."""

import io
import logging
import os
import shutil

logger = logging.getLogger(__name__)

OCR_LANGUAGES = os.getenv("OCR_LANGUAGES", "ben+eng")
OCR_MAX_PAGES = int(os.getenv("OCR_MAX_PAGES", "20"))
# Pages render at 72 dpi times this scale; 3 gives about 216 dpi, enough for Bangla letters.
RENDER_SCALE = 3
WINDOWS_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


class OcrUnavailable(Exception):
    """Tesseract or its language data is missing on this server."""


def tesseract_command():
    command = os.getenv("TESSERACT_CMD") or shutil.which("tesseract")
    if not command and os.path.exists(WINDOWS_PATH):
        command = WINDOWS_PATH
    return command


def use_tessdata_dir():
    # TESSDATA_DIR points at a folder holding ben.traineddata and eng.traineddata.
    # The env var works on every OS; a quoted --tessdata-dir flag breaks on Windows.
    folder = os.getenv("TESSDATA_DIR")
    if folder:
        os.environ["TESSDATA_PREFIX"] = folder


def images_to_text(images):
    import pytesseract

    command = tesseract_command()
    if not command:
        raise OcrUnavailable("Tesseract is not installed")
    pytesseract.pytesseract.tesseract_cmd = command
    use_tessdata_dir()
    pages = []
    try:
        for image in images:
            pages.append(pytesseract.image_to_string(image, lang=OCR_LANGUAGES))
    except pytesseract.TesseractError as error:
        # Usually a missing language file, such as ben.traineddata.
        logger.error("Tesseract failed: %s", error)
        raise OcrUnavailable(str(error)) from error
    return "\n\n".join(page.strip() for page in pages)


def pdf_pages(raw):
    """Yields each page of a PDF as an image, up to OCR_MAX_PAGES."""
    import pypdfium2 as pdfium

    pdf = pdfium.PdfDocument(raw)
    try:
        for index in range(min(len(pdf), OCR_MAX_PAGES)):
            yield pdf[index].render(scale=RENDER_SCALE).to_pil()
    finally:
        pdf.close()


def pdf_to_text(raw):
    return images_to_text(pdf_pages(raw))


def image_to_text(raw):
    from PIL import Image

    return images_to_text([Image.open(io.BytesIO(raw))])
