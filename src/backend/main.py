from dotenv import load_dotenv
import os
import tempfile
import uuid

from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel

from src.backend.state import uploaded_documents, document_insights
from src.extraction.extractor import extract_text_from_pdf
from src.chunking_embedding.chunker import chunk_text
from src.chunking_embedding.embedder import Embedder
from src.vector_storage.chroma_client import ChromaStore
from src.rag_pipeline.rag_engine import RAGEngine
from src.backend.insight_generator import generate_insights_llm

# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv(dotenv_path="src/.env")

# -----------------------------
# FastAPI app
# -----------------------------
app = FastAPI(title="DocIntel Backend")

# -----------------------------
# Models
# -----------------------------
class ChatRequest(BaseModel):
    question: str

# -----------------------------
# Initialize RAG once
# -----------------------------
rag_engine = RAGEngine()

# -----------------------------
# CHAT ENDPOINT
# -----------------------------
@app.post("/api/chat")
def chat(req: ChatRequest):
    answer = rag_engine.query(req.question)
    return {"answer": answer}

# -----------------------------
# INGEST FUNCTION
# -----------------------------
def ingest_pdf(pdf_path: str, filename: str, doc_id: str):
    print("[INGEST] Extracting text...")
    raw_text = extract_text_from_pdf(pdf_path)

    if not raw_text.strip():
        raise ValueError("No extractable text found in PDF")

    print("[INGEST] Chunking text...")
    chunks = chunk_text(raw_text)

    if not chunks:
        raise ValueError("Chunking failed — no chunks created")

    texts = [c["text"] for c in chunks if c["text"].strip()]
    if not texts:
        raise ValueError("No valid chunk text for embedding")

    print(f"[INGEST] Total chunks: {len(texts)}")

    embedder = Embedder()
    print("[INGEST] Generating embeddings...")
    embeddings = embedder.embed(texts)

    if len(embeddings) == 0:
        raise ValueError("Embedding generation failed")

    store = ChromaStore()

    print("[INGEST] Storing vectors in Chroma...")
    store.add(
        ids=[str(uuid.uuid4()) for _ in texts],
        embeddings=embeddings.tolist(),
        documents=texts,
        metadatas=[{"doc_id": doc_id, "chunk_id": i} for i in range(len(texts))],
    )

    # -----------------------------
    # 🔥 LLM INSIGHTS
    # -----------------------------
    # -----------------------------
# 🔥 LLM INSIGHTS (IMPROVED)
# -----------------------------
    print("[INSIGHTS] Generating LLM-based insights...")
    insights = generate_insights_llm(raw_text)

# ---- Clean & normalize output ----
    summary = insights.get("summary", "").strip()

    key_points = [
    kp.strip()
    for kp in insights.get("key_points", [])
    if isinstance(kp, str) and len(kp.strip()) > 20
]

    entities = list({
    e.strip()
    for e in insights.get("entities", [])
    if isinstance(e, str) and 2 < len(e.strip()) < 40
})

    document_insights[doc_id] = {
    "summary": summary[:800],          # hard limit
    "key_points": key_points[:6],      # max 6
    "entities": entities[:10],         # max 10
}


    print("[INGEST] Completed successfully.")

# -----------------------------
# PDF UPLOAD ENDPOINT
# -----------------------------
@app.post("/api/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    doc_id = str(uuid.uuid4())

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        ingest_pdf(tmp_path, file.filename, doc_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        os.remove(tmp_path)

    uploaded_documents.append({
        "id": doc_id,
        "name": file.filename
    })

    return {
        "status": "success",
        "id": doc_id,
        "filename": file.filename
    }

# -----------------------------
# DOCUMENT LIST ENDPOINT
# -----------------------------
@app.get("/api/documents")
def get_documents():
    return uploaded_documents

# -----------------------------
# INSIGHTS ENDPOINT
# -----------------------------
@app.get("/api/insights/{doc_id}")
def get_insights(doc_id: str):
    if doc_id not in document_insights:
        raise HTTPException(status_code=404, detail="Insights not found")
    return document_insights[doc_id]
