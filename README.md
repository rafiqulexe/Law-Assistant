# Law-Assistant

## Features

- Account login and registration with hashed passwords.
- Per-user conversation history.
- Source citations for retrieved PDF/CSV passages.
- Admin-only PDF/CSV upload and Pinecone indexing.
- English and Bangla responses, with a legal-information disclaimer.

## Configuration

Create a `.env` file (never commit it) with:

```env
SECRET_KEY=replace-with-a-long-random-value
PINECONE_API_KEY=your-pinecone-key
PINECONE_INDEX_NAME=lawbot
OLLAMA_MODEL=llama3
OLLAMA_TEMPERATURE=0.2
```

The first registered account is not automatically an administrator. To grant admin
access, update that user's `is_admin` value to `1` in `instance/law_assistant.db`.

## PythonAnywhere deployment

1. Create a Python 3.10 web app and clone this repository into `/home/<username>/Law-Assistant`.
2. In a Bash console, create a virtual environment and install dependencies:

   ```bash
   cd /home/<username>/Law-Assistant
   python3.10 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

3. Configure the web app's virtualenv as `/home/<username>/Law-Assistant/.venv`.
4. Set the WSGI file to import `/home/<username>/Law-Assistant/wsgi.py`.
5. Add the required environment variables to the web app configuration, including a strong
   `SECRET_KEY`, `PINECONE_API_KEY`, and `PINECONE_INDEX_NAME`. Set `DATABASE_PATH` and
   `DATA_DIR` to writable paths under `/home/<username>/`.
6. Reload the web app and visit `/register`.

The application currently uses Ollama for generation. PythonAnywhere must be able to reach
the configured Ollama service, or `src/helper.py` must be adapted to a hosted LLM before
production deployment. Do not expose an unauthenticated Ollama service to the public internet.

# how to run?
### STEPS:
 Clone the repository

 ''' bash
 Project repo: https://github.com/
 '''

### STEP 1- create a conda environment after opening the repository

 '''bash
conda create -n lawbot python=3.10 -y
'''

'''bash 
conda activate lawbot
'''

### STEP 2 - installthe requirments
'''bash 
pip install -r requirements.txt
'''