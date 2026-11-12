import hashlib
import json
import os
import re
import time

from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_community.document_loaders import CSVLoader, DirectoryLoader, PyPDFLoader
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import OllamaLLM
from langchain_pinecone import PineconeVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter


def index_name():
    return os.getenv("PINECONE_INDEX_NAME", "lawbot-multi")


def load_csv_documents(folder_path):
    csv_docs = []
    for filename in os.listdir(folder_path):
        if filename.lower().endswith(".csv"):
            path = os.path.join(folder_path, filename)
            # Windows defaults to cp1252, but the law datasets are UTF-8.
            csv_docs.extend(CSVLoader(file_path=path, encoding="utf-8").load())
    return csv_docs


def load_pdf_documents(folder_path):
    return DirectoryLoader(folder_path, glob="**/*.pdf", loader_cls=PyPDFLoader).load()


def load_all_documents(folder_path):
    return load_csv_documents(folder_path) + load_pdf_documents(folder_path)


def split_into_chunks(docs, chunk_size=1000, chunk_overlap=200):
    return RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap
    ).split_documents(docs)


DEFAULT_EMBEDDING_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"


def download_hugging_face_embeddings():
    # The multilingual model maps Bangla and English questions into the same space,
    # so a Bangla question can find the English law text. Both models are 384-dim.
    return HuggingFaceEmbeddings(model_name=os.getenv("EMBEDDING_MODEL", DEFAULT_EMBEDDING_MODEL))


def load_existing_index(embedding_model):
    return PineconeVectorStore.from_existing_index(
        index_name=index_name(), embedding=embedding_model
    )


def chunk_id(chunk):
    """Stable id from source, position and text, so re-indexing overwrites instead of duplicating."""
    meta = chunk.metadata or {}
    key = f"{meta.get('source')}|{meta.get('page', meta.get('row'))}|{chunk.page_content}"
    return hashlib.sha1(key.encode("utf-8")).hexdigest()


def ensure_index(dimension=384):
    from pinecone import Pinecone, ServerlessSpec

    client = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
    if not client.has_index(index_name()):
        client.create_index(
            name=index_name(),
            dimension=dimension,
            metric="cosine",
            spec=ServerlessSpec(
                cloud=os.getenv("PINECONE_CLOUD", "aws"),
                region=os.getenv("PINECONE_REGION", "us-east-1"),
            ),
        )


def existing_ids(store, ids):
    # Fetch in groups of 100 to keep the request URL short.
    found = set()
    for start in range(0, len(ids), 100):
        group = ids[start:start + 100]
        for attempt in range(5):
            try:
                # Without a timeout a dropped connection can hang the run forever.
                result = store.index.fetch(ids=group, _request_timeout=30)
                break
            except Exception:
                if attempt == 4:
                    raise
                time.sleep(5 * (attempt + 1))
        found.update(result.vectors.keys())
    return found


def index_documents(documents, embedding_model, batch_size=500, on_progress=None):
    ensure_index()
    store = PineconeVectorStore(index_name=index_name(), embedding=embedding_model)
    for start in range(0, len(documents), batch_size):
        batch = documents[start:start + batch_size]
        ids = [chunk_id(chunk) for chunk in batch]
        # Skip chunks a previous, interrupted run already uploaded.
        done = existing_ids(store, ids)
        todo = [(chunk, cid) for chunk, cid in zip(batch, ids) if cid not in done]
        if todo:
            store.add_documents([c for c, _ in todo], ids=[i for _, i in todo])
        if on_progress:
            on_progress(start + len(batch), len(documents), skipped=len(done))


def hosted_llm(json_mode):
    """Any service with an OpenAI-style API: OpenAI itself, or Gemini, Groq and
    others through LLM_BASE_URL. Used where Ollama cannot run (shared hosting)."""
    from langchain_core.output_parsers import StrOutputParser
    from langchain_openai import ChatOpenAI

    options = {"response_format": {"type": "json_object"}} if json_mode else {}
    chat = ChatOpenAI(
        model=os.getenv("LLM_MODEL", "gpt-4o-mini"),
        api_key=os.getenv("LLM_API_KEY") or os.getenv("OPENAI_API_KEY"),
        base_url=os.getenv("LLM_BASE_URL") or None,
        temperature=float(os.getenv("OLLAMA_TEMPERATURE", "0.2")),
        max_tokens=int(os.getenv("OLLAMA_MAX_TOKENS", "2048")),
        timeout=120,
        model_kwargs=options,
    )
    # Chat models return a message object; the rest of the code expects plain text.
    return chat | StrOutputParser()


def get_llm(json_mode=False):
    if os.getenv("LLM_PROVIDER", "ollama").lower() != "ollama":
        return hosted_llm(json_mode)
    return OllamaLLM(
        model=os.getenv("OLLAMA_MODEL", "gemma3:12b"),
        base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
        temperature=float(os.getenv("OLLAMA_TEMPERATURE", "0.2")),
        num_predict=int(os.getenv("OLLAMA_MAX_TOKENS", "2048")),
        format="json" if json_mode else "",
    )


def get_retriever(embedding_model):
    vector_store = load_existing_index(embedding_model)
    return vector_store.as_retriever(
        search_type="similarity", search_kwargs={"k": int(os.getenv("RETRIEVAL_K", "6"))}
    )


def build_rag_chain(retriever, system_prompt):
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            # Earlier turns of the conversation, so follow-up questions make sense.
            MessagesPlaceholder("history", optional=True),
            ("human", "{input}"),
        ]
    )
    return create_retrieval_chain(
        retriever, create_stuff_documents_chain(get_llm(), prompt)
    )


def translate_to_english(text, history=None):
    """Standalone English version of a question, used only to improve search.

    With history, a follow-up like "what is its punishment?" is rewritten to name
    the subject from the earlier turns.
    """
    rules = (
        "Use the formal terms found in statutes (for example 'cheque is dishonoured', "
        "not 'check bounces'). Do not add 'in Bangladesh' or 'under the law'. "
        "Reply with the English question only.\n\n"
    )
    # Only the user's own questions: the assistant's replies (often "I don't know")
    # pull the rewrite away from the topic.
    questions = [content[:300] for role, content in history or [] if role == "user"]
    if not questions:
        prompt = "Translate this legal question into one short English question. " + rules + text
    else:
        prompt = (
            "A user is asking follow-up questions about one legal topic.\n"
            "Earlier questions:\n" + "".join(f"- {q}\n" for q in questions[-2:]) +
            f"Follow-up question: {text}\n\n"
            "Rewrite the follow-up as one short English question that keeps the subject "
            "of the earlier questions (for example the offence, document or act they are "
            "about), unless the follow-up clearly names a new subject. "
            "Example: previous 'What is theft?', follow-up 'What is its punishment?' "
            "becomes 'What is the punishment for theft?'. " + rules
        )
    return get_llm().invoke(prompt).strip().splitlines()[0][:300]


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
