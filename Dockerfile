# Image for Hugging Face Spaces (Docker SDK). Also runs anywhere Docker does.

# 1. Build the React frontend.
FROM node:22-slim AS frontend
WORKDIR /build
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# 2. The Flask app, with Tesseract for scanned files.
FROM python:3.12-slim
RUN apt-get update \
    && apt-get install -y --no-install-recommends tesseract-ocr tesseract-ocr-ben tesseract-ocr-eng \
    && rm -rf /var/lib/apt/lists/*

# Spaces run the container as user 1000.
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    HF_HOME=/home/user/.cache/huggingface \
    PYTHONUNBUFFERED=1
WORKDIR /home/user/app

# CPU-only PyTorch keeps the image about 2 GB smaller.
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir --user --default-timeout=120 --retries 10 torch --index-url https://download.pytorch.org/whl/cpu \
    && grep -v "^-e" requirements.txt > /tmp/requirements.txt \
    && pip install --no-cache-dir --user --default-timeout=120 --retries 10 -r /tmp/requirements.txt gunicorn

# Download the embedding model now so the first question is not slow.
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')"

COPY --chown=user . .
COPY --chown=user --from=frontend /build/dist frontend/dist

ENV PORT=7860 \
    DATABASE_PATH=/home/user/app/instance/law_assistant.db \
    SESSION_COOKIE_SECURE=1 \
    SESSION_COOKIE_SAMESITE=None \
    TRUST_PROXY=1
EXPOSE 7860

# One worker: rate limits and the law-check lock live in memory.
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--workers", "1", "--threads", "8", "--timeout", "180", "wsgi:application"]
