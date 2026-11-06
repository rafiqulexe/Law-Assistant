# LexAI - Bangladesh Law Assistant

LexAI answers questions about Bangladesh law using retrieval-augmented generation.
Law documents (PDF/CSV) from the `Data/` folder are embedded into Pinecone, and an
Ollama model answers from the retrieved passages, with the source shown for every answer.

## Features

- **Legal chat** - questions in English or Bangla, answers grounded in the law library,
  source citations and per-user conversation history.
- **Contract analyzer** - paste text or upload a PDF/TXT to get a summary, key terms,
  risks, recommendations and a risk score, downloadable as a PDF report.
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

3. Frontend:

   ```bash
   cd frontend
   npm install
   npm run dev                      # http://localhost:5173, /api is proxied to Flask
   ```

   For production run `npm run build`; Flask then serves `frontend/dist` at `/`.

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

## Deploying on PythonAnywhere

1. Clone the repository into `/home/<username>/Law-Assistant`.
2. Build the frontend locally (`cd frontend && npm run build`) and upload `frontend/dist`,
   or build it in a PythonAnywhere console if Node is available.
3. Create a virtualenv, `pip install -r requirements.txt`, and point the web app's
   virtualenv setting at it.
4. Set the WSGI file to import `/home/<username>/Law-Assistant/wsgi.py`.
5. Add the environment variables above. Set `DATABASE_PATH` and `DATA_DIR` to writable
   paths under `/home/<username>/`.
6. Reload the web app.

Generation uses Ollama, so the server must be able to reach an Ollama instance
(`OLLAMA_BASE_URL`). Do not expose an unauthenticated Ollama service to the internet.

## Disclaimer

LexAI provides legal information, not legal advice. Consult a qualified lawyer for your
specific situation.
