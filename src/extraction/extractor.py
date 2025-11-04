import fitz  # PyMuPDF
import pdfplumber

def extract_text_pymupdf(path):
    doc = fitz.open(path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def extract_text_pdfplumber(path):
    with pdfplumber.open(path) as pdf:
        text = "".join(page.extract_text() or "" for page in pdf.pages)
    return text

if __name__ == "__main__":
    sample = "data/samples/sample.pdf"
    print(extract_text_pymupdf(sample)[:500])
