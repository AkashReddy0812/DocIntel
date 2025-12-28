import chromadb

class ChromaStore:
    def __init__(self, persist_dir="chroma_db"):
        self.client = chromadb.Client(
            chromadb.config.Settings(
                persist_directory=persist_dir
            )
        )

        self.collection = self.client.get_or_create_collection(
            name="docintel"
        )

    def add(self, ids, embeddings, documents, metadatas=None):
        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas
        )

    def query(self, embedding, top_k=5):
        result = self.collection.query(
            query_embeddings=[embedding],
            n_results=top_k
        )
        return result["documents"][0]
