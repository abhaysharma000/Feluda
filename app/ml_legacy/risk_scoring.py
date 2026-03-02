def calculate_risk_score(url_prob: float, text_prob: float) -> dict:
    # Ensemble Risk Aggregator
    # Weights the URL ML prediction against the NLP payload prediction if available.
    
    if text_prob is not None:
        final_score = (url_prob * 0.6) + (text_prob * 0.4)
    else:
        final_score = url_prob

    score_100 = round(final_score * 100)
    
    if score_100 <= 30:
        category = "Safe"
    elif score_100 <= 60:
        category = "Suspicious"
    else:
        category = "Dangerous"
        
    return {
        "risk_score": score_100,
        "classification": category,
        "confidence": round(final_score, 2)
    }

def generate_explanation(url_features: dict) -> list:
    # Explainable AI (XAI) Rule-based heuristic generator.
    # Parses the features and outputs human-readable rules triggered.
    reasons = []
    
    if url_features.get('has_ip') == 1:
        reasons.append("Highly critical: IP address used instead of domain name.")
    if url_features.get('has_at_symbol') == 1:
        reasons.append("Contains '@' symbol; a common method to obfuscate domains.")
    if url_features.get('has_suspicious_keywords', 0) > 0:
        reasons.append("Platform mimicking: Suspicious keywords found (e.g. 'login', 'secure').")
    if url_features.get('is_https') == 0:
        reasons.append("Unsecured traffic layer (Protocol is HTTP, not HTTPS).")
    if url_features.get('url_length', 0) > 75:
        reasons.append("Anomalous structural length; unusually long URL.")
    if url_features.get('subdomain_count', 0) > 2:
        reasons.append("Deep subdomain structure detected; typical in dynamic routing exploits.")
        
    if not reasons:
        reasons.append("No explicit structural red flags. Passed static analysis.")
    
    return reasons
