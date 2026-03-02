import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os
from app.core.url_features import extractor

def generate_synthetic_data(n_samples=500):
    data = []
    # Safe URLs patterns
    for _ in range(n_samples // 2):
        url = f"https://google.com/search?q={np.random.randint(100, 1000)}"
        features = extractor.extract_features(url, skip_whois=True)
        features['label'] = 0 # Safe
        data.append(features)
        
    # Malicious URLs patterns
    for _ in range(n_samples // 2):
        url = f"http://secure-login-update{np.random.randint(10, 99)}.com/verify?id={np.random.randint(10000, 99999)}"
        features = extractor.extract_features(url, skip_whois=True)
        features['label'] = 1 # Malicious
        data.append(features)
        
    return pd.DataFrame(data)

from sklearn.calibration import CalibratedClassifierCV

def train_model():
    print("Generating training data for calibrated model...")
    df = generate_synthetic_data(1500) # Increased sample size for better calibration
    
    # Drop non-numeric features that are for UI display only
    if 'domain_creation_date' in df.columns:
        df = df.drop('domain_creation_date', axis=1)
        
    X = df.drop('label', axis=1)
    y = df['label']
    
    print("Training Base Random Forest model...")
    base_rf = RandomForestClassifier(n_estimators=100, random_state=42)
    
    print("Applying Platt Scaling (Confidence Calibration)...")
    # CalibratedClassifierCV uses cross-validation to calibrate probabilities
    # 'sigmoid' corresponds to Platt Scaling
    model = CalibratedClassifierCV(base_rf, method='sigmoid', cv=5)
    model.fit(X, y)
    
    os.makedirs('app/models', exist_ok=True)
    joblib.dump(model, 'app/models/phishing_model.pkl')
    print("Calibrated Model saved to app/models/phishing_model.pkl")

if __name__ == "__main__":
    train_model()
