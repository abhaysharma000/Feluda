import requests
import json

url = "http://localhost:8001/api/admin/blacklist"
payload = {
    "domain": "spotifyapk.co",
    "reason": "Unverified Third-Party APK Distribution (PUP Risk)"
}
headers = {"Content-Type": "application/json"}

try:
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
