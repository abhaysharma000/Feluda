import re
import socket
import time
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

    def _get_domain_age(self, domain: str):
        """Return (age_in_days, creation_date_str) with caching."""
        now = time.time()
        cached = _whois_cache.get(domain)
        if cached and (now - cached["ts"]) < _WHOIS_TTL_SECONDS:
            return cached["age"], cached["date"]

        try:
            w = whois.whois(domain)
            creation_date = w.creation_date
            if isinstance(creation_date, list):
                creation_date = creation_date[0]

            if creation_date and isinstance(creation_date, datetime):
                age = max(0, (datetime.now() - creation_date).days)
                date_str = creation_date.strftime('%Y-%m-%d')
                _whois_cache[domain] = {"age": age, "date": date_str, "ts": now}
                return age, date_str
        except Exception:
            pass

        # Cache negative result too (to avoid repeated failing lookups)
        _whois_cache[domain] = {"age": 0, "date": "Unknown", "ts": now}
        return 0, "Unknown"

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

        # Structural features
        features['url_length'] = len(url)
        features['subdomain_count'] = (
            len([s for s in subdomain.split('.') if s]) if subdomain else 0
        )
        features['has_https'] = 1 if parsed_url.scheme == 'https' else 0

        # IP & spoofing checks
        features['is_ip_address'] = (
            1 if (self._is_ip(domain) or self._is_ip(extracted.domain)) else 0
        )
        features['has_homoglyph'] = 1 if self._check_homoglyph(url) else 0

        # Character frequency features
        special_chars = ['@', '?', '-', '=', '_', '.', '%']
        for char in special_chars:
            features[f'count_{char}'] = url.count(char)

        features['num_digits'] = sum(c.isdigit() for c in url)
        features['num_params'] = (
            len([p for p in parsed_url.query.split('&') if p])
            if parsed_url.query else 0
        )
        features['path_length'] = len(parsed_url.path)

        return features

    def _is_ip(self, domain: str) -> bool:
        try:
            socket.inet_aton(domain)
            return True
        except Exception:
            return False

    def _check_homoglyph(self, url: str) -> bool:
        return any(char in self.homoglyphs for char in url)


extractor = URLFeatureExtractor()
