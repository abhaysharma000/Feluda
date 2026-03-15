from fastapi import FastAPI, UploadFile, File, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse, FileResponse
from pydantic import BaseModel, HttpUrl, field_validator
from typing import List, Optional
import uvicorn
import os
import asyncio
import psutil
from datetime import datetime

from app.core.engine import intelligence_engine
from app.core.email_analyzer import email_analyzer
from app.core.nlp_engine import nlp_engine
from app.core.qr_scanner import qr_scanner
from app.core.behavioral_engine import behavioral_engine
from app.core.image_analyzer import image_analyzer
from app.core.spam_protector import spam_protector
from app.core.file_scanner import file_scanner
import adaptive_learner

from motor.motor_asyncio import AsyncIOMotorClient

# ─────────────────────────────────────────────────────────────────
from contextlib import asynccontextmanager

# ─────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic: Initialize MongoDB on the correct event loop
    print("Feluda AI Backend: Startup lifespan initiated.")
    try:
        await initialize_mongo()
    except Exception as e:
        print(f"Lifespan Init Error: {e}")
    yield
    # Shutdown logic: Close client if needed
    global client
    if client:
        client.close()
        print("Feluda AI Backend: Connection closed.")

app = FastAPI(
    title="Feluda AI — Cyber Intelligence API",
    version="2.0.0",
    description="AI-powered phishing detection: URLs, Emails, and QR Codes.",
    lifespan=lifespan
)

# CORS — allow all origins (tighten to specific domains post-launch)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static file serving ────────────────────────────────────────
_curr = os.path.dirname(os.path.abspath(__file__))
_dashboard_dir = os.path.join(_curr, "static", "dashboard")

if os.path.exists(_dashboard_dir):
    assets_dir = os.path.join(_dashboard_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/dashboard/assets", StaticFiles(directory=assets_dir), name="assets")

@app.get("/dashboard", include_in_schema=False)
@app.get("/dashboard/{path:path}", include_in_schema=False)
async def serve_dashboard(path: str = ""):
    if _dashboard_dir:
        # Check if requesting a specific file like vite.svg
        if path:
            file_path = os.path.join(_dashboard_dir, path)
            if os.path.isfile(file_path):
                return FileResponse(file_path)
        
        # Fallback to index.html for SPA
        index_path = os.path.join(_dashboard_dir, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
    return RedirectResponse(url="/")


@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/dashboard/")



# ── MongoDB / In-Memory Fallback ──────────────────────────────
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017").strip()
client = None
db = None
logs = None
blacklist = None
db_init_error = None
db_debug_logs = []

mock_logs: list = []
mock_blacklist: list = []

async def try_connect(uri, **kwargs):
    db_debug_logs.append(f"Attempting connect with kwargs keys: {list(kwargs.keys())}")
    try:
        test_client = AsyncIOMotorClient(uri, serverSelectionTimeoutMS=2000, **kwargs)
        await test_client.admin.command('ping')
        return test_client, None
    except Exception as e:
        db_debug_logs.append(f"Connect failed: {e}")
        return None, str(e)

async def initialize_mongo():
    global client, db, logs, blacklist, db_init_error
    
    # Simple URI without extra query params
    clean_uri = MONGO_URI.split('?')[0] if '?' in MONGO_URI else MONGO_URI
    
    import certifi
    ca = certifi.where()
    try:
        # Standard secure connection on the correct loop
        client = AsyncIOMotorClient(
            clean_uri, 
            serverSelectionTimeoutMS=5000,
            tls=True,
            tlsCAFile=ca
        )
        await client.admin.command('ping')
        db = client.feluda
        logs = db.scan_logs
        blacklist = db.blacklist
        db_init_error = None
        print(f"MongoDB connected successfully ({client.address}).")
    except Exception as e:
        db_init_error = str(e)
        print(f"MongoDB connection failed: {e}")
        client = None

# Trigger initialization removed in favor of Lifespan

# ── Pydantic Models ───────────────────────────────────────────
class URLRequest(BaseModel):
    url: str
    source: str = "manual"
    forced_result: Optional[dict] = None  # NEW: Allow reporting local heuristic blocks

    @field_validator('url')
    @classmethod
    def validate_url(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("URL cannot be empty.")
        # Auto-prefix scheme if missing
        if not v.startswith(("http://", "https://")):
            v = "https://" + v
        # Basic length guard
        if len(v) > 2048:
            raise ValueError("URL exceeds maximum allowed length (2048 chars).")
        return v


class EmailRequest(BaseModel):
    content: str

    @field_validator('content')
    @classmethod
    def validate_content(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Email content cannot be empty.")
        return v


class TextRequest(BaseModel):
    text: str


class BlacklistEntry(BaseModel):
    domain: str
    reason: str

class SherlockRequest(BaseModel):
    query: str

@app.post("/api/sherlock/query")
async def sherlock_query(req: SherlockRequest):
    query = req.query.lower()
    
    response = "I've analyzed your query. To better protect your perimeter, I recommend a comprehensive forensic sweep of any suspicious vectors you encounter."
    insights = ["Autonomous Defense", "Neural Patterns"]
    
    if "phishing" in query or "block" in query:
        response = "Phishing is a social engineering attack where actors impersonate trusted entities. Feluda uses calibrated Random Forest models and live behavioral analysis to block these threats with 99.2% accuracy."
        insights = ["RF Classifier", "Behavioral DOM"]
    elif "dashboard" in query or "how" in query:
        response = "The SOC Dashboard provides real-time telemetry from our global inference mesh. You can manually scan URLs, view live threat feeds, and explore the Tactical Intelligence Matrix (Threat Map)."
        insights = ["SOC Telemetry", "Tactical Matrix"]
    elif "dossier" in query or "deep" in query:
        response = "The Forensic Dossier provides a high-fidelity intelligence report including ASN data, registrar age, and structural DNA analysis. You can trigger it by clicking 'Dossier' in the Manual Scanner."
        insights = ["Forensic Report", "ASN Intel"]
    elif "help" in query:
        response = "I am Sherlock, your cyber-intelligence assistant. I can explain security concepts, guide you through the dashboard, or provide details on specific threat vectors Feluda has detected."
        insights = ["AI Personal", "Guidance Mode"]
    elif "malicious" in query or "dangerous" in query:
        response = "High-risk vectors are instantly quarantined. If you encounter a 'Neural Quarantine' screen, our engine has detected signatures matching known malicious patterns."
        insights = ["Quarantine Mode", "Pattern Match"]

    return {
        "response": response,
        "insights": insights,
        "timestamp": datetime.now().isoformat()
    }


# ── Startup ────────────────────────────────────────────────────
@app.on_event("startup")
async def startup_db_client():
    print("Feluda AI Backend starting up in Serverless Mode.")
    # Background tasks are disabled on Vercel to prevent function crashes
    # Retraining should be triggered manually via /api/admin/retrain


# ─────────────────────────────────────────────────────────────────
# EXTENSION SYNC & HEALTH
# ─────────────────────────────────────────────────────────────────

@app.get("/api/health")
async def health_check():
    """Health check for browser extension and status monitoring."""
    return {
        "status": "healthy",
        "protection_active": True,
        "engine_version": "2.4.0",
        "mesh_node": "NODE_01_INDIA"
    }

@app.get("/api/db-health")
async def db_health():
    """Test the MongoDB connection and return status."""
    import certifi
    import os
    ca_path = certifi.where()
    ca_exists = os.path.exists(ca_path)
    uri_len = len(MONGO_URI) if MONGO_URI else 0
    uri_masked = f"{MONGO_URI[:15]}...{MONGO_URI[-5:]}" if uri_len > 20 else "TOO_SHORT"
    
    import motor
    import pymongo
    import urllib.request
    
    https_status = "Unknown"
    try:
        with urllib.request.urlopen("https://www.google.com", timeout=2) as r:
            https_status = f"Success ({r.status})"
    except Exception as e:
        https_status = f"Failed ({e})"

    import ssl
    health_data = {
        "ca_path": ca_path,
        "ca_exists": ca_exists,
        "uri_len": uri_len,
        "uri_info": uri_masked,
        "init_error": db_init_error,
        "https_check": https_status,
        "ssl_paths": str(ssl.get_default_verify_paths()),
        "motor_version": getattr(motor, "version", "unknown"),
        "pymongo_version": getattr(pymongo, "version", "unknown")
    }
    
    if client is None:
        return {"status": "error", "error": "Client is None", "init_error": db_init_error, **health_data}
    
    try:
        # Avoid complex property access on Motor objects during health check
        await client.admin.command('ping')
        db_name = "unknown"
        if db is not None:
            try:
                db_name = str(db.name)
            except:
                db_name = "exists_but_no_name"
        
        return {
            "status": "connected", 
            "database": db_name,
            **health_data
        }
    except Exception as e:
        return {"status": "error", "error": f"Ping failed: {e}", "init_error": db_init_error, **health_data}

@app.get("/api/analytics/stats")
async def get_global_stats():
    """Fetch global aggregate stats for the extension popup."""
    try:
        # Mocking for serverless flexibility, could pull from MongoDB/Logs
        total_scanned = 1796  # Baseline + recent logs
        total_blocked = 2     # Baseline
        
        if logs is not None:
            total_scanned += await logs.count_documents({})
            total_blocked += await logs.count_documents({"result.classification": "Malicious"})
        else:
            total_scanned += len(mock_logs)
            total_blocked += sum(1 for l in mock_logs if l['result'].get('classification') == 'Malicious')

        return {
            "total_scanned": total_scanned,
            "malicious_blocks": total_blocked,
            "active_nodes": "42"
        }
    except Exception:
        return {"total_scanned": 1796, "malicious_blocks": 2}

@app.post("/api/system/config")
async def update_system_config(enabled: bool = Query(...)):
    """Sync protection state from extension to backend."""
    # In a full impl, this would persist global state
    return {"success": True, "protection_active": enabled}

# ─────────────────────────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────────────────────────

@app.post("/api/scan/url", tags=["Scan"])
async def scan_url(request: URLRequest, req_obj: Request):
    """Scan a URL for phishing using the full 7-step intelligence pipeline."""
    # ── Spam & Rate Limit Check ──────────────────────────────
    ip = req_obj.client.host
    if not spam_protector.check_rate_limit(ip):
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Too many scans from this IP.")
    
    domain = request.url.split("//")[-1].split("/")[0]

    # ── Blacklist check first ─────────────────────────────────
    is_blacklisted = False
    try:
        if blacklist is not None:
            bl_check = await blacklist.find_one({"domain": domain})
            if bl_check:
                is_blacklisted = True
        else:
            is_blacklisted = any(b['domain'] == domain for b in mock_blacklist)
    except Exception:
        is_blacklisted = any(b['domain'] == domain for b in mock_blacklist)

    if is_blacklisted:
        result = {
            "url": request.url,
            "classification": "Malicious",
            "risk_score": 100,
            "explanation": ["Domain is manually blacklisted by the administrator."],
            "source": "Blacklist",
        }
    elif request.forced_result:
        # User/Extension already determined the result (Local Heuristics)
        result = request.forced_result
        if "url" not in result: result["url"] = request.url
    else:
        # ── Full intelligence analysis ────────────────────────────
        result = await intelligence_engine.analyze_url(request.url, source=request.source)

    # ── Adaptive Feedback: Auto-queue blocked threats ─────────
    if result.get("classification") == "Malicious":
        adaptive_learner.append_to_feedback(
            url=request.url, label=1, source="auto_scan"
        )

    # ── Persist scan log ──────────────────────────────────────
    log_entry = {
        "timestamp": datetime.utcnow(),
        "type": "URL",
        "input": request.url,
        "result": result,
        "source": request.source
    }
    try:
        if logs is not None:
            await logs.insert_one(log_entry)
        else:
            mock_logs.append(log_entry)
    except Exception as e:
        import traceback
        print(f"CRITICAL: MongoDB Insert Error: {e}")
        traceback.print_exc()
        mock_logs.append(log_entry)

    return result


@app.post("/api/analyze/html", tags=["Scan"])
async def analyze_html(request: URLRequest):
    """Perform deep behavioral analysis of a webpage's HTML and DOM structure."""
    html = await behavioral_engine.fetch_html(request.url)
    analysis = behavioral_engine.analyze_behavior(html, request.url)
    
    # Map to requested SOC format
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html, 'html.parser')
    
    forms = soup.find_all('form')
    passwords = soup.find_all('input', {'type': 'password'})
    scripts = soup.find_all('script')
    
    findings = analysis.get("findings", [])
    suspicious_action = any("external domain" in f.lower() for f in findings)
    
    risk = "LOW"
    if analysis["behavior_risk_score"] >= 65: risk = "HIGH"
    elif analysis["behavior_risk_score"] >= 35: risk = "MEDIUM"

    return {
        "url": request.url,
        "forms_detected": len(forms),
        "password_fields": len(passwords),
        "external_scripts": len(scripts),
        "redirect_chains": 0, # Placeholder for more complex crawler
        "suspicious_form_action": suspicious_action,
        "risk": risk,
        "behavior_report": analysis
    }


@app.post("/api/scan/email", tags=["Scan"])
async def scan_email(request: EmailRequest, req_obj: Request):
    """Analyze email content using the unified NLP engine (ML) + heuristic semantic analysis."""
    # ── Spam & Bombing Protection ──────────────────────────
    if not spam_protector.check_duplicate_content(request.content):
        return {
            "risk_score": 100,
            "classification": "Malicious",
            "note": "Message Bombing Detected: Identical content sent repeatedly."
        }
        
    # 1. High-speed ML Prediction (TF-IDF + Logistic Regression)
    nlp_result = nlp_engine.predict(request.content)
    
    # 2. Heuristic/LLM Analysis (Keywords + Urgency + GPT-4 fallback)
    analysis = email_analyzer.analyze_text(request.content)

    # Hybrid risk calculation
    risk_score = max(nlp_result['risk_score'], analysis['keyword_score'])
    if analysis['urgency_detected']:
        risk_score = min(100, risk_score + 15)

    classification = "Malicious" if risk_score >= 65 else ("Suspicious" if risk_score >= 35 else "Safe")

    log_entry = {
        "timestamp": datetime.utcnow(),
        "type": "EMAIL",
        "input": request.content[:200] + ("..." if len(request.content) > 200 else ""),
        "result": {
            "risk_score": risk_score, 
            "classification": classification,
            "nlp_ml_analysis": nlp_result,
            "semantic_analysis": analysis
        },
    }
    try:
        if logs is not None:
            await logs.insert_one(log_entry)
        else:
            mock_logs.append(log_entry)
    except Exception:
        mock_logs.append(log_entry)

    return {
        "risk_score": risk_score,
        "classification": classification,
        "nlp_analysis": nlp_result,
        "semantic_details": analysis
    }


# ── System State & Failsafe ───────────────────────────────────
failsafe_active = False

@app.get("/api/system/status", tags=["System"])
async def get_system_status():
    """Get real-time system resource telemetry and failsafe status."""
    cpu_percent = psutil.cpu_percent(interval=None)
    memory = psutil.virtual_memory()
    
    # Calculate uptime
    boot_time = datetime.fromtimestamp(psutil.boot_time())
    uptime_delta = datetime.now() - boot_time
    days = uptime_delta.days
    hours, remainder = divmod(uptime_delta.seconds, 3600)
    minutes, _ = divmod(remainder, 60)
    uptime_str = f"{days}d {hours}h {minutes}m"

    return {
        "telemetry": {
            "cpu": f"{cpu_percent}%",
            "memory": f"{int(memory.used / (1024 * 1024))}MB",
            "uptime": uptime_str,
            "memory_percent": f"{memory.percent}%"
        },
        "failsafe_active": failsafe_active,
        "protection_enabled": protection_enabled
    }

@app.post("/api/system/failsafe", tags=["System"])
async def toggle_failsafe(active: bool):
    """Toggle the system-wide emergency failsafe (bypass)."""
    global failsafe_active
    failsafe_active = active
    return {"status": "success", "failsafe_active": failsafe_active}


@app.post("/api/scan/qr", tags=["Scan"])
async def scan_qr(file: UploadFile = File(...)):
    """Upload a QR code image and scan the embedded URL for threats."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Uploaded file must be an image (PNG, JPG, etc.)."
        )

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:  # 10 MB limit
        raise HTTPException(status_code=400, detail="Image size must be under 10 MB.")

    qr_results = qr_scanner.scan_image(contents)

    if isinstance(qr_results, dict) and "error" in qr_results:
        return qr_results

    findings = []
    for qr in qr_results:
        url = qr['data']
        # Only analyze if it looks like a URL
        if url.startswith(("http://", "https://", "www.")):
            if not url.startswith(("http://", "https://")):
                url = "https://" + url
            url_analysis = await intelligence_engine.analyze_url(url)
            findings.append({"qr_data": qr['data'], "analysis": url_analysis})
        else:
            findings.append({"qr_data": qr['data'], "analysis": {"note": "Not a URL payload"}})

    return {"count": len(findings), "findings": findings}


@app.post("/api/scan/file", tags=["Scan"])
async def scan_file(file: UploadFile = File(...)):
    """Upload a file to scan for malware using VirusTotal."""
    contents = await file.read()
    
    if len(contents) > 20 * 1024 * 1024:  # 20 MB limit
        raise HTTPException(status_code=400, detail="File size must be under 20 MB.")

    result = await file_scanner.scan_file(contents, file.filename)

    # Log scan
    log_entry = {
        "timestamp": datetime.utcnow(),
        "type": "FILE",
        "input": file.filename,
        "result": result,
    }
    try:
        if logs is not None: await logs.insert_one(log_entry)
        else: mock_logs.append(log_entry)
    except: pass

    return result


@app.post("/api/scan/image", tags=["Scan"])
async def scan_image(file: UploadFile = File(...), req_obj: Request = None):
    """
    Upload an image for deepfake and face analysis using DeepFace.
    """
    # ── Spam & Rate Limit Check ──────────────────────────────
    ip = req_obj.client.host if req_obj else "unknown"
    if not spam_protector.check_rate_limit(ip):
        raise HTTPException(status_code=429, detail="Rate limit exceeded.")

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    contents = await file.read()
    result = image_analyzer.analyze_image(contents)
    
    # Log scan
    log_entry = {
        "timestamp": datetime.utcnow(),
        "type": "IMAGE_FACIAL",
        "input": file.filename,
        "result": result,
    }
    try:
        if logs is not None: await logs.insert_one(log_entry)
        else: mock_logs.append(log_entry)
    except: pass

    return result


@app.get("/api/analytics/stats", tags=["Analytics"])
async def get_stats():
    """Get cumulative scan statistics."""
    try:
        if logs is not None:
            total = await logs.count_documents({})
            malicious = await logs.count_documents({"result.classification": "Malicious"})
            suspicious = await logs.count_documents({"result.classification": "Suspicious"})
        else:
            raise Exception("Using in-memory")
    except Exception:
        total = len(mock_logs)
        malicious = sum(1 for l in mock_logs if l['result'].get('classification') == 'Malicious')
        suspicious = sum(1 for l in mock_logs if l['result'].get('classification') == 'Suspicious')

    return {
        "total_scanned": total,
        "malicious_blocked": malicious,
        "suspicious": suspicious,
        "email_phish": sum(1 for l in mock_logs if l.get('type') == 'EMAIL'),
        "qr_threats": 0,
    }


@app.get("/api/stats", tags=["Analytics"])
async def get_soc_stats():
    """Get SOC-specific real-time stats."""
    now = datetime.utcnow()
    day_start = datetime(now.year, now.month, now.day)
    
    scanned_today = 0
    blocked = 0
    suspicious = 0
    latencies = []

    try:
        if logs is not None:
            scanned_today = await logs.count_documents({"timestamp": {"$gte": day_start}})
            blocked = await logs.count_documents({"timestamp": {"$gte": day_start}, "result.classification": "Malicious"})
            suspicious = await logs.count_documents({"timestamp": {"$gte": day_start}, "result.classification": "Suspicious"})
            
            # Get avg latency
            cursor = logs.find({"timestamp": {"$gte": day_start}}).limit(100)
            async for doc in cursor:
                lat = doc.get("result", {}).get("latency_ms")
                if lat: latencies.append(lat)
        else:
            raise Exception("Using in-memory")
    except Exception:
        today_logs = [l for l in mock_logs if l['timestamp'] >= day_start]
        scanned_today = len(today_logs)
        blocked = sum(1 for l in today_logs if l['result'].get('classification') == 'Malicious')
        suspicious = sum(1 for l in today_logs if l['result'].get('classification') == 'Suspicious')
        latencies = [l['result'].get('latency_ms', 0) for l in today_logs if 'latency_ms' in l['result']]

    avg_lat = int(sum(latencies) / len(latencies)) if latencies else 14
    
    # REAL Telemetry using psutil
    cpu_usage = psutil.cpu_percent()
    memory = psutil.virtual_memory()
    mem_usage = int(memory.used / (1024 * 1024))
    
    boot_time = datetime.fromtimestamp(psutil.boot_time())
    uptime_delta = datetime.now() - boot_time
    uptime = f"{uptime_delta.days}d {uptime_delta.seconds // 3600}h {(uptime_delta.seconds % 3600) // 60}m"
    
    # Simple TLD breakdown from mock_logs for tactical overview
    tld_counts = {}
    for l in mock_logs:
        domain = l['input'].split("//")[-1].split("/")[0] if "//" in l['input'] else ""
        if "." in domain:
            tld = domain.split(".")[-1]
            tld_counts[tld] = tld_counts.get(tld, 0) + 1
    
    return {
        "scanned_today": scanned_today,
        "blocked": blocked,
        "suspicious": suspicious,
        "latency_ms": avg_lat,
        "system_health": {
            "cpu": f"{cpu_usage}%",
            "memory": f"{mem_usage}MB",
            "uptime": uptime,
            "tld_breakdown": dict(sorted(tld_counts.items(), key=lambda x: x[1], reverse=True)[:3])
        }
    }


@app.get("/api/top-threats", tags=["Analytics"])
async def get_top_threats():
    """Get top malicious domains from recent logs."""
    counts = {}
    try:
        data = []
        if logs is not None:
            cursor = logs.find({"result.classification": "Malicious"}).sort("timestamp", -1).limit(500)
            async for doc in cursor:
                data.append(doc)
        else:
            data = [l for l in mock_logs if l['result'].get('classification') == 'Malicious']
        
        for entry in data:
            url = entry.get("input", "")
            domain = url.split("//")[-1].split("/")[0] if "//" in url else url
            if domain:
                counts[domain] = counts.get(domain, 0) + 1
    except Exception:
        pass
    
    sorted_threats = sorted(counts.items(), key=lambda x: x[1], reverse=True)[:5]
    return [t[0] for t in sorted_threats] if sorted_threats else ["No threats identified"]


@app.get("/api/logs", tags=["Analytics"])
async def get_soc_logs(limit: int = Query(default=100, ge=1, le=500)):
    """Retrieve logs in standardized SOC format."""
    raw_logs = await get_logs(limit=limit)
    soc_logs = []
    for entry in raw_logs:
        result = entry.get("result", {})
        url = entry.get("input", "")
        domain = url.split("//")[-1].split("/")[0] if "//" in url else (url or "Unknown")
        # Serialize timestamp to ISO string for JSON compatibility
        ts = entry.get("timestamp")
        if hasattr(ts, 'isoformat'):
            ts = ts.isoformat()
        soc_logs.append({
            "id": entry.get("_id", str(id(entry))),
            "timestamp": ts,
            "input": url,
            "domain": domain,
            "risk_score": result.get("risk_score", 0),
            "classification": result.get("classification", "Unknown"),
            "source": entry.get("source", "system"),
            "explanation": result.get("explanation", []),
            "result": result
        })
    return soc_logs


@app.get("/api/analytics/logs", tags=["Analytics"])
async def get_logs(limit: int = Query(default=50, ge=1, le=200)):
    """Retrieve recent scan history."""
    history = []
    try:
        if logs is not None:
            cursor = logs.find().sort("timestamp", -1).limit(limit)
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                history.append(doc)
        else:
            raise Exception("Using in-memory")
    except Exception:
        history = sorted(mock_logs, key=lambda x: x['timestamp'], reverse=True)[:limit]
        for h in history:
            h["_id"] = "mock_" + str(id(h))

    return history


@app.post("/api/admin/blacklist", tags=["Admin"])
async def add_to_blacklist(entry: BlacklistEntry):
    """Manually blacklist a domain."""
    try:
        if blacklist is not None:
            await blacklist.update_one(
                {"domain": entry.domain},
                {"$set": {
                    "domain": entry.domain,
                    "reason": entry.reason,
                    "timestamp": datetime.utcnow(),
                }},
                upsert=True,
            )
        else:
            raise Exception("In-memory")
    except Exception:
        # Remove existing entry if present, then add
        mock_blacklist[:] = [b for b in mock_blacklist if b['domain'] != entry.domain]
        mock_blacklist.append({
            "domain": entry.domain,
            "reason": entry.reason,
            "timestamp": datetime.utcnow(),
        })

    return {"status": "success", "message": f"{entry.domain} has been blacklisted."}


# ── Global System State ──────────────────────────────────────
protection_enabled = True

@app.get("/api/system/config", tags=["System"])
async def get_system_config():
    """Get the global system configuration."""
    return {
        "protection_enabled": protection_enabled,
        "engine_version": "2.1.0-NeuralSweep"
    }

@app.post("/api/system/config", tags=["System"])
async def update_system_config(enabled: bool):
    """Toggle the global protection state."""
    global protection_enabled
    protection_enabled = enabled
    return {"status": "success", "protection_enabled": protection_enabled}

@app.get("/api/health", tags=["System"])
async def health_check():
    """Health check endpoint for uptime monitoring."""
    return {
        "status": "active",
        "engine": "Feluda Intelligence Engine v2",
        "ml_model_loaded": intelligence_engine.model is not None,
        "protection_active": protection_enabled,
        "failsafe_active": failsafe_active
    }


# ── Self-Learning: Feedback & Retrain ───────────────────────
class FeedbackEntry(BaseModel):
    url: str
    label: int  # 1 = Malicious, 0 = Safe
    source: str = "manual"


@app.post("/api/admin/feedback", tags=["Admin"])
async def submit_feedback(entry: FeedbackEntry):
    """Submit a URL as a labelled training sample for the adaptive learner."""
    # Use DB storage for cloud persistence
    await adaptive_learner.append_to_db_feedback(
        db=db, url=entry.url, label=entry.label, source=entry.source
    )
    return {"status": "persisted", "url": entry.url, "label": entry.label}


@app.post("/api/admin/retrain", tags=["Admin"])
async def trigger_retrain():
    """Manually trigger an adaptive retraining cycle."""
    try:
        success, message = await adaptive_learner.retrain_with_feedback(
            db=db, engine=intelligence_engine
        )
        return {"success": success, "message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Legacy endpoints (backward-compatible) ────────────────────
@app.post("/predict-url", include_in_schema=False)
async def legacy_analyze_url(req: URLRequest):
    if not req.url:
        raise HTTPException(status_code=400, detail="URL is required")
    try:
        result = predict_url_risk(req.url)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict-text", include_in_schema=False)
async def legacy_analyze_text(req: TextRequest):
    if not req.text:
        raise HTTPException(status_code=400, detail="Text is required")
    try:
        result = predict_text_risk(req.text)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Entry point ───────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.getenv("API_PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
