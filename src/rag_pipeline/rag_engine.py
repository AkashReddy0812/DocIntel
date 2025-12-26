# rag_pipeline/rag_engine.py

from src.chunking_embedding.embedder import Embedder
from src.vector_storage.chroma_client import ChromaStore
from src.llm_integration.ollama_client import OllamaClient

class RAGEngine:
    def __init__(self):
        self.embedder = Embedder()
        self.store = ChromaStore()
        self.llm = OllamaClient()

    def query(self, question: str, top_k=5):
        query_embedding = self.embedder.embed([question])[0]

        contexts = self.store.query(
            embedding=query_embedding,
            top_k=top_k
        )

        context_block = "\n\n".join(contexts)

        prompt = f"""
You are a precise research assistant.
Answer ONLY using the context below.
If the answer is not present, say so.

Context:
{context_block}

Question:
{question}
"""

        return self.llm.generate(prompt)
