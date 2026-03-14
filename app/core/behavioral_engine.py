import re
import aiohttp
from bs4 import BeautifulSoup
from urllib.parse import urlparse


class BehavioralEngine:
    """
    Analyzes a web page's HTML content for phishing behavioral signals:
    - Credential form harvesting
    - Forms POST-ing to external domains
    - Hidden iframes (clickjacking / malware loading)
    - JavaScript obfuscation patterns
    """

    OBFUSCATION_PATTERNS = [
        (r'eval\(', 'eval() execution'),
        (r'unescape\(', 'unescape() string decode'),
        (r'atob\(', 'Base64 decode (atob)'),
        (r'String\.fromCharCode', 'String.fromCharCode encoding'),
        (r'_0x[a-f0-9]+', 'Hex-obfuscated variable names'),
        (r'document\.write\(unescape', 'document.write + unescape combo'),
        (r'debugger', 'Anti-analysis debugger trigger'),
        (r'window\.devtools', 'DevTools detection attempt'),
    ]

    # Timeout for fetching live page HTML
    FETCH_TIMEOUT = aiohttp.ClientTimeout(total=8)

    async def fetch_html(self, url: str) -> str:
        """Fetch the HTML of a page. Returns empty string on failure."""
        try:
            async with aiohttp.ClientSession(timeout=self.FETCH_TIMEOUT) as session:
                headers = {
                    "User-Agent": (
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) "
                        "Chrome/120.0.0.0 Safari/537.36"
                    )
                }
                async with session.get(url, headers=headers, allow_redirects=True) as resp:
                    if resp.status == 200:
                        content_type = resp.headers.get("Content-Type", "")
                        if "text/html" in content_type:
                            return await resp.text(errors="ignore")
        except Exception:
            pass
        return ""

    def analyze_behavior(self, html_content: str, url: str) -> dict:
        """
        Synchronously parse and analyze HTML for behavioral red flags.
        Call this after fetching HTML with fetch_html().
        """
        soup = BeautifulSoup(html_content, 'html.parser')
        results = []
        risk_modifier = 0

        # ── 1. Credential harvesting form detection ──────────────────
        for form in soup.find_all('form'):
            has_password = form.find('input', {'type': 'password'})
            action = form.get('action', '')

            if has_password:
                results.append("Credential form with password field detected")
                risk_modifier += 15

                # Check if the form POSTs to an external / rogue domain
                if action:
                    parsed_url = urlparse(url)
                    parsed_action = urlparse(action)
                    if (parsed_action.netloc
                            and parsed_action.netloc != parsed_url.netloc
                            and not action.startswith("/")):
                        results.append(
                            f"CRITICAL: Form POST-ing to external domain "
                            f"({parsed_action.netloc})"
                        )
                        risk_modifier += 25

        # ── 2. Hidden iframe detection (clickjacking / drive-by) ─────
        for iframe in soup.find_all('iframe'):
            style = iframe.get('style', '').lower().replace(' ', '')
            width = iframe.get('width', '')
            height = iframe.get('height', '')

            if (
                'display:none' in style
                or 'visibility:hidden' in style
                or (width in ('0', '0px') and height in ('0', '0px'))
            ):
                results.append("Hidden iframe detected (possible clickjacking / malware loading)")
                risk_modifier += 15

        # ── 3. JavaScript obfuscation & Anti-Analysis ──────────
        for script in soup.find_all('script'):
            script_content = script.string or ""
            for pattern, label in self.OBFUSCATION_PATTERNS:
                if re.search(pattern, script_content):
                    results.append(f"Security: {label} (Possible evasion attempt)")
                    risk_modifier += 15
                    break 

        # ── 4. Fake Trust Indicators ─────────────────────────
        # Most phishing kits have broken/static social media links
        social_patterns = ['facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com']
        fb_links = soup.find_all('a', href=re.compile(r'facebook\.com'))
        
        # If the page mentions 'login' but social links are missing or point to root brands,
        # it's often a signal of a quickly generated phishing kit.
        if "login" in html_content.lower() and not fb_links:
            # Check for generic 'brand' footer without real social integration
            if len(soup.find_all('a')) < 10: # Very few links often = phishing kit
                 results.append("Behavior: Abnormal link density for a service portal")
                 risk_modifier += 10

        return {
            "findings": results,
            "behavior_risk_score": min(100, risk_modifier),
            "engine": "Behavioral DOM & Network Analysis Engine v2",
            "html_fetched": bool(html_content),
        }


behavioral_engine = BehavioralEngine()
