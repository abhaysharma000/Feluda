import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import classification_report
import joblib
import os
import tldextract
from app.core.url_features import extractor

def load_real_world_data():
    all_data = []
    base_dir = os.path.dirname(os.path.abspath(__file__))
    raw_dir = os.path.join(base_dir, 'data', 'raw')
    
    # 1. Load Benign URLs from benign_urls.csv
    benign_path = os.path.join(raw_dir, 'benign_urls.csv')
    if os.path.exists(benign_path):
        print(f"Loading benign URLs from {benign_path}...")
        benign_df = pd.read_csv(benign_path)
        for _, row in benign_df.iterrows():
            # Reconstruct URL: Protocol + Domain + Path
            protocol = row['Protocol'] if str(row['Protocol']) != 'nan' else 'http'
            domain = row['Domain']
            path = row['Path'] if str(row['Path']) != 'nan' else '/'
            url = f"{protocol}://{domain}{path}"
            try:
                features = extractor.extract_features(url, skip_whois=True)
                features['label'] = 0
                all_data.append(features)
            except Exception as e:
                # print(f"Error extracting benign: {e}")
                continue
        print(f"Total benign URLs constructed: {len(all_data)}")
    
    # 2. Load Phishing URLs from OpenPhish feed
    openphish_path = os.path.join(raw_dir, 'openphish_feed.txt')
    if os.path.exists(openphish_path):
        print(f"Loading OpenPhish URLs from {openphish_path}...")
        with open(openphish_path, 'r', encoding='utf-8') as f:
            for line in f:
                url = line.strip()
                if not url: continue
                try:
                    features = extractor.extract_features(url, skip_whois=True)
                    features['label'] = 1
                    all_data.append(features)
                except Exception as e:
                    # print(f"Error extracting phishing: {e}")
                    continue
        print(f"Total urls after OpenPhish: {len(all_data)}")

    # 3. Load Phishing URLs from PhishTank (if present)
    phishtank_path = os.path.join(raw_dir, 'phishtank_verified.csv')
    if os.path.exists(phishtank_path) and os.path.getsize(phishtank_path) > 1000:
        print(f"Loading PhishTank URLs from {phishtank_path}...")
        try:
            pt_df = pd.read_csv(phishtank_path)
            # PhishTank CSV usually has 'url' column
            if 'url' in pt_df.columns:
                for url in pt_df['url'].head(5000): # Limit to 5k for balance
                    try:
                        features = extractor.extract_features(url, skip_whois=True)
                        features['label'] = 1
                        all_data.append(features)
                    except:
                        continue
        except Exception as e:
            print(f"Error loading PhishTank: {e}")

    # 4. Ingest Kaggle Features for scale (Mapping required)
    kaggle_path = os.path.join(raw_dir, 'kaggle_phishing.csv')
    if os.path.exists(kaggle_path):
        print(f"Ingesting Kaggle features from {kaggle_path}...")
        kaggle_df = pd.read_csv(kaggle_path)
        
        # Map Kaggle columns to our feature names
        mapped_kaggle = pd.DataFrame()
        mapped_kaggle['url_length'] = kaggle_df['length_url']
        mapped_kaggle['dot_count'] = kaggle_df['qty_dot_url']
        mapped_kaggle['subdomain_count'] = (kaggle_df['qty_dot_domain'] - 1).clip(lower=0)
        mapped_kaggle['is_ip_address'] = kaggle_df['domain_in_ip']
        mapped_kaggle['domain_length'] = kaggle_df['domain_length']
        mapped_kaggle['count_-'] = kaggle_df['qty_hyphen_url']
        mapped_kaggle['count_@'] = kaggle_df['qty_at_url']
        mapped_kaggle['count_?'] = kaggle_df['qty_questionmark_url']
        mapped_kaggle['count_='] = kaggle_df['qty_equal_url']
        mapped_kaggle['count__'] = kaggle_df['qty_underline_url']
        mapped_kaggle['count_%'] = kaggle_df['qty_percent_url']
        mapped_kaggle['num_params'] = kaggle_df['qty_params']
        # Path length estimation
        mapped_kaggle['path_length'] = kaggle_df['directory_length'].apply(lambda x: x if x != -1 else 0)
        
        # Fill missing features with defaults
        mapped_kaggle['domain_age_days'] = kaggle_df['time_domain_activation'].apply(lambda x: x if x > 0 else 365)
        mapped_kaggle['has_https'] = 0 # Default to 0 for safety in Kaggle subset
        mapped_kaggle['entropy'] = 3.5 # Neutral entropy
        mapped_kaggle['has_homoglyph'] = 0
        mapped_kaggle['count_.'] = kaggle_df['qty_dot_url']
        mapped_kaggle['special_char_count'] = mapped_kaggle['count_@'] + mapped_kaggle['count_?'] + mapped_kaggle['count_-']
        mapped_kaggle['num_digits'] = 0 # Cannot infer accurately
        mapped_kaggle['suspicious_keywords'] = 0 # Cannot infer accurately
        
        mapped_kaggle['label'] = kaggle_df['phishing']
        
        # Take a sample to keep dataset balanced if needed, or just append
        kaggle_sample = mapped_kaggle.sample(min(10000, len(mapped_kaggle)))
        all_data.extend(kaggle_sample.to_dict('records'))
        print(f"Total samples after Kaggle sampling: {len(all_data)}")

    return pd.DataFrame(all_data)

def train_model():
    print("Preparing unified dataset...")
    base_dir = os.path.dirname(os.path.abspath(__file__))
    df = load_real_world_data()
    
    if df.empty:
        print("ERROR: No data loaded. Check data/raw directory.")
        return

    print(f"Dataset summary: {len(df)} samples")
    print(f"Label distribution:\n{df['label'].value_counts()}")
    
    if len(df['label'].unique()) < 2:
        print("ERROR: Not enough classes to train. Need both Malicious (1) and Safe (0).")
        return
    
    # Drop non-numeric/metadata columns
    cols_to_drop = ['label', 'domain_creation_date', 'last_url']
    X = df.drop([c for c in cols_to_drop if c in df.columns], axis=1)
    y = df['label']
    
    # Ensure all columns are numeric
    X = X.apply(pd.to_numeric, errors='coerce').fillna(0)
    
    print("Training Calibrated Random Forest (n_estimators=200)...")
    base_rf = RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42, n_jobs=-1)
    
    model = CalibratedClassifierCV(base_rf, method='sigmoid', cv=5)
    model.fit(X, y)
    
    # Basic Evaluation
    y_pred = model.predict(X)
    print("\nTraining set evaluation:")
    print(classification_report(y, y_pred))
    
    export_dir = os.path.join(base_dir, 'app', 'models')
    os.makedirs(export_dir, exist_ok=True)
    model_path = os.path.join(export_dir, 'phishing_model.pkl')
    joblib.dump(model, model_path)
    print(f"Success: Model exported to {model_path}")

if __name__ == "__main__":
    train_model()
