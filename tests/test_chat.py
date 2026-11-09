def test_chat_needs_sign_in(api, chain):
    assert api.post("/api/chat", {"message": "What is theft?"}).status_code == 401


def test_empty_message(user, chain):
    assert user.post("/api/chat", {"message": "  "}).status_code == 400


def test_chat_answers_with_official_citation(user, chain):
    response = user.post("/api/chat", {"message": "What is the punishment for theft?"})
    assert response.status_code == 200
    data = response.get_json()
    assert "legal information, not legal advice" in data["answer"]
    assert data["citations"] == [
        "The Penal Code, 1860 - Punishment for theft (official, updated 2026-11-07)"
    ]

    history = user.get(f"/api/conversations/{data['conversation_id']}").get_json()
    assert [m["role"] for m in history] == ["user", "assistant"]


def test_english_question_is_searched_as_is(user, chain):
    user.post("/api/chat", {"message": "What is theft?"})
    assert chain.calls[0]["input"] == "What is theft?"
    assert chain.calls[0]["language"] == "English"
    assert chain.calls[0]["history"] == []


def test_bangla_question_gets_english_search_text_and_bangla_reply(user, chain):
    user.post("/api/chat", {"message": "চুরির শাস্তি কী?"})
    call = chain.calls[0]
    assert call["language"] == "Bangla"
    assert call["input"] == "চুরির শাস্তি কী?\n(English: What is the punishment for theft?)"


def test_follow_up_sends_earlier_turns(user, chain):
    first = user.post("/api/chat", {"message": "What is theft?"}).get_json()
    user.post("/api/chat", {"message": "What is its punishment?", "conversation_id": first["conversation_id"]})

    follow_up = chain.calls[1]
    assert [role for role, _ in follow_up["history"]] == ["human", "ai"]
    assert follow_up["history"][0][1] == "What is theft?"
    # A follow-up is rewritten into a standalone search question.
    assert "(English: What is the punishment for theft?)" in follow_up["input"]


def test_new_conversation_starts_without_history(user, chain):
    user.post("/api/chat", {"message": "What is theft?"})
    user.post("/api/chat", {"message": "What is dowry?"})
    assert chain.calls[1]["history"] == []


def test_cannot_use_someone_elses_conversation(api, client, chain):
    api.sign_up("owner")
    conversation_id = api.post("/api/chat", {"message": "What is theft?"}).get_json()["conversation_id"]
    api.post("/api/logout")
    api.sign_up("other")
    response = api.post("/api/chat", {"message": "Hi", "conversation_id": conversation_id})
    assert response.status_code == 404


def test_failed_answer_leaves_no_empty_conversation(user, chain):
    chain.fail = True
    assert user.post("/api/chat", {"message": "What is theft?"}).status_code == 503
    assert user.get("/api/conversations").get_json() == []
