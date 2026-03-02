import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, '..', 'models')

def train_models():
    print("[*] Beginning Machine Learning Pipeline Initialization...")
    
    # ---------------------------------------------------------
    # 1. URL Random Forest Classifier (Structural Pattern Matching)
    # ---------------------------------------------------------
    print("[*] Training URL Random Forest Model...")
    # Dummy dataset representing extracted URL features
    url_data = pd.DataFrame({
        'url_length': [20, 150, 45, 12, 100, 30, 200, 15, 80, 25],
        'num_dots': [1, 4, 2, 1, 5, 1, 6, 1, 3, 1],
        'has_at_symbol': [0, 1, 0, 0, 1, 0, 1, 0, 1, 0],
        'has_ip': [0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
        'has_suspicious_keywords': [0, 2, 1, 0, 3, 0, 4, 0, 1, 0],
        'is_https': [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
        'special_char_count': [2, 15, 4, 1, 20, 2, 25, 1, 10, 2],
        'subdomain_count': [0, 3, 1, 0, 4, 0, 5, 0, 2, 0],
        'label': [0, 1, 0, 0, 1, 0, 1, 0, 1, 0] # 1 is Phishing, 0 is Safe
    })
    
    X_url = url_data.drop('label', axis=1)
    y_url = url_data['label']
    
    rf_model = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
    rf_model.fit(X_url, y_url)
    
    os.makedirs(MODELS_DIR, exist_ok=True)
    joblib.dump(rf_model, os.path.join(MODELS_DIR, 'url_rf_model.pkl'))
    print(f"[+] Saved URL Random Forest Model to {MODELS_DIR}")
    
    # ---------------------------------------------------------
    # 2. NLP Logistic Regression Classifier (Text Threat Analysis)
    # ---------------------------------------------------------
    print("[*] Training NLP Text Classification Model...")
    # Dummy dataset for text analysis (Tfidf requires strings)
    text_data = pd.DataFrame({
        'text': [
            "Your account needs verification immediately.",
            "Hello John, let's catch up tomorrow for lunch.",
            "Urgent: Update your bank billing info to avoid suspension.",
            "Weekly newsletter attached, please find the latest articles.",
            "Here is your OTP for the recent transaction. Do not share.",
            "Click here to claim your massive lottery prize of $1,000,000!",
            "Meeting notes from yesterday's product sync."
        ],
        'label': [1, 0, 1, 0, 1, 1, 0]
    })
    
    vectorizer = TfidfVectorizer(stop_words='english')
    X_text = vectorizer.fit_transform(text_data['text'])
    y_text = text_data['label']
    
    lr_model = LogisticRegression()
    lr_model.fit(X_text, y_text)
    
    joblib.dump(lr_model, os.path.join(MODELS_DIR, 'text_lr_model.pkl'))
    joblib.dump(vectorizer, os.path.join(MODELS_DIR, 'tfidf_vectorizer.pkl'))
    print(f"[+] Saved NLP Model & Vectorizer to {MODELS_DIR}")
    
    print("[!] Training Complete. The models are ready for production inference.")

if __name__ == "__main__":
    train_models()
