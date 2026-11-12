from langchain_ollama import OllamaLLM

from src.helper import get_llm


def test_ollama_is_the_default(monkeypatch):
    monkeypatch.delenv("LLM_PROVIDER", raising=False)
    assert isinstance(get_llm(), OllamaLLM)


def test_hosted_provider_is_chosen_by_env(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "openai")
    monkeypatch.setenv("LLM_API_KEY", "test-key")
    monkeypatch.setenv("LLM_MODEL", "some-model")
    llm = get_llm(json_mode=True)
    assert not isinstance(llm, OllamaLLM)
    chat = llm.first
    assert chat.model_name == "some-model"
    assert chat.model_kwargs == {"response_format": {"type": "json_object"}}
