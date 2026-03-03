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
        """Fallback keyword-based scoring."""
        text_lower = text.lower()
        keywords = ['urgent', 'verify', 'account', 'security', 'suspended', 'login', 'click', 'identity', 'unauthorized', 'bonus']
        matches = [kw for kw in keywords if kw in text_lower]
        score = min(len(matches) * 15, 100)
        
        return {
            "risk_score": score,
            "classification": "Malicious" if score >= 65 else ("Suspicious" if score >= 35 else "Safe"),
            "note": "Heuristic fallback"
        }

nlp_engine = NLPEngine()
