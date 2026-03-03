import aiohttp
import base64
import os
from dotenv import load_dotenv

load_dotenv()

class ThreatIntel:
    def __init__(self):
        self.vt_api_key = os.getenv("VIRUSTOTAL_API_KEY")
        self.gsb_api_key = os.getenv("GOOGLE_SAFE_BROWSING_API_KEY")

    # ─────────────────────────────────────────────────────────────
    # VirusTotal — correct 2-step flow: POST to submit → GET result
    # ─────────────────────────────────────────────────────────────
    async def check_virustotal(self, url: str):
        if not self.vt_api_key:
            return {"status": "skipped", "message": "No VirusTotal API Key configured."}

        headers = {"x-apikey": self.vt_api_key}
        url_id = self._get_url_id(url)

        async with aiohttp.ClientSession() as session:
            try:
                # Step 1: Submit URL for analysis
                async with session.post(
                    "https://www.virustotal.com/api/v3/urls",
                    headers=headers,
                    data={"url": url},
                    timeout=aiohttp.ClientTimeout(total=1)
                ) as submit_resp:
                    if submit_resp.status not in (200, 201):
                        return {"status": "error", "message": f"VT submission failed ({submit_resp.status})"}

                # Step 2: Retrieve analysis using the URL ID
                async with session.get(
                    f"https://www.virustotal.com/api/v3/urls/{url_id}",
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=1)
                ) as result_resp:
                    if result_resp.status == 200:
                        data = await result_resp.json()
                        stats = data.get("data", {}).get("attributes", {}).get("last_analysis_stats", {})
                        malicious = stats.get("malicious", 0)
                        suspicious = stats.get("suspicious", 0)
                        return {
                            "status": "complete",
                            "malicious_engines": malicious,
                            "suspicious_engines": suspicious,
                            "total_engines": sum(stats.values()),
                            "flagged": malicious > 0 or suspicious > 0
                        }
                    else:
                        return {"status": "pending", "message": "Analysis in progress, try again later."}

            except aiohttp.ClientConnectorError:
                return {"status": "error", "message": "Could not connect to VirusTotal API."}
            except Exception as e:
                return {"status": "error", "message": str(e)}

    # ─────────────────────────────────────────────────────────────
    # Google Safe Browsing — unchanged, already correct
    # ─────────────────────────────────────────────────────────────
    async def check_google_safe_browsing(self, url: str):
        if not self.gsb_api_key:
            return {"status": "skipped", "message": "No Google Safe Browsing API Key configured."}

        endpoint = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={self.gsb_api_key}"
        payload = {
            "client": {"clientId": "feluda-ai", "clientVersion": "2.0.0"},
            "threatInfo": {
                "threatTypes": [
                    "MALWARE",
                    "SOCIAL_ENGINEERING",
                    "UNWANTED_SOFTWARE",
                    "POTENTIALLY_HARMFUL_APPLICATION"
                ],
                "platformTypes": ["ANY_PLATFORM"],
                "threatEntryTypes": ["URL"],
                "threatEntries": [{"url": url}]
            }
        }

        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(
                    endpoint,
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=1.5)
                ) as resp:
                    if resp.status == 200:
                        return await resp.json()
                    else:
                        return {"status": "error", "message": f"GSB returned status {resp.status}"}
            except aiohttp.ClientConnectorError:
                return {"status": "error", "message": "Could not connect to Google Safe Browsing API."}
            except Exception as e:
                return {"status": "error", "message": str(e)}

    def _get_url_id(self, url: str) -> str:
        """Encode URL to VirusTotal's base64url identifier (no padding)."""
        return base64.urlsafe_b64encode(url.encode()).decode().strip("=")


threat_intel = ThreatIntel()
