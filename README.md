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