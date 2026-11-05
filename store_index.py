"""Build the Pinecone index from every PDF and CSV in the Data folder.

Run once after setting PINECONE_API_KEY (and optionally PINECONE_INDEX_NAME):
    python store_index.py
"""
import os

from dotenv import load_dotenv

from src.helper import (
    download_hugging_face_embeddings,
    index_documents,
    index_name,
    load_all_documents,
    split_into_chunks,
)

load_dotenv()

data_dir = os.getenv("DATA_DIR", "Data")

documents = load_all_documents(data_dir)
chunks = split_into_chunks(documents)
print(f"Loaded {len(documents)} documents, split into {len(chunks)} chunks.")

index_documents(chunks, download_hugging_face_embeddings())
print(f"Indexed into Pinecone index '{index_name()}'.")
