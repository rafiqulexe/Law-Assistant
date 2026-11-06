"""Build the Pinecone index from every PDF and CSV in the Data folder.

Run after setting PINECONE_API_KEY (and optionally PINECONE_INDEX_NAME):
    python store_index.py

Chunk ids are stable, so running it again updates vectors instead of adding duplicates.
"""
import os
import time

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
started = time.time()


def report(done, total, skipped=0):
    elapsed = time.time() - started
    note = f", {skipped} already there" if skipped else ""
    print(f"{done}/{total} chunks ({done * 100 // total}%) - {elapsed / 60:.1f} min{note}", flush=True)


documents = load_all_documents(data_dir)
chunks = split_into_chunks(documents)
print(f"Loaded {len(documents)} documents, split into {len(chunks)} chunks.", flush=True)

index_documents(chunks, download_hugging_face_embeddings(), on_progress=report)
print(f"Done. Indexed into Pinecone index '{index_name()}'.")
