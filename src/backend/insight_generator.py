import os
from dotenv import load_dotenv
from groq import Groq

# Load env INSIDE this file
load_dotenv(dotenv_path="src/.env")


def generate_insights_llm(raw_text: str) -> dict:
    """
    Uses Groq LLM to generate:
    - summary
    - key points
    - entities
    """

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY not found in environment")

    # ✅ Client created INSIDE function (IMPORTANT)
    client = Groq(api_key=api_key)

    prompt = f"""
You are an AI that extracts structured insights from documents.

Return STRICT JSON in this format:
{{
  "summary": "...",
  "key_points": ["...", "..."],
  "entities": ["...", "..."]
}}

Rules:
- Summary: 3–5 sentences, clean English
- Key points: max 6 bullets
- Entities: important technical terms only
- No markdown
- No explanations outside JSON

DOCUMENT:
\"\"\"
{raw_text[:4000]}
\"\"\"
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )

    content = response.choices[0].message.content.strip()

    try:
        import json
        return json.loads(content)
    except Exception:
        # Fallback safety
        return {
            "summary": content[:500],
            "key_points": [],
            "entities": [],
        }
