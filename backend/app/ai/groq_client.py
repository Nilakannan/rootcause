import json
import logging
import re
from typing import Dict, Any, Optional
from groq import Groq
from ..config import settings

logger = logging.getLogger("rca.groq")

class GroqAIClient:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY.strip() if settings.GROQ_API_KEY else ""
        self.primary_model = settings.GROQ_MODEL
        self.fallback_model = settings.GROQ_FALLBACK_MODEL
        self.client = None
        if self.api_key:
            try:
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Error initializing Groq client: {e}")

    def clean_json_response(self, text: str) -> str:
        """Strip markdown code fences and whitespace from LLM output."""
        text = text.strip()
        # Find ```json ... ``` or ``` ... ```
        fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
        if fence_match:
            return fence_match.group(1).strip()
        # Look for first { to last }
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            return text[start:end+1]
        return text

    def call_llm(self, system_prompt: str, user_prompt: str, temperature: float = 0.2) -> Dict[str, Any]:
        """Calls Groq API with fallback model logic and returns parsed JSON dict."""
        if not self.client:
            raise ValueError("Groq API client is not initialized. Please verify GROQ_API_KEY.")

        models_to_try = [self.primary_model, self.fallback_model, "qwen/qwen3.8-27b", "openai/gpt-oss-20b"]
        last_error = None

        for model in models_to_try:
            try:
                logger.info(f"Executing Groq chat completion with model: {model}")
                response = self.client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=temperature,
                    response_format={"type": "json_object"}
                )
                raw_text = response.choices[0].message.content
                cleaned = self.clean_json_response(raw_text)
                parsed = json.loads(cleaned)
                logger.info(f"Groq completion succeeded with model: {model}")
                return parsed
            except Exception as e:
                logger.warning(f"Failed with model {model}: {e}")
                last_error = e

        # If json_object mode caused an issue or models failed, try standard completion without response_format
        for model in [self.fallback_model, "qwen/qwen3.8-27b"]:
            try:
                response = self.client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_prompt + "\nIMPORTANT: Return ONLY valid JSON."},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=temperature
                )
                raw_text = response.choices[0].message.content
                cleaned = self.clean_json_response(raw_text)
                parsed = json.loads(cleaned)
                return parsed
            except Exception as e:
                last_error = e

        raise RuntimeError(f"All Groq models failed. Last error: {last_error}")

    def call_chat_freeform(self, messages: list, temperature: float = 0.3) -> str:
        """Call Groq for conversational refinement / chat with the AI investigator."""
        models_to_try = [self.primary_model, self.fallback_model, "qwen/qwen3.8-27b"]
        for model in models_to_try:
            try:
                resp = self.client.chat.completions.create(
                    model=model,
                    messages=messages,
                    temperature=temperature
                )
                return resp.choices[0].message.content
            except Exception as e:
                logger.warning(f"Chat freeform failed on {model}: {e}")
        return "I encountered an error querying the model. Please check the API key configuration."

groq_ai_client = GroqAIClient()
