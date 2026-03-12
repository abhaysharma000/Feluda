import urllib.request
import ssl
import os
import json
import gzip
import shutil
import pandas as pd

RAW_DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'raw'))

def procure_data():
    """Download latest security datasets for model training."""
    print("[*] Starting Data Procurement...")
    os.makedirs(RAW_DATA_DIR, exist_ok=True)
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    # 1. Tranco Top 100k (High-Quality Benign)
    # Using a community mirror for Tranco list
    tranco_url = "https://tranco-list.eu/download/K9999/100000"
    tranco_path = os.path.join(RAW_DATA_DIR, 'tranco_top_100k.csv')
    
    print(" [+] Fetching Tranco Top 100k Benign Domains...")
    try:
        urllib.request.urlretrieve(tranco_url, tranco_path)
        print(f" [!] Acquired: {tranco_path}")
    except Exception as e:
        print(f" [x] Error fetching Tranco: {e}")

    # 2. PhishTank (Verified Phishing)
    # Using their public JSON feed
    phishtank_url = "http://data.phishtank.com/data/online-valid.json"
    phishtank_path = os.path.join(RAW_DATA_DIR, 'phishtank.json')
    
    print(" [+] Fetching PhishTank Verified Feed...")
    try:
        # Note: PhishTank sometimes requires a User-Agent
        req = urllib.request.Request(phishtank_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx) as response, open(phishtank_path, 'wb') as out_file:
            out_file.write(response.read())
        print(f" [!] Acquired: {phishtank_path}")
    except Exception as e:
        print(f" [x] Error fetching PhishTank: {e}")

    # 3. Process Tranco to match our Benign format
    if os.path.exists(tranco_path):
        print(" [+] Converting Tranco to benign_urls.csv format...")
        df = pd.read_csv(tranco_path, names=['rank', 'domain'])
        # Add protocol for extractor
        df['url'] = "https://" + df['domain']
        df[['url']].to_csv(os.path.join(RAW_DATA_DIR, 'benign_urls.csv'), index=False)
        print(" [!] Updated benign_urls.csv with Tranco data.")

if __name__ == "__main__":
    procure_data()
