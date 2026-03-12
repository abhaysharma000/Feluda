import urllib.request
import ssl
import pandas as pd
import numpy as np
import joblib
import os
import sys
from tqdm import tqdm
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import train_test_split

# Add the project root to sys.path to allow importing app modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.core.url_features import extractor

RAW_DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'raw'))
MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app', 'models', 'phishing_model.pkl'))

def download_data():
    """Automated download of professional phishing and benign datasets."""
    print("[*] Initiating Automated Data Acquisition...")
    os.makedirs(RAW_DATA_DIR, exist_ok=True)
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    downloads = [
        {
            "url": "https://raw.githubusercontent.com/GregaVrbancic/Phishing-Dataset/master/dataset_full.csv",
            "path": os.path.join(RAW_DATA_DIR, 'kaggle_phishing.csv'),
            "label": "Kaggle/GitHub Phishing Mirror"
        },
        {
            "url": "https://raw.githubusercontent.com/jishnusaurav/Phishing-attack-PCAP-analysis-using-scapy/master/Phishing-Website-Detection/datasets/legitimate-urls.csv",
            "path": os.path.join(RAW_DATA_DIR, 'benign_urls.csv'),
            "label": "Legitimate/Benign URL Mirror"
        },
        {
            "url": "https://openphish.com/feed.txt",
            "path": os.path.join(RAW_DATA_DIR, 'openphish_feed.txt'),
            "label": "OpenPhish Live Feed"
        }
    ]

    for item in downloads:
        # Force download if file is a placeholder (small) or missing
        if not os.path.exists(item['path']) or os.path.getsize(item['path']) < 500:
            print(f" [+] Downloading {item['label']}...")
            try:
                with urllib.request.urlopen(item['url'], context=ctx) as response, open(item['path'], 'wb') as out_file:
                    out_file.write(response.read())
                print(f" [!] Successfully acquired: {os.path.basename(item['path'])}")
            except Exception as e:
                print(f" [x] Error downloading {item['label']}: {e}")

def load_datasets():
    download_data()
    print("[*] Ingesting and Preparing Balanced Dataset...")
    urls = []
    labels = []

    # 1. Benign (Safe) URLs - Label 0
    benign_path = os.path.join(RAW_DATA_DIR, 'benign_urls.csv')
    if os.path.exists(benign_path):
        df = pd.read_csv(benign_path)
        common_col = 'url' if 'url' in df.columns else df.columns[0]
        b_list = df[common_col].head(20000).tolist() # Increased to 20k
        urls.extend(b_list)
        labels.extend([0] * len(b_list))
        print(f" [+] Ingested Benign: {len(b_list)} samples")

    # 2. Phishing URLs - Label 1
    # Check Kaggle Mirror
    phish_path = os.path.join(RAW_DATA_DIR, 'kaggle_phishing.csv')
    if os.path.exists(phish_path):
        df = pd.read_csv(phish_path)
        if 'url' in df.columns:
            p_df = df[df.get('phishing', df.get('label', 1)) == 1].head(15000) # Increased to 15k
            p_list = p_df['url'].tolist()
            urls.extend(p_list)
            labels.extend([1] * len(p_list))
            print(f" [+] Ingested Phishing (Kaggle): {len(p_list)} samples")

    # Check OpenPhish
    op_path = os.path.join(RAW_DATA_DIR, 'openphish_feed.txt')
    if os.path.exists(op_path) and os.path.getsize(op_path) > 500:
        with open(op_path, 'r') as f:
            lines = [l.strip() for l in f.readlines() if l.strip()][:5000] # Increased to 5k
            urls.extend(lines)
            labels.extend([1] * len(lines))
            print(f" [+] Ingested OpenPhish: {len(lines)} samples")

    if len(set(labels)) < 2:
        print(f" [!] Label Imbalance: Only found {set(labels)}. Need both 0 and 1.")
        # Fallback synthetic benign data if download failed
        if 1 in labels and 0 not in labels:
            print(" [!] Fallback: Generating synthetic benign samples...")
            synthetic_benign = ["https://google.com", "https://github.com", "https://microsoft.com", "https://apple.com", "https://amazon.com"] * 100
            urls.extend(synthetic_benign)
            labels.extend([0] * len(synthetic_benign))

    return urls, labels

def train_advanced():
    urls, labels = load_datasets()
    if not urls: return

    print(f"[*] Extracting Features from {len(urls)} samples...")
    features = []
    final_labels = []
    
    for i in tqdm(range(len(urls))):
        try:
            f = extractor.extract_features(urls[i], skip_whois=True)
            if 'domain_creation_date' in f: del f['domain_creation_date']
            features.append(f)
            final_labels.append(labels[i])
        except Exception: continue

    X = pd.DataFrame(features)
    y = np.array(final_labels)

    print(f"[*] Training Optimized Calibrated Random Forest (N={len(X)})...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Increase model capacity for higher accuracy
    base_rf = RandomForestClassifier(
        n_estimators=300, 
        max_depth=20, 
        min_samples_split=5, 
        n_jobs=-1, 
        random_state=42
    )
    model = CalibratedClassifierCV(base_rf, method='sigmoid', cv=5)
    model.fit(X_train, y_train)

    print(f"[+] Accuracy: {model.score(X_test, y_test):.4f}")
    joblib.dump(model, MODEL_PATH)
    print(f"[!] PROD MODEL DEPLOYED: {MODEL_PATH}")

if __name__ == "__main__":
    train_advanced()
