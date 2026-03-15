import aiohttp
import os
import hashlib
from app.core.threat_intel import threat_intel

class FileScanner:
    def __init__(self):
        self.vt_api_key = threat_intel.vt_api_key
        self.headers = {"x-apikey": self.vt_api_key}

    def get_file_hash(self, file_content: bytes) -> str:
        """Calculate SHA-256 hash of file content."""
        return hashlib.sha256(file_content).hexdigest()

    async def lookup_hash(self, file_hash: str, filename: str):
        """Lookup a file by its hash on VirusTotal."""
        if not self.vt_api_key:
            return {"status": "skipped", "message": "No VirusTotal API Key configured."}

        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(
                    f"https://www.virustotal.com/api/v3/files/{file_hash}",
                    headers=self.headers
                ) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        stats = data.get("data", {}).get("attributes", {}).get("last_analysis_stats", {})
                        malicious = stats.get("malicious", 0)
                        suspicious = stats.get("suspicious", 0)
                        
                        return {
                            "status": "complete",
                            "filename": filename,
                            "file_hash": file_hash,
                            "malicious_engines": malicious,
                            "suspicious_engines": suspicious,
                            "total_engines": sum(stats.values()),
                            "classification": "Malicious" if malicious > 0 else ("Suspicious" if suspicious > 0 else "Safe"),
                            "risk_score": 100 if malicious > 0 else (50 if suspicious > 0 else 0),
                            "explanation": [f"VirusTotal detected this hash as malicious across {malicious} engines."] if malicious > 0 else ["No immediate threat detected by VirusTotal hash lookup."]
                        }
                    else:
                        return {"status": "not_found", "message": "Hash not found in VT database.", "file_hash": file_hash}
            except Exception as e:
                return {"status": "error", "message": str(e)}

    async def scan_file(self, file_content: bytes, filename: str):
        """
        Scan a file using VirusTotal.
        First tries hash-based lookup, then uploads if not found.
        """
        if not self.vt_api_key:
            return {"status": "skipped", "message": "No VirusTotal API Key configured."}

        file_hash = self.get_file_hash(file_content)
        
        # 1. Try checking by hash first
        hash_res = await self.lookup_hash(file_hash, filename)
        if hash_res["status"] == "complete":
            return hash_res
        
        # 2. If not found, upload the file (Real-time scan)
        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(
                    "https://www.virustotal.com/api/v3/files",
                    headers=self.headers,
                    data={"file": file_content}
                ) as upload_resp:
                    if upload_resp.status in (200, 201):
                        upload_data = await upload_resp.json()
                        analysis_id = upload_data.get("data", {}).get("id")
                        return {
                            "status": "pending",
                            "message": "File uploaded for analysis. Check back in a few minutes.",
                            "analysis_id": analysis_id,
                            "filename": filename,
                            "file_hash": file_hash,
                            "classification": "Suspicious", # Default until scan finishes
                            "risk_score": 30,
                            "explanation": ["File uploaded for live analysis. Check back shortly."]
                        }
                    else:
                        return {"status": "error", "message": f"VT upload failed ({upload_resp.status})"}
            except Exception as e:
                return {"status": "error", "message": str(e)}

file_scanner = FileScanner()
