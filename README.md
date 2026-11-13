# Bidhanshala (বিধানশালা) - Bangladesh law, in one place

Bidhanshala answers questions about Bangladesh law using retrieval-augmented generation.
Law documents (PDF/CSV) from the `Data/` folder are embedded into Pinecone, and an
Ollama model answers from the retrieved passages, with the source shown for every answer.

## Features

- **Legal chat** - questions in English or Bangla, answers grounded in the law library,
  source citations and per-user conversation history.
- **Contract analyzer** - paste text or upload a PDF, TXT or a photo of the document to get a
  summary, key terms, risks, recommendations and a risk score, downloadable as a PDF report.
  Scanned pages and photos are read with OCR (Bangla and English).
- **Risk checker** - compliance review of a document against passages from the law library.
- **Document generator** - NDAs, service agreements, rental agreements and more,
  downloadable as PDF.
- **Live law updates** - the library is synced with the official Laws of Bangladesh website
  (bdlaws.minlaw.gov.bd). New laws and amended sections are embedded automatically, and every
  page shows a bold "Recent update" bar linking to the Law Updates page.
- **Dashboard** - your activity history and usage counts.
- **Admin panel** - upload PDF/CSV law documents, run the official law check, view users.
- Accounts with hashed passwords, session cookies and CSRF protection.

## Project structure

```
app.py              Flask JSON API + serves the built React app
src/helper.py       document loading, Pinecone and Ollama helpers
src/prompt.py       prompts for chat and the legal tools
src/ocr.py          reads scanned PDFs and photos with Tesseract
store_index.py      builds the Pinecone index from Data/
sync_laws.py        checks the official website for new and amended laws
src/law_sync.py     official website sync logic
src/database.py     SQLite schema and connection
frontend/           React + Vite + Tailwind user interface
Data/               law documents (PDF/CSV)
```

## Configuration

Create a `.env` file in the project root (never commit it):

```env
SECRET_KEY=replace-with-a-long-random-value
PINECONE_API_KEY=your-pinecone-key
PINECONE_INDEX_NAME=lawbot-multi
OLLAMA_MODEL=gemma3:12b
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_TEMPERATURE=0.2
```

Optional: `DATA_DIR`, `DATABASE_PATH`, `FRONTEND_DIST`, `RETRIEVAL_K`, `MAX_TEXT_LENGTH`, `OLLAMA_MAX_TOKENS`,
`EMBEDDING_MODEL` (default `paraphrase-multilingual-MiniLM-L12-v2`, so Bangla questions match English law text),
`LAW_SYNC_DELAY` (seconds between requests to the official site, default 2), `LAW_SYNC_RECENT_YEARS` (default 1),
`SESSION_COOKIE_SECURE=1` (when served over HTTPS).

Hosted LLM (for servers that cannot run Ollama): set `LLM_PROVIDER=openai`, `LLM_API_KEY` and
`LLM_MODEL` (default `gpt-4o-mini`). Any service with an OpenAI-style API works through
`LLM_BASE_URL`, for example Gemini (`https://generativelanguage.googleapis.com/v1beta/openai/`)
or Groq (`https://api.groq.com/openai/v1`). Without `LLM_PROVIDER` the app uses Ollama.

Rate limits: login 10 per 15 minutes and registration 5 per hour for each IP address, the
contact form 5 per hour, and chat plus the AI tools `AI_REQUESTS_PER_10_MIN` (default 30)
for each user. Set `TRUST_PROXY=1` behind a proxy that sends `X-Forwarded-For`
(PythonAnywhere does) and `RATE_LIMITS=0` to switch them off.

OCR: a PDF with almost no text layer, or an image upload, is read with Tesseract.
`TESSDATA_DIR` points at a folder with `ben.traineddata` and `eng.traineddata`,
`TESSERACT_CMD` at the binary if it is not on `PATH`. `OCR_LANGUAGES` (default `ben+eng`) and
`OCR_MAX_PAGES` (default 20) are optional. Without Tesseract the rest of the app works and
scanned uploads get a clear error.

## Running locally

1. Backend (Python 3.10+):

   ```bash
   python -m venv .venv
   source .venv/bin/activate        # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   python store_index.py            # first time only, builds the Pinecone index
   python app.py                    # http://localhost:8080
   ```

2. Ollama must be running with the model pulled: `ollama pull gemma3:12b` (about 8 GB; `llama3.2` works on smaller machines but its Bangla is weak).

   Optional, for scanned files: install Tesseract (Windows: `winget install UB-Mannheim.TesseractOCR`,
   Linux: `apt install tesseract-ocr`), then put the Bangla model in a folder with the English one
   and set `TESSDATA_DIR` to it:

   ```bash
   mkdir -p instance/tessdata
   curl -L -o instance/tessdata/ben.traineddata https://raw.githubusercontent.com/tesseract-ocr/tessdata_best/main/ben.traineddata
   curl -L -o instance/tessdata/eng.traineddata https://raw.githubusercontent.com/tesseract-ocr/tessdata_best/main/eng.traineddata
   ```

3. Frontend:

   ```bash
   cd frontend
   npm install
   npm run dev                      # http://localhost:5173, /api is proxied to Flask
   ```

   For production run `npm run build`; Flask then serves `frontend/dist` at `/`.

## Tests

The API tests use a temporary database and stand-ins for the LLM and Pinecone, so they run
offline in a few seconds:

```bash
pip install -r requirements-dev.txt
python -m pytest
```

## Deploying (PythonAnywhere)

Needs a paid plan: the free one has too little disk for the embedding model and blocks
Pinecone and the official law site.

1. In a Bash console: clone the repository, create a virtualenv and install the packages.
   Install CPU-only PyTorch first to save disk space:

   ```bash
   pip install torch --index-url https://download.pytorch.org/whl/cpu
   pip install -r requirements.txt
   ```

2. Run `npm run build` on your own machine and upload `frontend/dist` (it is not in git).
3. Create `.env` in the project folder with `SECRET_KEY`, `PINECONE_API_KEY`,
   `PINECONE_INDEX_NAME`, the hosted LLM settings above, `SESSION_COOKIE_SECURE=1` and
   `TRUST_PROXY=1`. Keep `DATABASE_PATH` and `DATA_DIR` under `/home/<username>/`.
   For OCR, check `tesseract --version` in a Bash console, download the two
   `.traineddata` files as in "Running locally" into `~/tessdata` and set
   `TESSDATA_DIR=/home/<username>/tessdata`.
4. Web tab: add a web app with manual configuration, set the virtualenv, and make the WSGI
   file import `application` from this project's `wsgi.py`. Turn on "Force HTTPS".
5. Tasks tab: add a daily task that only does the law check on the first of the month:

   ```bash
   [ "$(date +\%d)" = "01" ] && cd ~/Law-Assistant && .venv/bin/python sync_laws.py
   ```

6. Open the site and try sign-up, a chat question and each tool.

## Keeping laws up to date

```bash
python sync_laws.py              # check the official site now
python sync_laws.py --limit 3    # quick test with 3 acts
```

The first run tracks the core acts (Penal Code, CrPC, Evidence Act, Negotiable Instruments Act,
Special Powers Act, Arms Act, Dowry Prohibition Act, Artha Rin Adalat Ain, Anti-Corruption
Commission Act) plus every act published this year. Later runs track any act that appears on
the site for the first time. Changed sections are re-embedded and listed on `/LawUpdates`.
Schedule it monthly, for example as a PythonAnywhere scheduled task, or press **Check now**
in the admin panel.

## Making an admin

Register normally, then set `is_admin` to `1` for that user:

```bash
sqlite3 instance/law_assistant.db "UPDATE users SET is_admin = 1 WHERE username = 'your-name';"
```

## Disclaimer

Bidhanshala provides legal information, not legal advice. Consult a qualified lawyer for your
specific situation.
