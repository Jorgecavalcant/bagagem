from __future__ import annotations

import base64

PNG_B64 = base64.b64encode(b"\x89PNG\r\n\x1a\n" + b"0" * 32).decode()


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["produto"] == "bagagem"


def test_prova_base64_salva(client):
    r = client.post(
        "/api/v1/provas",
        json={
            "codigo": " abc123 ",
            "foto_base64": f"data:image/png;base64,{PNG_B64}",
            "notas": "etiqueta colada",
            "tipo_vinculo": "etiqueta",
        },
    )
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["codigo"] == "ABC123"
    assert body["status"] == "registrada"
    assert body["tipo_vinculo"] == "etiqueta"
    assert body["foto_url"].startswith("/media/")
    assert body["foto_storage"]

    r2 = client.get("/api/v1/provas/por-codigo/ABC123")
    assert r2.status_code == 200
    assert r2.json()["id"] == body["id"]


def test_prova_sem_foto_rejeitada(client):
    r = client.post("/api/v1/provas", json={"codigo": "X1"})
    assert r.status_code == 422


def test_filtro_codigo_status(client):
    for i, st in enumerate(["conferida", "recusada"]):
        r = client.post(
            "/api/v1/provas",
            json={"codigo": f"FILTRO{i}", "foto_url": "https://x/f.png"},
        )
        pid = r.json()["id"]
        client.patch(f"/api/v1/provas/{pid}/status", json={"status": st})

    r = client.get("/api/v1/provas", params={"codigo": "FILTRO0"})
    assert len(r.json()) == 1
    r = client.get("/api/v1/provas", params={"status": "conferida"})
    assert len(r.json()) == 1
    assert r.json()[0]["codigo"] == "FILTRO0"


def test_patch_status(client):
    r = client.post("/api/v1/provas", json={"codigo": "PATCH1", "foto_url": "https://x/p.png"})
    pid = r.json()["id"]
    r = client.patch(f"/api/v1/provas/{pid}/status", json={"status": "recusada"})
    assert r.status_code == 200
    assert r.json()["status"] == "recusada"
    r = client.patch(f"/api/v1/provas/{pid}/status", json={"status": "invalida"})
    assert r.status_code == 422


def test_payments_manual(client):
    r = client.get("/api/v1/payments/providers")
    assert r.status_code == 200
    assert "manual" in r.json()["providers"]

    r = client.post(
        "/api/v1/payments/charge",
        json={
            "provider": "manual",
            "amount": 19.9,
            "description": "taxa registro",
            "reference": "ABC123",
        },
    )
    assert r.status_code == 200
    body = r.json()
    assert body["provider"] == "manual"
    assert body["amount"] == 19.9
    assert "manual" in body["instructions"] or "transferência" in body["instructions"]
