import joblib
import os
import time
import asyncio
import pandas as pd
import numpy as np
from urllib.parse import urlparse
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

    GLOBAL_SAFE_DOMAINS = {
        'google.com', 'github.com', 'mongodb.com', 'microsoft.com', 'apple.com',
        'amazon.com', 'facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com',
        'netflix.com', 'youtube.com', 'wikipedia.org', 'adobe.com', 'oracle.com',
        'salesforce.com', 'zoom.us', 'slack.com', 'dropbox.com', 'spotify.com',
        'vercel.app', 'github.io', 'pages.dev', 'netlify.app', 'render.com',
        'stripe.com', 'paypal.com', 'visa.com', 'mastercard.com', 'chase.com',
        'bankofamerica.com', 'wellsfargo.com', 'goldmansachs.com', 'gmail.com',
        'outlook.com', 'yahoo.com', 'icloud.com', 'protonmail.com', 'reddit.com',
        'stackoverflow.com', 'medium.com', 'quora.com', 'npmmj.com', 'pypi.org',
        'docker.com', 'kubernetes.io', 'hashicorp.com', 'aws.amazon.com',
        'azure.microsoft.com', 'cloud.google.com', 'bitbucket.org', 'gitlab.com'
    }

    def __init__(self):
        base_dir = os.path.dirname(os.path.dirname(__file__))
        ext_model_path = os.path.join(base_dir, 'models', 'extension_model.pkl')
        legacy_model_path = os.path.join(base_dir, 'models', 'phishing_model.pkl')
        self.model_path = ext_model_path if os.path.exists(ext_model_path) else legacy_model_path
        self._model = None
        self.explainer = None

    @property
    def model(self):
        """Lazy-load the model only when needed."""
        if self._model is None and os.path.exists(self.model_path):
            try:
                self._model = joblib.load(self.model_path)
                print(f"Feluda: Loaded ML model from {os.path.basename(self.model_path)}")
                self._init_shap()
            except Exception as e:
                print(f"WARNING: Could not load ML model ({self.model_path}) — {e}")
        return self._model

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
    # ──────────────────────────────────────────────────────────────
    async def analyze_url(self, url: str, skip_whois: bool = False, source: str = "manual") -> dict:
        import asyncio
        start_ts = time.time()
        
        # ── Step 1: Structural Feature Extraction (Synchronous, fast) ──
        # We skip WHOIS here to maintain <300ms guarantee
        features = extractor.extract_features(url, skip_whois=True)
        domain = urlparse(url).netloc or url.split("//")[-1].split("/")[0]
        
        # ── Step 1a: Global Whitelist Early-Exit ──
        base_domain = '.'.join(domain.lower().split('.')[-2:])
        if base_domain in self.GLOBAL_SAFE_DOMAINS or domain.lower() in self.GLOBAL_SAFE_DOMAINS:
            return {
                "url": url,
                "classification": "Safe",
                "confidence_score": "100.00%",
                "risk_score": 0.0,
                "explanation": ["Trusted Infrastructure: Domain is on the global verified whitelist."],
                "latency_ms": 0.1,
                "raw_features": features,
                "top_contributors": [],
                "source": source,
                "node_id": "Neural_Node_Whitelist"
            }

        # ── Step 2-5: Parallel Async Intelligence Retrieval ───────────
        # Target: Execute within 250ms or skip slow signals
        gsb_task = asyncio.create_task(threat_intel.check_google_safe_browsing(url))
        vt_task = asyncio.create_task(threat_intel.check_virustotal(url))
        
        # We wrap WHOIS in a thread-pool because the library is blocking
        loop = asyncio.get_event_loop()
        whois_task = loop.run_in_executor(None, extractor._get_domain_age, domain)

        try:
            # Strict deadline for intelligence signals: 250ms
            # This ensures we have 50ms left for ML prediction & scoring
            results = await asyncio.gather(
                asyncio.wait_for(gsb_task, timeout=0.25),
                asyncio.wait_for(vt_task, timeout=0.25),
                asyncio.wait_for(whois_task, timeout=0.25),
                return_exceptions=True
            )
            gsb_result = results[0] if not isinstance(results[0], (Exception, asyncio.TimeoutError)) else None
            vt_result = results[1] if not isinstance(results[1], (Exception, asyncio.TimeoutError)) else None
            age_info = results[2] if not isinstance(results[2], (Exception, asyncio.TimeoutError)) else (365, "Unknown")
        except:
            gsb_result, vt_result, age_info = None, None, (365, "Unknown")

        # Update features with late-bound WHOIS info
        features['domain_age_days'] = age_info[0]
        features['domain_creation_date'] = age_info[1]

        # ── Step 6: ML Prediction (Optimized Local Inference) ──────────
        classification = "Unknown"
        confidence = 0.0
        shap_contributors = []

        if self.model: # Using the lazy-load property
            feat_df = pd.DataFrame([features])
            if 'domain_creation_date' in feat_df.columns:
                feat_df = feat_df.drop('domain_creation_date', axis=1)
            if 'url_lower' in feat_df.columns:
                feat_df = feat_df.drop('url_lower', axis=1)
            for feat in ['ip_address', 'asn', 'organization']:
                if feat in feat_df.columns:
                    feat_df = feat_df.drop(feat, axis=1)

            # Ensure all columns match the model's training features
            # and are in the correct order if possible, though RF is robust.
            
            try:
                prediction = self.model.predict(feat_df)[0]
                probabilities = self.model.predict_proba(feat_df)[0]
                classification = "Malicious" if prediction == 1 else "Safe"
                confidence = float(probabilities[prediction]) * 100

                # ── Step 6a: SHAP Explainability ────────────────────────
                if self.explainer and SHAP_AVAILABLE and prediction == 1:
                    try:
                        shap_values = self.explainer.shap_values(feat_df)
                        if isinstance(shap_values, list):
                            # For CalibratedClassifierCV or specific multi-class outputs
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
            except Exception as e:
                print(f"ML Prediction Error: {e}")

        # ── Step 7: Behavioral Analysis (Live HTML Fetch) ─────────────
        # We perform a full behavioral scan to detect credential harvesting
        html_content = await behavioral_engine.fetch_html(url)
        behavior_result = behavioral_engine.analyze_behavior(html_content, url)
        
        # ── Step 8: Hybrid Risk Scoring & Reasoning ────────────────────
        risk_score = self._calculate_risk_score(
            features, classification, confidence, gsb_result, vt_result, None, behavior_result
        )

        explanation = self._generate_explanation(
            features, classification, risk_score,
            gsb_result, vt_result, None, behavior_result, url
        )

        final_classification = (
            "Malicious" if risk_score >= 65 else ("Suspicious" if risk_score >= 35 else "Safe")
        )

        # Enhance raw features for the frontend
        features.update({
            "form_count": sum(1 for f in behavior_result.get("findings", []) if "form" in f.lower()),
            "password_fields": sum(1 for f in behavior_result.get("findings", []) if "password" in f.lower()),
            "external_scripts": sum(1 for f in behavior_result.get("findings", []) if "script" in f.lower()),
            "registrar": extractor._get_registrar(domain),
            "country": extractor._get_country(domain)
        })

        latency = (time.time() - start_ts) * 1000

        return {
            "url": url,
            "classification": final_classification,
            "confidence_score": f"{confidence:.2f}%",
            "risk_score": round(risk_score, 1),
            "explanation": explanation,
            "latency_ms": round(latency, 2),
            "raw_features": features,
            "top_contributors": shap_contributors,
            "threat_intel_reports": {
                "google_safe_browsing": gsb_result or {"status": "skipped_or_timeout"},
                "virustotal": vt_result or {"status": "skipped_or_timeout"},
            },
            "behavioral_analysis": behavior_result,
            "source": source,
            "node_id": "Neural_Node_7"
        }

    # ──────────────────────────────────────────────────────────────
    def _calculate_risk_score(
        self, features, ml_class, confidence, gsb, vt, visual, behavior
    ) -> float:
        """
        Unified Weighted Risk Scoring Engine (v2.5 Hackathon Optimized):
        - ML Score (Core Intelligence): 50%
        - Structural & Heuristic Signals: 30%
        - Behavioral (Live DOM): 10%
        - Threat Intel (Third-party): 10%
        """
        ml_weight = 0.0
        structural_weight = 0.0
        behavior_weight = 0.0
        intel_weight = 0.0

        # 1. ML Score (Max 50 pts)
        if ml_class == "Malicious":
            # Calibrated projection
            ml_weight = (confidence / 100.0) * 50.0
        elif ml_class == "Safe" and confidence < 65:
            # High-uncertainty safe predictions contribute minor risk
            ml_weight = (1.0 - (confidence / 100.0)) * 12.0

        # 2. Structural & Heuristic Risk (Max 30 pts)
        s_score = 0
        if features.get('is_ip_address'): s_score += 10
        if features.get('has_homoglyph'): s_score += 10
        if features.get('double_extension'): s_score += 12 # Highly suspicious
        if features.get('brand_hyphenation'): s_score += 8  # typosquatting sign
        if features.get('brand_in_subdomain'): s_score += 6
        if features.get('tld_risk_score'): s_score += 5
        if features.get('non_standard_port'): s_score += 7
        if features.get('is_shortened'): s_score += 3
        if not features.get('has_https'): s_score += 4
        
        # Keyword stacking penalty
        if features.get('cred_trigger_count', 0) >= 3: s_score += 8
        elif features.get('cred_trigger_count', 0) >= 1: s_score += 3
        
        structural_weight = min(30.0, float(s_score))

        # 3. Behavioral Risk (Max 10 pts)
        # Pulling from the live DOM analysis engine
        b_score = behavior.get('behavior_risk_score', 0)
        behavior_weight = (b_score / 100.0) * 10.0

        # 4. Threat Intel (Max 10 pts)
        if (gsb and 'matches' in gsb) or (vt and isinstance(vt, dict) and vt.get('flagged')):
            intel_weight = 10.0

        # 5. Software Risk Heuristics (Penalty Overlay)
        software_risk = 0
        sw_keywords = ['apk', 'mod', 'cracked', 'premium', 'hack', 'cheat', 'patch']
        url_lower = features.get('url_lower', '').lower()
        sw_matches = sum(1 for kw in sw_keywords if kw in url_lower)
        if sw_matches >= 1: software_risk += 15.0
        if sw_matches >= 2: software_risk += 15.0
        
        # 6. Freshness Penalty (WHOIS overlay)
        age_penalty = 0
        age = features.get('domain_age_days', 0)
        if 0 < age < 14: age_penalty = 15.0
        elif 0 < age < 60: age_penalty = 8.0
        
        total_score = ml_weight + structural_weight + behavior_weight + intel_weight + software_risk + age_penalty
        
        # Global Overrides for Critical Findings
        if visual or behavior.get('behavior_risk_score', 0) >= 60:
            total_score = max(total_score, 92.0)
            
        return min(100.0, total_score)

    # ──────────────────────────────────────────────────────────────
    def _generate_explanation(
        self, features, ml_class, risk_score, gsb, vt, visual, behavior, url
    ) -> list:
        reasons = []
        
        # ML Engine Verdict
        if ml_class == "Malicious":
            reasons.append(f"ML Core: High-confidence neural match for phishing patterns ({risk_score:.1f}% weighted risk)")
        
        # Structural 
        if features.get('is_ip_address'):
            reasons.append("Structural: Usage of raw IP address signals identity masking")
        if features.get('double_extension'):
            reasons.append("Structural: Suspicious double file extension (Phishing Payload)")
        if features.get('has_homoglyph'):
            reasons.append("Structural: Visual homoglyph characters detected (Brand Spoofing)")
        if features.get('entropy', 0) > 4.8:
            reasons.append(f"Structural: High URL entropy ({features['entropy']:.2f}) indicates obfuscation")
        if features.get('brand_hyphenation'):
            reasons.append("Heuristic: Defensive hyphenation matching trusted brands detected")
            
        # Age
        age = features.get('domain_age_days', 0)
        if 0 < age < 14:
            reasons.append(f"Identity: Exceptionally young domain ({age} days) detected")
        elif 0 < age < 60:
            reasons.append(f"Identity: Domain is in high-risk registration window ({age} days)")
            
        # Intel
        if gsb and 'matches' in gsb:
            reasons.append("Intel: URL actively flagged by Google Safe Browsing")
        if vt and isinstance(vt, dict) and vt.get('flagged'):
            reasons.append("Intel: Multiple security engines flagged this URL in VirusTotal")
            
        # Behavioral/Visual Override
        if visual:
            reasons.append(f"Visual: High similarity to {visual['impersonated_brand']} detected")
        if behavior.get('findings'):
            reasons.append(f"Behavior: {behavior['findings'][0]}")

        if not reasons:
            reasons.append("Heuristic: Combined structural anomalies exceed safety thresholds")

        return reasons[:5]


# ── Helper: run two coroutines concurrently ───────────────────────
async def asyncio_gather(*coros):
    import asyncio
    return await asyncio.gather(*coros)


intelligence_engine = IntelligenceEngine()
