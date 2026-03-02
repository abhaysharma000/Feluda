import joblib
import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, '..', 'models')

class ModelLoader:
    """Singleton class to load ML models securely into memory once during API startup."""
    def __init__(self):
        self.url_model = None
        self.text_model = None
        self.vectorizer = None
        self.load_models()

    def load_models(self):
        url_model_path = os.path.join(MODELS_DIR, 'url_rf_model.pkl')
        text_model_path = os.path.join(MODELS_DIR, 'text_lr_model.pkl')
        vectorizer_path = os.path.join(MODELS_DIR, 'tfidf_vectorizer.pkl')
        
        try:
            if os.path.exists(url_model_path):
                self.url_model = joblib.load(url_model_path)
            if os.path.exists(text_model_path):
                self.text_model = joblib.load(text_model_path)
            if os.path.exists(vectorizer_path):
                self.vectorizer = joblib.load(vectorizer_path)
        except Exception as e:
            print(f"Warning: Model loading failed ({e}). Have you run train.py?", file=sys.stderr)

# Initialize mapping in memory globally
ml_registry = ModelLoader()
