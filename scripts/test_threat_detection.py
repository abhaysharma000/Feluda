import asyncio
import sys
import os

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.engine import intelligence_engine

async def test_url(url):
    print(f"Testing URL: {url}")
    result = await intelligence_engine.analyze_url(url)
    print(f"Classification: {result['classification']}")
    print(f"Risk Score: {result['risk_score']}")
    print(f"Explanation: {result['explanation']}")
    print("-" * 30)

async def main():
    urls = [
        "https://apkmentor.org/",
        "https://spotifyapk.co/",
        "https://google.com" # Baseline safe
    ]
    for url in urls:
        await test_url(url)

if __name__ == "__main__":
    asyncio.run(main())
