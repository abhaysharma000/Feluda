import time
import hashlib
from collections import deque
from fastapi import Request, HTTPException

class SpamProtector:
    """
    Spam and Message Bombing Protection Layer:
    - Rate Limiting (Requests per IP)
    - Content Deduplication (Identical message bombing)
    - Burst Detection
    """
    def __init__(self, rate_limit=10, time_window=60, duplicate_window=300):
        self.rate_limit = rate_limit      # max requests
        self.time_window = time_window    # window in seconds
        self.duplicate_window = duplicate_window # how long to remember content hashes
        
        # In-memory storage (reset on server restart)
        self.request_history = {} # {ip: deque([timestamps])}
        self.content_cache = {}   # {hash: timestamp}

    def check_rate_limit(self, ip: str) -> bool:
        """Simple token-bucket style rate limiting per IP."""
        now = time.time()
        if ip not in self.request_history:
            self.request_history[ip] = deque()
        
        history = self.request_history[ip]
        
        # Purge old stamps
        while history and now - history[0] > self.time_window:
            history.popleft()
            
        if len(history) >= self.rate_limit:
            return False
            
        history.append(now)
        return True

    def check_duplicate_content(self, text: str) -> bool:
        """Detect identical message bombing using SHA-256 hashing."""
        if not text or len(text) < 10:
            return True # Allow short strings to repeat (e.g. "hello")
            
        content_hash = hashlib.sha256(text.encode()).hexdigest()
        now = time.time()
        
        if content_hash in self.content_cache:
            last_seen = self.content_cache[content_hash]
            if now - last_seen < self.duplicate_window:
                return False # Duplicate within window
        
        self.content_cache[content_hash] = now
        
        # Periodic cleanup of cache
        if len(self.content_cache) > 1000:
            old_keys = [k for k, v in self.content_cache.items() if now - v > self.duplicate_window]
            for k in old_keys: del self.content_cache[k]
            
        return True

    async def middleware(self, request: Request, call_next):
        """FastAPI Middleware integration (Placeholder for future use)"""
        # Note: In a production Vercel environment, IP detection might need X-Forwarded-For
        ip = request.client.host
        
        if not self.check_rate_limit(ip):
            raise HTTPException(status_code=429, detail="Too many requests. Possible spam/bombing detected.")
            
        return await call_next(request)

spam_protector = SpamProtector()
