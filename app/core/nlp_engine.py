import joblib
import os
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

class NLPEngine:
    """
    NLP-based scam detection using TF-IDF and Logistic Regression.
    Identifies patterns in emails and suspicious text.
    """
    def __init__(self):
        base_dir = os.path.dirname(os.path.dirname(__file__))
        self.model_path = os.path.join(base_dir, 'models', 'nlp_scam_model.pkl')
        self.vectorizer_path = os.path.join(base_dir, 'models', 'nlp_vectorizer.pkl')
        self.model = None
        self.vectorizer = None
        
        if os.path.exists(self.model_path) and os.path.exists(self.vectorizer_path):
            try:
                self.model = joblib.load(self.model_path)
                self.vectorizer = joblib.load(self.vectorizer_path)
            except Exception as e:
                print(f"WARNING: Could not load NLP model — {e}")

    def predict(self, text: str) -> dict:
        """
        Analyze text for scam patterns.
        Returns probability and classification.
        """
        if not text:
            return {"risk_score": 0, "classification": "Safe"}
            
        if self.model and self.vectorizer:
            try:
                processed_text = self._preprocess(text)
                vectorized = self.vectorizer.transform([processed_text])
                prob = self.model.predict_proba(vectorized)[0][1] # Probability of class 1 (Scam)
                risk_score = prob * 100
                
                return {
                    "risk_score": round(risk_score, 1),
                    "classification": "Malicious" if risk_score >= 65 else ("Suspicious" if risk_score >= 35 else "Safe")
                }
            except Exception as e:
                print(f"NLP Prediction Error: {e}")
        
        # Fallback to keyword-based heuristic if model not available
        return self._heuristic_analysis(text)

    def _preprocess(self, text: str) -> str:
        """Simple text normalization."""
        text = text.lower()
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        return text

    def _heuristic_analysis(self, text: str) -> dict:
        """Enhanced heuristic analysis targeting Social Engineering."""
        text_lower = text.lower()
        
        # 1. General Suspicious Keywords
        keywords = ['urgent', 'verify', 'account', 'security', 'suspended', 'login', 'click', 'identity', 'unauthorized', 'bonus']
        keyword_matches = [kw for kw in keywords if kw in text_lower]
        
        # 2. Social Engineering Patterns (Fake Messages / Scams)
        se_patterns = {
            'Lottery/Prize': r'\b(won|winner|lottery|jackpot|prize|reward|gift card)\b',
            'Emergency/Fear': r'\b(help|urgent|immediate|arrest|police|legal|threat|lawsuit)\b',
            'OTP/Account': r'\b(otp|verification code|password reset|verify account|locked|restricted)\b',
            'Financial/Bank': r'\b(bank|transfer|refund|payment|invoice|overdue|billing|crypto|wallet)\b'
        }
        
        se_matches = []
        for category, pattern in se_patterns.items():
            if re.search(pattern, text_lower):
                se_matches.append(category)
                
        # 3. Calculate Score
        score = len(keyword_matches) * 10 + len(se_matches) * 20
        score = min(score, 100)
        
        explanation = []
        if keyword_matches: explanation.append(f"Suspicious keywords: {', '.join(keyword_matches[:3])}")
        if se_matches: explanation.append(f"Social engineering triggers: {', '.join(se_matches)}")
        
        return {
            "risk_score": score,
            "classification": "Malicious" if score >= 65 else ("Suspicious" if score >= 35 else "Safe"),
            "social_engineering_indicators": se_matches,
            "explanation": explanation,
            "note": "Advanced Heuristic Analysis"
        }

nlp_engine = NLPEngine()
