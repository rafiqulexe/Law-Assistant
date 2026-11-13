import app as webapp
from src import rate_limit


def test_login_is_limited_per_ip(api):
    for _ in range(10):
        api.post("/api/login", {"username": "rafiq", "password": "guess"})
    response = api.post("/api/login", {"username": "rafiq", "password": "guess"})
    assert response.status_code == 429
    assert "Too many requests" in response.get_json()["error"]
    assert int(response.headers["Retry-After"]) > 0


def test_register_is_limited(api):
    for number in range(5):
        api.post("/api/register", {"username": f"user{number}", "password": "password123"})
    response = api.post("/api/register", {"username": "user5", "password": "password123"})
    assert response.status_code == 429


def test_ai_requests_are_limited_per_user(user, chain):
    for _ in range(webapp.AI_REQUESTS_PER_10_MIN):
        assert user.post("/api/chat", {"message": "What is theft?"}).status_code == 200
    assert user.post("/api/chat", {"message": "What is theft?"}).status_code == 429


def test_ai_limit_is_shared_by_the_tools(user, chain, monkeypatch):
    monkeypatch.setattr(webapp, "ask_for_text", lambda _prompt: "A document")
    for _ in range(webapp.AI_REQUESTS_PER_10_MIN):
        user.post("/api/chat", {"message": "What is theft?"})
    response = user.post("/api/documents/generate", {"document_type": "Affidavit", "fields": {}})
    assert response.status_code == 429


def test_window_slides(monkeypatch):
    now = [1000.0]
    monkeypatch.setattr(rate_limit.time, "monotonic", lambda: now[0])
    assert rate_limit.hit("k", 2, 60) == 0
    assert rate_limit.hit("k", 2, 60) == 0
    assert rate_limit.hit("k", 2, 60) == 60
    now[0] += 61
    assert rate_limit.hit("k", 2, 60) == 0


def test_limits_can_be_switched_off(api, monkeypatch):
    monkeypatch.setenv("RATE_LIMITS", "0")
    for _ in range(12):
        response = api.post("/api/login", {"username": "rafiq", "password": "guess"})
    assert response.status_code == 401


def test_forwarded_address_only_used_when_trusted(api, monkeypatch):
    for number in range(10):
        api.client.post(
            "/api/login",
            json={"username": "x", "password": "y"},
            headers={"X-CSRFToken": api.token, "X-Forwarded-For": f"10.0.0.{number}"},
        )
    # Without TRUST_PROXY the faked header is ignored, so all ten count against one address.
    response = api.post("/api/login", {"username": "x", "password": "y"})
    assert response.status_code == 429
