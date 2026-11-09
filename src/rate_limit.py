"""Small in-memory rate limiter.

Counts are kept per process, which is enough for a single worker (local runs,
PythonAnywhere). Several workers would each keep their own counts.
"""
import math
import os
import threading
import time
from collections import defaultdict, deque
from functools import wraps

from flask import jsonify, request, session

_hits = defaultdict(deque)
_lock = threading.Lock()


def enabled():
    return os.getenv("RATE_LIMITS", "1") != "0"


def client_ip():
    # Behind a proxy (PythonAnywhere) the real address is in X-Forwarded-For.
    # Only trust it when told to, or anyone could fake a new address per request.
    if os.getenv("TRUST_PROXY") == "1":
        forwarded = request.headers.get("X-Forwarded-For", "")
        if forwarded:
            return forwarded.split(",")[0].strip()
    return request.remote_addr or "unknown"


def hit(key, count, seconds):
    """Record one request. Returns seconds to wait, or 0 if it is allowed."""
    now = time.monotonic()
    with _lock:
        times = _hits[key]
        while times and now - times[0] >= seconds:
            times.popleft()
        if len(times) >= count:
            return math.ceil(seconds - (now - times[0]))
        times.append(now)
    return 0


def reset():
    with _lock:
        _hits.clear()


def limit(name, count, seconds, per="ip"):
    """Allow `count` requests per `seconds` for each IP, or each signed-in user."""

    def decorator(view):
        @wraps(view)
        def wrapped(*args, **kwargs):
            if enabled():
                who = session.get("user_id") if per == "user" else None
                key = f"{name}:{'user:' + str(who) if who else 'ip:' + client_ip()}"
                wait = hit(key, count, seconds)
                if wait:
                    minutes = max(1, math.ceil(wait / 60))
                    response = jsonify({
                        "error": f"Too many requests. Please try again in {minutes} minute(s)."
                    })
                    response.status_code = 429
                    response.headers["Retry-After"] = str(wait)
                    return response
            return view(*args, **kwargs)

        return wrapped

    return decorator
