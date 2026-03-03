import os
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from app.core.url_features import extractor

# ─────────────────────────────────────────────────────────────────
# Unified ML Training Pipeline v2.0
# Supports: Kaggle, PhishTank, OpenPhish, Alexa Top 1M
# ─────────────────────────────────────────────────────────────────

class PhishingModelTrainer:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.model_dir = os.path.join(self.base_dir, 'models')
        os.makedirs(self.model_dir, exist_ok=True)

    def prepare_data(self, phishing_urls, legitimate_urls):
        """
        Combine and extract features from raw URL lists.
        phishing_urls: list of strings
        legitimate_urls: list of strings
        """
        print(f"Extracting features from {len(phishing_urls)} phishing and {len(legitimate_urls)} legitimate URLs...")
        
        data = []
        labels = []

        # Process Phishing
        for i, url in enumerate(phishing_urls):
            if i % 1000 == 0: print(f"Processing Phishing: {i}/{len(phishing_urls)}")
            features = extractor.extract_features(url, skip_whois=True) # Skip WHOIS during bulk training
            # Remove non-numeric features
            if 'domain_creation_date' in features: del features['domain_creation_date']
            data.append(features)
            labels.append(1)

        # Process Legitimate
        for i, url in enumerate(legitimate_urls):
            if i % 1000 == 0: print(f"Processing Legitimate: {i}/{len(legitimate_urls)}")
            features = extractor.extract_features(url, skip_whois=True)
            if 'domain_creation_date' in features: del features['domain_creation_date']
            data.append(features)
            labels.append(0)

        df = pd.DataFrame(data)
        return df, np.array(labels)

    def train(self, X, y):
        """Train Random Forest with class weighting."""
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        print("Training Random Forest Classifier (balanced class weights)...")
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=20,
            class_weight='balanced',
            random_state=42,
            n_jobs=-1
        )
        
        model.fit(X_train, y_train)
        
        # Evaluation
        y_pred = model.predict(X_test)
        print("\nEvaluation Metrics:")
        print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))

        # Save model
        model_path = os.path.join(self.model_dir, 'phishing_model.pkl')
        joblib.dump(model, model_path)
        print(f"Model saved to: {model_path}")
        
        return model

    def load_datasets(self):
        """
        Mock loader (in production, this would read CSVs).
        Returns (phishing_list, legitimate_list)
        """
        # Example URLs for demonstration if no data provided
        phishing = [
            "http://login-secure-bank.verification-update.com/signin",
            "https://paypal-security-alert.net/cgi-bin/webscr",
            "http://192.168.1.1/admin/login.php",
            "https://amaz0n-gift-card.xyz/redeem",
            "http://bit.ly/suspicious-shortlink"
        ] * 100
        
        legitimate = [
            "https://www.google.com",
            "https://github.com/abhaysharma000/Feluda",
            "https://stackoverflow.com/questions/12345",
            "https://en.wikipedia.org/wiki/Phishing",
            "https://www.microsoft.com/en-us/"
        ] * 100
        
        return phishing, legitimate

if __name__ == "__main__":
    trainer = PhishingModelTrainer()
    phish, legit = trainer.load_datasets()
    X, y = trainer.prepare_data(phish, legit)
    trainer.train(X, y)
