# backend/main.py

from src.extraction.extractor import extract_text_from_pdf
from src.chunking_embedding.chunker import chunk_text
from src.chunking_embedding.embedder import Embedder
from src.vector_storage.chroma_client import ChromaStore
from src.rag_pipeline.rag_engine import RAGEngine

import uuid


def ingest_pdf(pdf_path: str):
    print("[INGEST] Extracting text...")
    raw_text = extract_text_from_pdf(pdf_path)

    print("[INGEST] Chunking text...")
    chunks = chunk_text(raw_text)

    print(f"[INGEST] Total chunks: {len(chunks)}")

    embedder = Embedder()
    texts = [c["text"] for c in chunks]

    print("[INGEST] Generating embeddings...")
    embeddings = embedder.embed(texts)

    store = ChromaStore()  # MUST be persistent

    print("[INGEST] Storing vectors in Chroma...")
    store.add(
        ids=[str(uuid.uuid4()) for _ in texts],
        embeddings=embeddings.tolist(),
        documents=texts,
        metadatas=[{"chunk_id": i} for i in range(len(texts))]
    )

    print("[INGEST] Completed successfully.")


def ask(question: str):
    rag = RAGEngine()
    return rag.query(question)


if __name__ == "__main__":
    ingest_pdf("data/samples/sample.pdf")

    answer = ask("how many phases are there in the document?")
    print("\n=== ANSWER ===\n")
    print(answer)
