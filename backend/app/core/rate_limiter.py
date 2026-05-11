"""AI Family Hub - Gemini API Rate Limiter for Free Tier

Implements a sliding-window rate limiter to stay within Gemini free-tier limits:
- 15 requests per minute (RPM)
- 1,500 requests per day (RPD)
"""
import time
import threading
from collections import deque
from app.core.config import get_settings

settings = get_settings()


class GeminiRateLimiter:
    """Thread-safe sliding window rate limiter for Gemini API free tier."""

    def __init__(self):
        self.rpm_limit = settings.GEMINI_RPM_LIMIT
        self.rpd_limit = settings.GEMINI_RPD_LIMIT
        self.minute_window: deque = deque()  # timestamps of requests in the last minute
        self.day_window: deque = deque()     # timestamps of requests in the last day
        self.lock = threading.Lock()

    def _clean_windows(self):
        """Remove expired timestamps from both windows."""
        now = time.time()
        # Clean minute window (60 seconds)
        while self.minute_window and now - self.minute_window[0] > 60:
            self.minute_window.popleft()
        # Clean day window (86400 seconds)
        while self.day_window and now - self.day_window[0] > 86400:
            self.day_window.popleft()

    def can_make_request(self) -> bool:
        """Check if we can make a request without exceeding rate limits."""
        with self.lock:
            self._clean_windows()
            return (
                len(self.minute_window) < self.rpm_limit
                and len(self.day_window) < self.rpd_limit
            )

    def record_request(self):
        """Record a successful request timestamp."""
        with self.lock:
            now = time.time()
            self.minute_window.append(now)
            self.day_window.append(now)

    def get_wait_time(self) -> float:
        """Get seconds to wait before the next request is allowed."""
        with self.lock:
            self._clean_windows()
            if len(self.minute_window) >= self.rpm_limit:
                oldest = self.minute_window[0]
                return max(0, 60 - (time.time() - oldest) + 0.1)
            if len(self.day_window) >= self.rpd_limit:
                oldest = self.day_window[0]
                return max(0, 86400 - (time.time() - oldest) + 0.1)
            return 0

    def get_usage_stats(self) -> dict:
        """Return current usage statistics."""
        with self.lock:
            self._clean_windows()
            return {
                "rpm_used": len(self.minute_window),
                "rpm_limit": self.rpm_limit,
                "rpd_used": len(self.day_window),
                "rpd_limit": self.rpd_limit,
                "rpm_remaining": self.rpm_limit - len(self.minute_window),
                "rpd_remaining": self.rpd_limit - len(self.day_window),
            }


# Singleton instance
rate_limiter = GeminiRateLimiter()
