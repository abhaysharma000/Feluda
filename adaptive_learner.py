"""
Feluda AI - Adaptive Learning Engine
=====================================
Every time a URL is blocked, it's added to a feedback queue.
This engine periodically retrains the model on new samples and
hot-reloads it into the running server — no restart required.
"""

import os
import json
import joblib
import asyncio
import logging
import pandas as pd
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV

try:
    from app.core.url_features import extractor as url_extractor
except ImportError:
    url_extractor = None

# MongoDB Support
try:
    from motor.motor_asyncio import AsyncIOMotorClient
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
except ImportError:
    AsyncIOMotorClient = None

logger = logging.getLogger("feluda.adaptive")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FEEDBACK_FILE = os.path.join(BASE_DIR, "data", "feedback_queue.jsonl")
MODEL_PATH = os.path.join(BASE_DIR, "app", "models", "phishing_model.pkl")
BENIGN_DATA = os.path.join(BASE_DIR, "data", "raw", "benign_urls.csv")
MIN_SAMPLES_TO_RETRAIN = 10  # Only retrain if at least 10 new samples exist
RETRAIN_INTERVAL_HOURS = 24  # Auto-retrain every 24 hours


def append_to_feedback(url: str, label: int, source: str = "auto"):
    """Add a URL + label to the feedback queue (File fallback)."""
    os.makedirs(os.path.dirname(FEEDBACK_FILE), exist_ok=True)
    entry = {
        "url": url,
        "label": label,
        "source": source,
        "timestamp": datetime.utcnow().isoformat()
    }
    with open(FEEDBACK_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")
    logger.info(f"Feluda Learner (Local): Queued {url}")

async def append_to_db_feedback(db, url: str, label: int, source: str = "auto"):
    """Add feedback to MongoDB for persistent cloud learning."""
    if db is None:
        append_to_feedback(url, label, source)
        return
    
    entry = {
        "url": url,
        "label": label,
        "source": source,
        "status": "pending",
        "timestamp": datetime.utcnow()
    }
    await db.feedback.insert_one(entry)
    logger.info(f"Feluda Learner (DB): Persisted {url} to cluster.")


async def load_feedback_samples(db=None, extractor=None):
    """Load feedback from DB or File and extract features."""
    if extractor is None:
        extractor = url_extractor
    if extractor is None:
        return [], []

    X, y = [], []
    
    # Try DB first
    if db is not None:
        cursor = db.feedback.find({"status": "pending"})
        async for entry in cursor:
            try:
                url = entry["url"]
                label = entry["label"]
                features = extractor.extract_features(url, skip_whois=True)
                numeric = {k: v for k, v in features.items()
                           if isinstance(v, (int, float)) and k != "label"}
                X.append(numeric)
                y.append(label)
            except Exception as e:
                logger.warning(f"DB Feedback Error: {e}")
        
    # File Fallback
    if os.path.exists(FEEDBACK_FILE):
        with open(FEEDBACK_FILE, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    entry = json.loads(line.strip())
                    url = entry["url"]
                    label = entry["label"]
                    features = extractor.extract_features(url, skip_whois=True)
                    numeric = {k: v for k, v in features.items()
                               if isinstance(v, (int, float)) and k != "label"}
                    X.append(numeric)
                    y.append(label)
                except Exception:
                    continue

    return X, y


async def retrain_with_feedback(db=None, extractor=None, engine=None):
    """
    Retrain the model using DB + File feedback.
    """
    if extractor is None:
        extractor = url_extractor
    logger.info("Feluda Learner: Starting cloud-sync retraining cycle...")

    # 1. Load feedback samples (Async)
    X_new, y_new = await load_feedback_samples(db, extractor)

    if len(X_new) < MIN_SAMPLES_TO_RETRAIN:
        logger.info(f"Feluda Learner: Only {len(X_new)} feedback samples. Minimum {MIN_SAMPLES_TO_RETRAIN} needed. Skipping.")
        return False, f"Not enough samples ({len(X_new)}/{MIN_SAMPLES_TO_RETRAIN})"

    logger.info(f"Feluda Learner: {len(X_new)} feedback samples loaded.")

    # 2. Load existing model's training data from benign_urls.csv for baseline
    X_base, y_base = [], []
    if os.path.exists(BENIGN_DATA):
        try:
            benign_df = pd.read_csv(BENIGN_DATA).head(500)  # Use 500 safe samples
            for _, row in benign_df.iterrows():
                try:
                    protocol = row.get('Protocol', 'https') or 'https'
                    domain = row.get('Domain', '')
                    path = row.get('Path', '/') or '/'
                    url = f"{protocol}://{domain}{path}"
                    features = extractor.extract_features(url, skip_whois=True)
                    numeric = {k: v for k, v in features.items()
                               if isinstance(v, (int, float)) and k != "label"}
                    X_base.append(numeric)
                    y_base.append(0)
                except Exception:
                    continue
        except Exception as e:
            logger.warning(f"Could not load benign baseline: {e}")

    # 3. Combine datasets
    all_X = X_base + X_new
    all_y = y_base + y_new

    if not all_X:
        return False, "No training data available"

    df = pd.DataFrame(all_X).fillna(0)
    y_series = pd.Series(all_y)

    # Ensure we have at least 2 classes
    if len(set(y_series)) < 2:
        logger.warning("Feluda Learner: Only one class in training data. Cannot retrain.")
        return False, "Insufficient class diversity"

    # 4. Retrain
    logger.info(f"Feluda Learner: Retraining on {len(df)} samples...")
    rf = RandomForestClassifier(n_estimators=100, max_depth=10, n_jobs=-1, random_state=42)
    model = CalibratedClassifierCV(rf, cv=3)
    model.fit(df, y_series)

    # 5. Save new model
    joblib.dump(model, MODEL_PATH)
    logger.info(f"Feluda Learner: Model saved to {MODEL_PATH}")

    # 6. Hot-reload into the running engine
    if engine is not None:
        engine.model = model
        logger.info("Feluda Learner: Model hot-reloaded into intelligence engine! ✅")

    # 7. Archive & Update DB
    if db is not None:
        await db.feedback.update_many({"status": "pending"}, {"$set": {"status": "processed"}})
    
    if os.path.exists(FEEDBACK_FILE):
        archive_path = FEEDBACK_FILE.replace(".jsonl", "_processed.jsonl")
        with open(FEEDBACK_FILE, "r") as src, open(archive_path, "a") as dst:
            dst.write(src.read())
        open(FEEDBACK_FILE, "w").close() 

    report_msg = f"Cloud-Sync Complete: Retrained on {len(df)} samples. Engine evolve active."
    logger.info(f"Feluda Learner: {report_msg}")
    return True, report_msg


async def schedule_auto_retrain(extractor=None, engine=None):
    """Background task: auto-retrain on schedule."""
    if extractor is None:
        extractor = url_extractor
    logger.info(f"Feluda Learner: Auto-retrain scheduled every {RETRAIN_INTERVAL_HOURS}h.")
    while True:
        await asyncio.sleep(RETRAIN_INTERVAL_HOURS * 3600)
        try:
            retrain_with_feedback(extractor, engine)
        except Exception as e:
            logger.error(f"Feluda Learner: Auto-retrain failed: {e}")
