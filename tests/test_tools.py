import app as webapp


def test_contract_score_is_kept_between_0_and_100(user, monkeypatch):
    monkeypatch.setattr(webapp, "ask_for_json", lambda _prompt: {"summary": "ok", "riskScore": 142})
    response = user.post("/api/contract/analyze", {"text": "The tenant pays rent monthly."})
    assert response.status_code == 200
    assert response.get_json()["riskScore"] == 100
    assert user.get("/api/dashboard").get_json()["recent"][0]["risk"] == "high"


def test_contract_needs_text(user):
    assert user.post("/api/contract/analyze", {"text": ""}).status_code == 400


def test_contract_model_failure(user, monkeypatch):
    def broken(_prompt):
        raise ValueError("The model did not return JSON.")

    monkeypatch.setattr(webapp, "ask_for_json", broken)
    assert user.post("/api/contract/analyze", {"text": "Some contract"}).status_code == 503


def test_risk_check_returns_verdict_and_sources(user, monkeypatch):
    monkeypatch.setattr(webapp, "ask_for_json", lambda _prompt: {"level": "HIGH", "headline": "Void", "steps": ["Ask"]})
    data = user.post("/api/risk/check", {"text": "Some clause"}).get_json()
    assert data["level"] == "high"
    assert data["steps"] == ["Ask"]
    source = data["sources"][0]
    assert source["label"] == "The Penal Code, 1860 - Punishment for theft (official, updated 2026-11-07)"
    assert source["url"] == "http://bdlaws.minlaw.gov.bd/act-11.html"
    assert source["text"].startswith("379.")


def test_risk_check_unknown_level_becomes_medium(user, monkeypatch):
    monkeypatch.setattr(webapp, "ask_for_json", lambda _prompt: {"level": "critical"})
    assert user.post("/api/risk/check", {"text": "Some clause"}).get_json()["level"] == "medium"


def test_document_generation(user, monkeypatch):
    monkeypatch.setattr(webapp, "ask_for_text", lambda _prompt: "RENT AGREEMENT\n...")
    response = user.post("/api/documents/generate", {"document_type": "Rent agreement", "fields": {"Tenant": "Karim"}})
    assert response.get_json()["document"].startswith("RENT AGREEMENT")


def test_document_needs_a_type(user):
    assert user.post("/api/documents/generate", {"document_type": "", "fields": {}}).status_code == 400


def test_dashboard_counts_activity(user, chain, monkeypatch):
    monkeypatch.setattr(webapp, "ask_for_text", lambda _prompt: "A document")
    user.post("/api/documents/generate", {"document_type": "Affidavit", "fields": {}})
    response = user.get("/api/dashboard")
    assert response.status_code == 200
    assert response.get_json()["recent"][0]["kind"] == "document"


def test_contact_validation_and_save(api):
    assert api.post("/api/contact", {"name": "Karim", "email": "not-an-email", "message": "Hi"}).status_code == 400
    ok = api.post("/api/contact", {"name": "Karim", "email": "karim@example.test", "message": "Hello"})
    assert ok.status_code == 201


def test_law_updates_are_public(client):
    response = client.get("/api/law-updates")
    assert response.status_code == 200
    assert response.get_json()["updates"] == []
    assert response.get_json()["tracked"] == 0


def test_unknown_api_route_is_json_404(client):
    response = client.get("/api/nothing-here")
    assert response.status_code == 404
    assert response.get_json()["error"] == "Not found."


def test_tools_answer_in_the_chosen_language(user, monkeypatch):
    prompts = []
    monkeypatch.setattr(webapp, "ask_for_text", lambda prompt: prompts.append(prompt) or "দলিল")
    user.post("/api/documents/generate", {"document_type": "Affidavit", "fields": {}, "language": "bn"})
    user.post("/api/documents/generate", {"document_type": "Affidavit", "fields": {}})
    assert "Write the whole document in Bangla." in prompts[0]
    assert "Write the whole document in English." in prompts[1]
