import re

def parse_insights(raw_text: str):
    """
    OCR-safe insight parser (NO LLM).
    Works even if text is noisy.
    """

    # ---------- CLEAN ----------
    text = raw_text.replace("\n", " ")
    text = re.sub(r"[^a-zA-Z0-9.,() ]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    # ---------- SUMMARY ----------
    summary = text[:400] + "..." if len(text) > 400 else text

    # ---------- KEY POINTS ----------
    sentences = re.split(r"[.]", text)
    key_points = [
        s.strip()
        for s in sentences
        if 40 < len(s.strip()) < 160
    ][:5]

    # ---------- ENTITIES ----------
    words = text.split()
    entities = list({
        w for w in words
        if w.istitle() and len(w) > 4
    })[:10]

    return {
        "summary": summary,
        "key_points": key_points,
        "entities": entities
    }
