import re
import socket
import time
import math
from urllib.parse import urlparse
import tldextract
import whois
from datetime import datetime

# ─────────────────────────────────────────────────────────────────
# In-memory WHOIS cache with 24-hour TTL to prevent slow repeated
# lookups on the same domain during a session.
# ─────────────────────────────────────────────────────────────────
_whois_cache: dict = {}
_WHOIS_TTL_SECONDS = 86400  # 24 hours


class URLFeatureExtractor:
    def __init__(self):
        self.homoglyphs = {
            'а': 'a', 'е': 'e', 'о': 'o', 'р': 'p', 'с': 'c', 'у': 'y',
            'і': 'i', 'ј': 'j', 'л': 'l', 'н': 'n', 'т': 't', 'х': 'x'
        }
        self.suspicious_keywords = [
            'login', 'verify', 'update', 'secure', 'account', 'banking',
            'signin', 'credential', 'password', 'confirm', 'auth', 'webscr',
            'ebayisapi', 'secure-login', 'wallet', 'crypto', 'bonus', 'gift'
        ]
        self.shorteners = [
            'bit.ly', 'goo.gl', 'shorte.st', 'go2l.ink', 'x.co', 'ow.ly', 't.co', 
            'tinyurl.com', 'tr.im', 'is.gd', 'cli.gs', 'yfrog.com', 'migre.me',
            'ff.im', 'tiny.cc', 'url4.eu', 'twit.ac', 'su.pr', 'twurl.nl', 'snipurl.com',
            'short.to', 'BudURL.com', 'ping.fm', 'post.ly', 'Justas.li', 'bkite.com',
            'snipr.com', 'fic.kr', 'loopt.us', 'doiop.com', 'short.ie', 'kl.am',
            'wp.me', 'rubyurl.com', 'om.ly', 'to.ly', 'bit.do', 't.ly'
        ]
        self.risky_tlds = ['.xyz', '.tk', '.top', '.ga', '.cf', '.ml', '.gq', '.shop', '.buzz', '.pw']
        self.top_brands = ['google', 'microsoft', 'apple', 'amazon', 'netflix', 'facebook', 'instagram', 'paypal', 'ebay', 'banking']

    def _get_domain_age(self, domain: str):
        """Return (age_in_days, creation_date_str) with caching and 1s cap."""
        now = time.time()
        cached = _whois_cache.get(domain)
        if cached and (now - cached["ts"]) < _WHOIS_TTL_SECONDS:
            return cached["age"], cached["date"]

        # If it's a known failing or slow domain, return cached N/A
        if cached and cached.get("failed"):
            return 0, "Unknown"

        try:
            import socket
            socket.setdefaulttimeout(1.0)
            w = whois.whois(domain)
            creation_date = w.creation_date
            if isinstance(creation_date, list):
                creation_date = creation_date[0]

            registrar = w.registrar or "Unknown"
            country = w.country or "Unknown"

            if creation_date and isinstance(creation_date, datetime):
                age = max(0, (datetime.now() - creation_date).days)
                date_str = creation_date.strftime('%Y-%m-%d')
                _whois_cache[domain] = {
                    "age": age, 
                    "date": date_str, 
                    "ts": now, 
                    "failed": False,
                    "registrar": registrar,
                    "country": country
                }
                return age, date_str
        except Exception:
            pass

        # Cache negative result
        _whois_cache[domain] = {"age": 0, "date": "Unknown", "ts": now, "failed": True, "registrar": "Unknown", "country": "Unknown"}
        return 0, "Unknown"

    def _get_registrar(self, domain: str) -> str:
        return _whois_cache.get(domain, {}).get("registrar", "Unknown")

    def _get_country(self, domain: str) -> str:
        return _whois_cache.get(domain, {}).get("country", "Unknown")

    def _calculate_entropy(self, text: str) -> float:
        """Calculate Shannon Entropy of a string."""
        if not text:
            return 0.0
        prob = [float(text.count(c)) / len(text) for c in dict.fromkeys(list(text))]
        entropy = - sum([p * math.log(p) / math.log(2.0) for p in prob])
        return entropy

    def extract_features(self, url: str, skip_whois: bool = False) -> dict:
        self.last_url = url
        parsed_url = urlparse(url)
        extracted = tldextract.extract(url)

        domain = extracted.domain + "." + extracted.suffix
        subdomain = extracted.subdomain

        features = {}

        # Domain WHOIS age
        age_days, creation_date = (
            self._get_domain_age(domain) if not skip_whois else (365, "N/A")
        )
        features['domain_age_days'] = age_days
        features['domain_creation_date'] = creation_date

        # Structural features (Unified Architecture v2.0)
        features['url_length'] = len(url)
        features['domain_length'] = len(domain)
        features['subdomain_count'] = (
            len([s for s in subdomain.split('.') if s]) if subdomain else 0
        )
        features['dot_count'] = url.count('.')
        features['has_https'] = 1 if parsed_url.scheme == 'https' else 0
        features['entropy'] = self._calculate_entropy(url)

        # IP & spoofing checks
        features['is_ip_address'] = (
            1 if (self._is_ip(domain) or self._is_ip(extracted.domain)) else 0
        )
        features['has_homoglyph'] = 1 if self._check_homoglyph(url) else 0

        # Character frequency features
        special_chars = ['@', '?', '-', '=', '_', '%']
        total_special = 0
        for char in special_chars:
            count = url.count(char)
            features[f'count_{char}'] = count
            total_special += count
        features['special_char_count'] = total_special

        features['num_digits'] = sum(c.isdigit() for c in url)
        features['num_params'] = (
            len([p for p in parsed_url.query.split('&') if p])
            if parsed_url.query else 0
        )
        features['path_length'] = len(parsed_url.path)

        # Suspicious keyword check
        url_lower = url.lower()
        features['suspicious_keywords'] = sum(1 for kw in self.suspicious_keywords if kw in url_lower)

        # ── Advanced Signals (v2.1) ──────────────────────────
        # 1. URL Shortener Detection
        features['is_shortened'] = 1 if any(s in url_lower for s in self.shorteners) else 0
        
        # 2. TLD Risk Score
        features['tld_risk_score'] = 1 if any(url_lower.endswith(tld) for tld in self.risky_tlds) else 0
        
        # 3. Brand in Subdomain (Phishing indicator)
        features['brand_in_subdomain'] = 1 if any(brand in subdomain.lower() for brand in self.top_brands) else 0
        
        # 4. Digit-to-Length Ratio
        features['digit_ratio'] = features['num_digits'] / features['url_length'] if features['url_length'] > 0 else 0

        return features

    def _is_ip(self, domain: str) -> bool:
        try:
            if not domain: return False
            # Check for standard IPv4
            socket.inet_aton(domain)
            return True
        except Exception:
            # Check for hex-encoded IP or other obfuscations (simplified)
            return False

    def _check_homoglyph(self, url: str) -> bool:
        return any(char in self.homoglyphs for char in url)


extractor = URLFeatureExtractor()
