"""Publish the app to a Hugging Face Space (Docker) and set its settings.

Needs in .env:
    HF_TOKEN       a Hugging Face token with write access
    HF_SPACE       the Space, for example "your-name/bidhanshala"
    SPACE_LLM_API_KEY   the hosted LLM key (Gemini by default)
Optional: SPACE_LLM_MODEL, SPACE_LLM_BASE_URL, SPACE_ADMIN_USERNAMES.
SPACE_SECRET_KEY is created on the first run and added to .env.
PINECONE_API_KEY and PINECONE_INDEX_NAME are taken from the same .env.

Usage: python deploy_space.py
"""
import os
import secrets
import sys

from dotenv import load_dotenv
from huggingface_hub import HfApi

load_dotenv()

# Front matter that tells Hugging Face how to run the Space.
SPACE_README = """---
title: Bidhanshala
emoji: ⚖️
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# Bidhanshala (বিধানশালা)

Bangladesh law, in one place: answers with sections, contract checks and legal documents.
Legal information, not legal advice.
"""

# Only what the image needs. The law PDFs/CSVs are already in Pinecone.
UPLOAD = ["Dockerfile", ".dockerignore", "app.py", "wsgi.py", "setup.py", "requirements.txt",
          "sync_laws.py", "LICENSE", "src/*.py", "frontend/**"]
SKIP = ["frontend/node_modules/**", "frontend/dist/**", "**/__pycache__/**"]

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"


def required(name, value):
    if not value:
        sys.exit(f"Missing {name} in .env")
    return value


def space_secret_key():
    """Made once and saved to .env, so redeploying does not sign everyone out."""
    key = os.getenv("SPACE_SECRET_KEY")
    if not key:
        key = secrets.token_hex(32)
        with open(".env", "a", encoding="utf-8") as env:
            env.write(f"\nSPACE_SECRET_KEY={key}\n")
    return key


def main():
    token = required("HF_TOKEN", os.getenv("HF_TOKEN"))
    space = required("HF_SPACE", os.getenv("HF_SPACE"))
    api = HfApi(token=token)

    api.create_repo(space, repo_type="space", space_sdk="docker", exist_ok=True)

    secret_values = {
        "SECRET_KEY": space_secret_key(),
        "PINECONE_API_KEY": required("PINECONE_API_KEY", os.getenv("PINECONE_API_KEY")),
        "LLM_API_KEY": required("SPACE_LLM_API_KEY", os.getenv("SPACE_LLM_API_KEY")),
    }
    variables = {
        "PINECONE_INDEX_NAME": required("PINECONE_INDEX_NAME", os.getenv("PINECONE_INDEX_NAME")),
        "LLM_PROVIDER": "openai",
        "LLM_MODEL": os.getenv("SPACE_LLM_MODEL") or "gemini-2.5-flash",
        "LLM_BASE_URL": os.getenv("SPACE_LLM_BASE_URL") or GEMINI_URL,
        "ADMIN_USERNAMES": os.getenv("SPACE_ADMIN_USERNAMES", ""),
    }
    if os.getenv("EMBEDDING_MODEL"):
        variables["EMBEDDING_MODEL"] = os.getenv("EMBEDDING_MODEL")

    for key, value in secret_values.items():
        api.add_space_secret(space, key, value)
    for key, value in variables.items():
        api.add_space_variable(space, key, value)

    api.upload_folder(folder_path=".", repo_id=space, repo_type="space",
                      allow_patterns=UPLOAD, ignore_patterns=SKIP,
                      commit_message="Update app")
    api.upload_file(path_or_fileobj=SPACE_README.encode("utf-8"), path_in_repo="README.md",
                    repo_id=space, repo_type="space", commit_message="Space settings")

    owner, name = space.split("/")
    print(f"Uploaded. Build log: https://huggingface.co/spaces/{space}")
    print(f"Site: https://{owner.lower()}-{name.lower().replace('_', '-')}.hf.space")


if __name__ == "__main__":
    main()
