from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, HttpUrl, field_validator
from typing import List, Optional
import uvicorn
import os
import asyncio
from datetime import datetime

from app.core.engine import intelligence_engine
from app.core.email_analyzer import email_analyzer
from app.core.nlp_engine import nlp_engine
from app.core.qr_scanner import qr_scanner
import adaptive_learner

from motor.motor_asyncio import AsyncIOMotorClient

# ─────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Feluda AI — Cyber Intelligence API",
    version="2.0.0",
    description="AI-powered phishing detection: URLs, Emails, and QR Codes.",
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
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Preferred: React build folder
react_dist = os.path.join(base_dir, "dashboard-react", "dist")
# Fallback: Original dashboard folder (if any)
dashboard_path = os.path.join(base_dir, "dashboard")
extension_path = os.path.join(base_dir, "extension")

if os.path.exists(react_dist):
    app.mount("/dashboard", StaticFiles(directory=react_dist, html=True), name="react_dist")
    print(f"Mounted React Build: {react_dist} -> /dashboard")
elif os.path.exists(dashboard_path):
    app.mount("/dashboard", StaticFiles(directory=dashboard_path, html=True), name="dashboard")
    print(f"Mounted Legacy Dashboard: {dashboard_path} -> /dashboard")

if os.path.exists(extension_path):
    app.mount("/extension", StaticFiles(directory=extension_path, html=True), name="extension")


@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/dashboard")


# ── MongoDB / In-Memory Fallback ──────────────────────────────
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = None
db = None
logs = None
blacklist = None

mock_logs: list = []
mock_blacklist: list = []

try:
    client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=3000)
    db = client.feluda
    logs = db.scan_logs
    blacklist = db.blacklist
    print("MongoDB connected successfully.")
except Exception as e:
    print(f"MongoDB unavailable ({e}). Running in in-memory mode.")


# ── Pydantic Models ───────────────────────────────────────────
class URLRequest(BaseModel):
    url: str
    source: str = "manual"

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


# ── Startup ────────────────────────────────────────────────────
@app.on_event("startup")
async def startup_db_client():
    print("Feluda AI Backend starting up...")
    # Start adaptive retraining scheduler
    asyncio.create_task(
        adaptive_learner.schedule_auto_retrain(db=db, engine=intelligence_engine)
    )
    print("Feluda Learner: Adaptive cloud-sync engine scheduled.")


# ─────────────────────────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────────────────────────

@app.post("/api/scan/url", tags=["Scan"])
async def scan_url(request: URLRequest):
    """Scan a URL for phishing using the full 7-step intelligence pipeline."""
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
        return {
            "url": request.url,
            "classification": "Malicious",
            "risk_score": 100,
            "explanation": ["Domain is manually blacklisted by the administrator."],
            "source": "Blacklist",
        }

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
    except Exception:
        mock_logs.append(log_entry)

    return result


@app.post("/api/scan/email", tags=["Scan"])
async def scan_email(request: EmailRequest):
    """Analyze email content using the unified NLP engine (ML) + heuristic semantic analysis."""
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
        "protection_active": protection_enabled
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
