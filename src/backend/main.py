# backend/main.py

from src.extraction.extractor import extract_text_from_pdf
from src.chunking_embedding.chunker import chunk_text
from src.chunking_embedding.embedder import Embedder
from src.vector_storage.chroma_client import ChromaStore
from src.rag_pipeline.rag_engine import RAGEngine

import uuid

def ingest_pdf(pdf_path):
    raw_text = extract_text_from_pdf(pdf_path)

    chunks = chunk_text(raw_text)

    embedder = Embedder()
    embeddings = embedder.embed([c["text"] for c in chunks])

    store = ChromaStore()

    store.add(
        ids=[str(uuid.uuid4()) for _ in chunks],
        embeddings=embeddings.tolist(),
        documents=[c["text"] for c in chunks]
    )

def ask(question):
    rag = RAGEngine()
    return rag.query(question)


if __name__ == "__main__":
    ingest_pdf("data/samples/sample.pdf")
    print(ask("What is this document about?"))
