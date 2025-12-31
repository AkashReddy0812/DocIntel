# src/rag_pipeline/rag_engine.py

from src.chunking_embedding.embedder import Embedder
from src.vector_storage.chroma_client import ChromaStore
from src.llm_integration.groq_client import GroqClient



class RAGEngine:
    def __init__(self):
        self.embedder = Embedder()
        self.store = ChromaStore()  # MUST point to same persistent DB
        self.llm = GroqClient(model="llama-3.1-8b-instant")


    def query(self, question: str, top_k: int = 5) -> str:
        print("[RAG] Embedding query...")
        query_embedding = self.embedder.embed([question])[0]

        print("[RAG] Retrieving relevant chunks...")
        contexts = self.store.query(
            embedding=query_embedding,
            top_k=top_k
        )

        if not contexts:
            return "No relevant information found in the document."

        print(f"[RAG] Retrieved {len(contexts)} chunks")

        context_block = "\n\n".join(contexts)

        prompt = f"""
You are a precise research assistant.

Answer ONLY using the context below.
If the answer is not present in the context, say:
"I could not find the answer in the document."

Context:
{context_block}

Question:
{question}
"""

        print("[RAG] Sending prompt to LLM...")
        return self.llm.generate(prompt)
