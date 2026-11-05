import json
import os
import re

from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_community.document_loaders import CSVLoader, DirectoryLoader, PyPDFLoader
from langchain_core.prompts import ChatPromptTemplate
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import OllamaLLM
from langchain_pinecone import PineconeVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter


def index_name():
    return os.getenv("PINECONE_INDEX_NAME", "lawbot")


def load_csv_documents(folder_path):
    csv_docs = []
    for filename in os.listdir(folder_path):
        if filename.lower().endswith(".csv"):
            csv_docs.extend(CSVLoader(file_path=os.path.join(folder_path, filename)).load())
    return csv_docs


def load_pdf_documents(folder_path):
    return DirectoryLoader(folder_path, glob="**/*.pdf", loader_cls=PyPDFLoader).load()


def load_all_documents(folder_path):
    return load_csv_documents(folder_path) + load_pdf_documents(folder_path)


def split_into_chunks(docs, chunk_size=1000, chunk_overlap=200):
    return RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap
    ).split_documents(docs)


def download_hugging_face_embeddings():
    return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")


def load_existing_index(embedding_model):
    return PineconeVectorStore.from_existing_index(
        index_name=index_name(), embedding=embedding_model
    )


def index_documents(documents, embedding_model):
    PineconeVectorStore.from_documents(documents, embedding_model, index_name=index_name())


def get_llm(json_mode=False):
    return OllamaLLM(
        model=os.getenv("OLLAMA_MODEL", "llama3"),
        base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
        temperature=float(os.getenv("OLLAMA_TEMPERATURE", "0.2")),
        num_predict=int(os.getenv("OLLAMA_MAX_TOKENS", "2048")),
        format="json" if json_mode else "",
    )


def get_retriever(embedding_model):
    vector_store = load_existing_index(embedding_model)
    return vector_store.as_retriever(
        search_type="similarity", search_kwargs={"k": int(os.getenv("RETRIEVAL_K", "4"))}
    )


def build_rag_chain(retriever, system_prompt):
    prompt = ChatPromptTemplate.from_messages(
        [("system", system_prompt), ("human", "{input}")]
    )
    return create_retrieval_chain(
        retriever, create_stuff_documents_chain(get_llm(), prompt)
    )


def parse_json_reply(reply):
    """Models sometimes wrap JSON in prose or code fences, so pull out the object."""
    try:
        return json.loads(reply)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", reply, re.S)
        if not match:
            raise ValueError("The model did not return JSON.")
        return json.loads(match.group(0))


def ask_for_json(prompt_text):
    return parse_json_reply(get_llm(json_mode=True).invoke(prompt_text))


def ask_for_text(prompt_text):
    return get_llm().invoke(prompt_text).strip()
