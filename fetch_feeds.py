import requests
import os
import csv

def fetch_openphish():
    print("Fetching OpenPhish feed...")
    url = "https://openphish.com/feed.txt"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            with open("data/raw/openphish_feed.txt", "w", encoding="utf-8") as f:
                f.write(response.text)
            print(f"Successfully updated OpenPhish feed ({len(response.text.splitlines())} URLs)")
        else:
            print(f"Failed to fetch OpenPhish: HTTP {response.status_code}")
    except Exception as e:
        print(f"Error fetching OpenPhish: {e}")

def fetch_phishtank():
    print("Fetching PhishTank verified feed...")
    # NOTE: PhishTank often requires a User-Agent or API key for the CSV, 
    # but the plain text/compressed version is sometimes accessible.
    url = "http://data.phishtank.com/data/online-valid.csv"
    headers = {'User-Agent': 'phishtank/feluda-ai'}
    try:
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code == 200:
            with open("data/raw/phishtank_verified.csv", "w", encoding="utf-8") as f:
                f.write(response.text)
            print("Successfully updated PhishTank verified feed")
        else:
            print(f"Failed to fetch PhishTank: HTTP {response.status_code} (Check if rate-limited)")
    except Exception as e:
        print(f"Error fetching PhishTank: {e}")

if __name__ == "__main__":
    os.makedirs("data/raw", exist_ok=True)
    fetch_openphish()
    fetch_phishtank()
