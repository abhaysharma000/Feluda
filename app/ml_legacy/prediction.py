import pandas as pd
from .feature_extraction import extract_url_features, extract_text_features
from .model_loader import ml_registry
from .risk_scoring import calculate_risk_score, generate_explanation

def predict_url_risk(url: str):
    features = extract_url_features(url)
    
    if not ml_registry.url_model:
        return {"error": "URL Model not loaded. Run train.py first."}
        
    df = pd.DataFrame([features])
    # Ensure order of columns matches training
    feature_cols = ['url_length', 'num_dots', 'has_at_symbol', 'has_ip', 
                   'has_suspicious_keywords', 'is_https', 'special_char_count', 'subdomain_count']
    X = df[feature_cols]
    
    prob_phishing = ml_registry.url_model.predict_proba(X)[0][1] # Probability of class 1
    
    risk_info = calculate_risk_score(prob_phishing, text_prob=None)
    explanation = generate_explanation(features)
    
    return {
        "risk_score": risk_info["risk_score"],
        "classification": risk_info["classification"],
        "confidence": risk_info["confidence"],
        "explanation": explanation
    }

def predict_text_risk(text: str):
    if not ml_registry.text_model or not ml_registry.vectorizer:
        return {"error": "Text Model not loaded. Run train.py first."}
        
    X_vec = ml_registry.vectorizer.transform([text])
    prob_phishing = ml_registry.text_model.predict_proba(X_vec)[0][1]
    
    risk_info = calculate_risk_score(0.0, text_prob=prob_phishing) # Text only scenario
    
    if prob_phishing > 0.5:
        explanation = ["Text contains urgent/financial bait language patterns"]
    else:
        explanation = ["No immediate phishing indicators in text context"]

    return {
        "risk_score": round(prob_phishing * 100),
        "classification": risk_info["classification"],
        "confidence": round(prob_phishing, 2),
        "explanation": explanation
    }
