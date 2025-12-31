import os
from groq import Groq

class GroqClient:
    def __init__(self, model="llama3-8b-8192"):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = model

    def generate(self, prompt: str) -> str:
        completion = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a helpful research assistant."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
        )

        return completion.choices[0].message.content.strip()
