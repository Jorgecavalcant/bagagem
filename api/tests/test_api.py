from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    assert client.get("/health").json()["produto"] == "bagagem"


def test_prova():
    r = client.post(
        "/api/v1/provas",
        json={"codigo": "TKT-123", "foto_url": "https://example.com/foto.jpg", "notas": "mala azul"},
    )
    assert r.status_code == 201
    assert client.get("/api/v1/provas/por-codigo/TKT-123").json()[0]["codigo"] == "TKT-123"
