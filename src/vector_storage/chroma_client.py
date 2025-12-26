# vector_storage/chroma_client.py

import chromadb
from chromadb.config import Settings

class ChromaStore:
    def __init__(self, collection_name="docs"):
        self.client = chromadb.Client(
            Settings(persist_directory="./chroma_db")
        )
        self.collection = self.client.get_or_create_collection(
            name=collection_name
        )

    def add(self, ids, embeddings, documents):
        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=documents
        )

    def query(self, embedding, top_k=5):
        results = self.collection.query(
            query_embeddings=[embedding],
            n_results=top_k
        )
        return results["documents"][0]
