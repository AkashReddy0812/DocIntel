# chunking_embedding/chunker.py

def chunk_text(
    text: str,
    chunk_size: int = 500,
    overlap: int = 100
):
    words = text.split()
    chunks = []

    start = 0
    idx = 0

    while start < len(words):
        end = start + chunk_size
        chunk_words = words[start:end]

        chunks.append({
            "id": idx,
            "text": " ".join(chunk_words)
        })

        idx += 1
        start += chunk_size - overlap

    return chunks
