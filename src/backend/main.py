from fastapi import FastAPI, UploadFile
from src.extraction.extractor import extract_text_pymupdf

app = FastAPI(title="DocIntel API")

@app.get("/")
def root():
    return {"message": "Welcome to DocIntel"}

@app.post("/upload")
async def upload_doc(file: UploadFile):
    text = extract_text_pymupdf(file.file)
    return {"filename": file.filename, "content_length": len(text)}
