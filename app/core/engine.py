import joblib
import os
import pandas as pd
import numpy as np
from app.core.url_features import extractor
from app.core.threat_intel import threat_intel
from app.core.visual_engine import visual_engine
from app.core.behavioral_engine import behavioral_engine

# SHAP is optional — gracefully degrade if not installed
try:
    import shap
    SHAP_AVAILABLE = True
except ImportError:
    SHAP_AVAILABLE = False
    print("WARNING: 'shap' not installed. SHAP explainability disabled.")


class IntelligenceEngine:
    """
    Master orchestrator for Feluda's 7-step phishing analysis pipeline:
      1. URL Feature Extraction
      2. ML Prediction (Calibrated Random Forest)
      2a. SHAP Feature Attribution
      3. Threat Intel (Google Safe Browsing + VirusTotal)
      4. Visual Brand Similarity Check
      5. Behavioral DOM Analysis (live HTML fetch)
      6. Hybrid Risk Scoring
      7. Explainable Reasoning
    """

    FEATURE_LABEL_MAP = {
        'url_length':      'URL Length Anomaly',
        'subdomain_count': 'Excessive Subdomain Depth',
        'domain_age_days': 'Domain Age Anomaly',
        'has_https':       'Insecure Protocol (No HTTPS)',
        'is_ip_address':   'Raw IP Address Usage',
        'has_homoglyph':   'Visual Homoglyph Spoofing',
        'count_-':         'High Dash Density',
        'count_.':         'Excessive Dot Count',
        'count_@':         'Suspicious @ Character',
        'count_%':         'URL Encoding Anomaly',
        'num_digits':      'High Digit Ratio',
        'num_params':      'Excessive Query Parameters',
        'path_length':     'Abnormal Path Length',
    }

    def __init__(self):
        base_dir = os.path.dirname(os.path.dirname(__file__))
        self.model_path = os.path.join(base_dir, 'models', 'phishing_model.pkl')
        self.model = None
        self.explainer = None

        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                self._init_shap()
            except Exception as e:
                print(f"WARNING: Could not load ML model — {e}")

    def _init_shap(self):
        """Pre-initialize SHAP explainer for fast local explanations."""
        if not SHAP_AVAILABLE or self.model is None:
            return
        try:
            if hasattr(self.model, 'calibrated_classifiers_'):
                cal_clf = self.model.calibrated_classifiers_[0]
                base_est = getattr(cal_clf, 'estimator',
                                   getattr(cal_clf, 'base_estimator', None))
                if base_est:
                    self.explainer = shap.TreeExplainer(base_est)
                else:
                    self.explainer = None
            else:
                self.explainer = shap.Explainer(self.model)
        except Exception as e:
            print(f"SHAP Initialization Warning: {e}")
            self.explainer = None

    # ──────────────────────────────────────────────────────────────
    async def analyze_url(self, url: str) -> dict:
        # ── Step 1: Feature Extraction ────────────────────────────
        features = extractor.extract_features(url)

        # ── Step 2: ML Prediction ────────────────────────────────
        classification = "Unknown"
        confidence = 0.0
        shap_contributors = []

        if self.model:
            feat_df = pd.DataFrame([features])
            if 'domain_creation_date' in feat_df.columns:
                feat_df = feat_df.drop('domain_creation_date', axis=1)

            prediction = self.model.predict(feat_df)[0]
            probabilities = self.model.predict_proba(feat_df)[0]
            classification = "Malicious" if prediction == 1 else "Safe"
            confidence = float(probabilities[prediction]) * 100

            # ── Step 2a: SHAP Explainability ──────────────────────
            if self.explainer and SHAP_AVAILABLE and prediction == 1:
                try:
                    shap_values = self.explainer.shap_values(feat_df)
                    if isinstance(shap_values, list):
                        vals = shap_values[1][0]
                    elif len(shap_values.shape) == 3:
                        vals = shap_values[0, :, 1]
                    else:
                        vals = shap_values[0]

                    feature_importance = dict(zip(feat_df.columns, vals))
                    sorted_features = sorted(
                        feature_importance.items(), key=lambda x: x[1], reverse=True
                    )
                    shap_contributors = [
                        self.FEATURE_LABEL_MAP.get(f, f.replace('_', ' ').title())
                        for f, v in sorted_features[:3] if v > 0
                    ]
                except Exception as e:
                    print(f"SHAP calculation error: {e}")

        # ── Step 3: Threat Intel (async) ─────────────────────────
        gsb_result, vt_result = await asyncio_gather(
            threat_intel.check_google_safe_browsing(url),
            threat_intel.check_virustotal(url),
        )

        # ── Step 4: Visual Brand Similarity ──────────────────────
        visual_result = visual_engine.analyze_similarity(url)

        # ── Step 5: Behavioral DOM Analysis (live fetch) ─────────
        html_content = await behavioral_engine.fetch_html(url)
        behavior_result = behavioral_engine.analyze_behavior(html_content, url)

        # ── Step 6: Hybrid Risk Scoring ──────────────────────────
        risk_score = self._calculate_risk_score(
            features, classification, confidence, gsb_result, vt_result, visual_result, behavior_result
        )

        # ── Step 7: Explainable Reasoning ────────────────────────
        explanation = self._generate_explanation(
            features, classification, risk_score,
            gsb_result, vt_result, visual_result, behavior_result, url
        )

        if risk_score >= 65:
            final_classification = "Malicious"
        elif risk_score >= 35:
            final_classification = "Suspicious"
        else:
            final_classification = "Safe"

        return {
            "url": url,
            "classification": final_classification,
            "confidence_score": f"{confidence:.2f}%",
            "risk_score": round(risk_score, 1),
            "explanation": explanation,
            "raw_features": features,
            "top_contributors": shap_contributors,
            "brand_analysis": visual_result or {"status": "No impersonation detected"},
            "behavioral_analysis": behavior_result,
            "threat_intel_reports": {
                "google_safe_browsing": gsb_result,
                "virustotal": vt_result,
            },
        }

    # ──────────────────────────────────────────────────────────────
    def _calculate_risk_score(
        self, features, ml_class, confidence, gsb, vt, visual, behavior
    ) -> float:
        score = 0.0

        # ML confidence weight (up to 25 pts)
        if ml_class == "Malicious":
            score += confidence * 0.25

        # Feature anomaly signals (up to 55 pts)
        if features.get('is_ip_address'):    score += 15
        if features.get('has_homoglyph'):    score += 15
        if features.get('url_length', 0) > 100:    score += 5
        if features.get('subdomain_count', 0) > 3: score += 5
        if not features.get('has_https'):    score += 10
        if 0 < features.get('domain_age_days', 365) < 30: score += 10

        # Brand impersonation (+20 pts)
        if visual:
            score += 20

        # Behavioral DOM risk (up to 15 pts)
        score += behavior.get('behavior_risk_score', 0) * 0.15

        # Google Safe Browsing match (+15 pts)
        if gsb and 'matches' in gsb:
            score += 15

        # VirusTotal flagged (+15 pts)
        if vt and isinstance(vt, dict) and vt.get('flagged'):
            score += 15

        return min(100.0, score)

    # ──────────────────────────────────────────────────────────────
    def _generate_explanation(
        self, features, ml_class, risk_score, gsb, vt, visual, behavior, url
    ) -> list:
        reasons = []
        url_lower = url.lower()

        # Behavioral DOM findings (highest priority)
        for finding in behavior.get('findings', []):
            reasons.append(f"BEHAVIORAL ALERT: {finding}")

        # Brand impersonation
        if visual:
            reasons.append(
                f"BRAND IMPERSONATION: Visual similarity to "
                f"{visual['impersonated_brand']} is {visual['similarity_score']}%"
            )

        # Domain age
        age = features.get('domain_age_days', 0)
        if 0 < age < 7:
            reasons.append(
                f"Zero-day domain detected ({age} days old). "
                "Phishing links use short-lived domain lifecycle tactics."
            )
        elif 0 < age < 30:
            reasons.append(f"Recently registered domain ({age} days old) — high-risk window.")

        # Suspicious keywords in URL
        suspicious_keywords = [
            "auth", "verify", "login", "secure", "update",
            "account", "banking", "signin", "credential", "password"
        ]
        found = [k for k in suspicious_keywords if k in url_lower]
        if found:
            reasons.append(
                f"Suspicious keywords in URL: {', '.join(f'\"{k}\"' for k in found)}"
            )

        # Structural anomalies
        if features.get('subdomain_count', 0) > 3:
            reasons.append(
                f"Subdomain abuse detected ({features['subdomain_count']} levels deep)"
            )
        if features.get('is_ip_address'):
            reasons.append("URL uses a raw IP address instead of a registered domain name")
        if features.get('has_homoglyph'):
            reasons.append(
                "Visual Homoglyph spoofing detected — characters mimicking real brand names"
            )

        # ML verdict
        if ml_class == "Malicious":
            reasons.append(
                "AI Prediction: High risk via Calibrated Neural Confidence (Platt Scaling)"
            )

        # External threat intel
        if gsb and 'matches' in gsb:
            reasons.append("Flagged by Google Safe Browsing Threat Intelligence")
        if vt and isinstance(vt, dict) and vt.get('flagged'):
            engines = vt.get('malicious_engines', 0) + vt.get('suspicious_engines', 0)
            reasons.append(f"VirusTotal: Flagged by {engines} security engine(s)")

        if not reasons:
            reasons.append(
                "General structural anomalies detected by neural pattern matching"
            )

        return reasons[:6]


# ── Helper: run two coroutines concurrently ───────────────────────
async def asyncio_gather(*coros):
    import asyncio
    return await asyncio.gather(*coros)


intelligence_engine = IntelligenceEngine()
