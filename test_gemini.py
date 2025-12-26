from src.llm_integration.gemini_client import GeminiClient

llm = GeminiClient()
print(llm.generate("Say hello in one short sentence."))
