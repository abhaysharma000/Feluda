import re
from urllib.parse import urlparse
import tldextract

SUSPICIOUS_KEYWORDS = ['login', 'secure', 'verify', 'bank', 'update', 'account', 'auth', 'confirm']

def extract_url_features(url: str) -> dict:
    """Extracts structural features from a URL for ML classification."""
    parsed = urlparse(url)
    ext = tldextract.extract(url)
    domain = ext.domain
    subdomain = ext.subdomain
    
    features = {
        'url_length': len(url),
        'num_dots': url.count('.'),
        'has_at_symbol': 1 if '@' in url else 0,
        'has_ip': 1 if re.match(r'\d+\.\d+\.\d+\.\d+', domain) else 0,
        'has_suspicious_keywords': sum(1 for kw in SUSPICIOUS_KEYWORDS if kw in url.lower()),
        'is_https': 1 if parsed.scheme == 'https' else 0,
        'special_char_count': len(re.findall(r'[^a-zA-Z0-9\s.\-:/]', url)),
        'subdomain_count': len(subdomain.split('.')) if subdomain else 0
    }
    return features

def extract_text_features(text: str) -> str:
    """Cleans text for NLP processing (Optional step depending on vectorizer)."""
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    return text.strip()
