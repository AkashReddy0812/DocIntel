# src/llm_integration/ollama_client.py

import requests
import os


class OllamaClient:
    def __init__(self, model: str = "mistral"):
        self.model = model
        self.url = os.getenv(
            "OLLAMA_URL",
            "http://localhost:11434/api/chat"
        )

    def generate(self, prompt: str) -> str:
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "stream": False
        }

        response = requests.post(
            self.url,
            json=payload,
            timeout=120
        )

        if response.status_code != 200:
            print("\n===== OLLAMA RAW ERROR =====")
            print(response.text)
            print("===== END OLLAMA ERROR =====\n")
            raise RuntimeError("Ollama request failed")

        data = response.json()

        if "message" not in data:
            raise RuntimeError(f"Unexpected Ollama response: {data}")

        return data["message"]["content"]
