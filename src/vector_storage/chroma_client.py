import chromadb
client = chromadb.Client()
collection = client.create_collection("docintel")

collection.add(
    documents=["This is a test document."],
    ids=["1"]
)
print("✅ Vector stored:", collection.count())
