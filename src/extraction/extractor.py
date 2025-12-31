import fitz  # PyMuPDF
import pdfplumber
import pytesseract
from PIL import Image
import io

# 🔒 IMPORTANT: Explicit path to tesseract.exe (Windows fix)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def extract_text_from_pdf(path: str) -> str:
    """
    Extract text from PDF using:
    1. PyMuPDF (text PDFs)
    2. pdfplumber (fallback)
    3. OCR (Tesseract) for scanned PDFs
    """

    text = ""

    # -----------------------------
    # 1️⃣ Try PyMuPDF
    # -----------------------------
    try:
        doc = fitz.open(path)
        for page in doc:
            text += page.get_text()
        text = text.strip()
        if text:
            print("[EXTRACT] Text extracted via PyMuPDF")
            return text
    except Exception as e:
        print(f"[WARN] PyMuPDF failed: {e}")

    # -----------------------------
    # 2️⃣ Try pdfplumber
    # -----------------------------
    try:
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        text = text.strip()
        if text:
            print("[EXTRACT] Text extracted via pdfplumber")
            return text
    except Exception as e:
        print(f"[WARN] pdfplumber failed: {e}")

    # -----------------------------
    # 3️⃣ OCR fallback (SCANNED PDF)
    # -----------------------------
    print("[EXTRACT] Falling back to OCR (Tesseract)")

    try:
        doc = fitz.open(path)
        ocr_text = ""

        for page in doc:
            pix = page.get_pixmap(dpi=300)
            img = Image.open(io.BytesIO(pix.tobytes("png")))
            ocr_text += pytesseract.image_to_string(img)

        ocr_text = ocr_text.strip()
        if ocr_text:
            print("[EXTRACT] Text extracted via OCR")
            return ocr_text

    except Exception as e:
        print(f"[ERROR] OCR failed: {e}")

    # -----------------------------
    # ❌ Nothing worked
    # -----------------------------
    return ""
