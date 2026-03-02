import re
import os
from dotenv import load_dotenv

load_dotenv()

# OpenAI is optional — gracefully skip if not installed or no key
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False


class EmailAnalyzer:
    """
    Hybrid email phishing analyzer:
    1. Local keyword detection (instant)
    2. Urgency pattern detection (regex)
    3. OpenAI GPT-4o-mini semantic analysis (if API key available)
    """

    SUSPICIOUS_KEYWORDS = [
        'urgent', 'immediate action', 'account suspended', 'verify identity',
        'unauthorized access', 'click here', 'login to secure', 'gift card',
        'tax refund', 'lottery winner', 'your account has been', 'confirm your',
        'update your billing', 'limited time', 'act now', 'reset your password',
    ]

    URGENCY_PATTERNS = [
        r'!{2,}',                    # multiple exclamation marks
        r'\bNOW\b',                  # "NOW" as standalone word
        r'\bimmediately\b',
        r'within \d+ hours?',
        r'expires? in \d+',
        r'\burgent\b',
    ]

    # Supported model with fallback
    OPENAI_MODEL = "gpt-4o-mini"
    OPENAI_FALLBACK_MODEL = "gpt-3.5-turbo"

    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = None
        if OPENAI_AVAILABLE and self.api_key:
            try:
                self.client = OpenAI(api_key=self.api_key)
            except Exception as e:
                print(f"OpenAI client init failed: {e}")

    def analyze_text(self, text: str) -> dict:
        # ── 1. Keyword detection ──────────────────────────────
        text_lower = text.lower()
        found_keywords = [kw for kw in self.SUSPICIOUS_KEYWORDS if kw in text_lower]
        keyword_score = min(len(found_keywords) * 10, 100)

        # ── 2. Urgency tone detection ─────────────────────────
        has_urgency = any(
            re.search(pattern, text, re.IGNORECASE)
            for pattern in self.URGENCY_PATTERNS
        )

        # ── 3. OpenAI semantic analysis ───────────────────────
        ai_analysis = "AI Analysis skipped: OpenAI API key not configured."
        if self.client:
            ai_analysis = self._call_openai(text)

        return {
            "keyword_matches": found_keywords,
            "keyword_score": keyword_score,
            "urgency_detected": has_urgency,
            "ai_semantic_analysis": ai_analysis,
        }

    def _call_openai(self, text: str) -> str:
        """Call OpenAI with primary model, fallback to gpt-3.5-turbo on model errors."""
        system_prompt = (
            "You are a cybersecurity expert specializing in phishing email detection. "
            "Analyze the following email content and provide: "
            "1) A phishing probability score from 0 to 100, "
            "2) A risk level (Low / Medium / High / Critical), "
            "3) A concise explanation of the key indicators. "
            "Respond in under 100 words."
        )
        for model in [self.OPENAI_MODEL, self.OPENAI_FALLBACK_MODEL]:
            try:
                response = self.client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": f"Email Content:\n\n{text[:3000]}"},
                    ],
                    max_tokens=200,
                    temperature=0.2,
                )
                return response.choices[0].message.content
            except Exception as e:
                error_str = str(e)
                if "model" in error_str.lower() or "not found" in error_str.lower():
                    continue  # Try fallback model
                return f"AI Analysis failed: {error_str}"
        return "AI Analysis failed: No supported OpenAI model available."


email_analyzer = EmailAnalyzer()
