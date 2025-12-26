import fitz  # PyMuPDF
import pdfplumber

def extract_text_from_pdf(path: str) -> str:
    """
    Extract text from PDF.
    Tries PyMuPDF first, falls back to pdfplumber.
    """

    try:
        doc = fitz.open(path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text.strip()

    except Exception as e:
        print(f"[WARN] PyMuPDF failed: {e}")
        print("[INFO] Falling back to pdfplumber")

        with pdfplumber.open(path) as pdf:
            return "".join(page.extract_text() or "" for page in pdf.pages).strip()
