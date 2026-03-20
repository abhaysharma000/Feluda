import requests

url = "https://feluda-zeta.vercel.app/dashboard/assets/index-B9btGn9f.js"
try:
    r = requests.head(url)
    print(f"URL: {url}")
    print(f"Status Code: {r.status_code}")
    for k, v in r.headers.items():
        print(f"{k}: {v}")
except Exception as e:
    print(f"Error: {e}")
