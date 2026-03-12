import requests
import json

API = "http://localhost:8001"

# Known threat URLs to seed the learning queue
bad_urls = [
    "http://spotifyapk.co/",
    "http://apkhome.net/download",
    "http://getmodpc.net/free",
    "http://cracked-apps.net/",
    "http://modyolo.com/download",
    "http://secure-login-banking-verify.com/",
    "http://paypal-secure-update.ru/",
    "http://microsoft-alert-verify99.com/",
    "http://g00gle-accounts.tk/",
    "http://free-premium-amazon.xyz/"
]

print(f"Seeding {len(bad_urls)} known threats into feedback queue...")
for url in bad_urls:
    resp = requests.post(f"{API}/api/admin/feedback",
                         json={"url": url, "label": 1, "source": "seed"})
    status = resp.json().get("status", "error")
    print(f"  [{status}] {url}")

print("\nTriggering retrain...")
resp = requests.post(f"{API}/api/admin/retrain")
result = resp.json()
print(f"\nRetrain Result:")
print(f"  Success: {result.get('success')}")
print(f"  Message: {result.get('message')}")
