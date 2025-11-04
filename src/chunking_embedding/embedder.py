from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def get_embeddings(text_chunks):
    return model.encode(text_chunks)

if __name__ == "__main__":
    chunks = ["DocIntel extracts data", "It uses LLMs for analysis"]
    print(get_embeddings(chunks).shape)
