import os

from langchain_community.document_loaders import CSVLoader, DirectoryLoader, PyPDFLoader
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.llms import Ollama
from langchain_core.prompts import ChatPromptTemplate
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import Pinecone


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


def load_existing_index(index_name, embedding_model):
    return Pinecone.from_existing_index(
        index_name=index_name, embedding=embedding_model
    )


def index_documents(documents, embedding_model):
    index_name = os.getenv("PINECONE_INDEX_NAME", "lawbot")
    Pinecone.from_documents(
        documents, embedding_model, index_name=index_name
    )


def build_rag_chain(embedding_model, system_prompt):
    vector_store = load_existing_index(
        os.getenv("PINECONE_INDEX_NAME", "lawbot"), embedding_model
    )
    retriever = vector_store.as_retriever(
        search_type="similarity", search_kwargs={"k": int(os.getenv("RETRIEVAL_K", "4"))}
    )
    llm = Ollama(
        model=os.getenv("OLLAMA_MODEL", "llama3"),
        temperature=float(os.getenv("OLLAMA_TEMPERATURE", "0.2")),
    )
    prompt = ChatPromptTemplate.from_messages(
        [("system", system_prompt), ("human", "{input}")]
    )
    return create_retrieval_chain(
        retriever, create_stuff_documents_chain(llm, prompt)
    )
