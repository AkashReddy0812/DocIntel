import gradio as gr
from src.extraction.extractor import extract_text_pymupdf

def analyze_doc(file):
    text = extract_text_pymupdf(file.name)
    return text[:1000]  # preview

gr.Interface(fn=analyze_doc, inputs="file", outputs="text", title="DocIntel Demo").launch()
