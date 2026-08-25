from __future__ import annotations

import base64

PNG_B64 = base64.b64encode(b"\x89PNG\r\n\x1a\n" + b"0" * 32).decode()


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["produto"] == "bagagem"


def test_demo_login(client):
    import os
    user = os.environ["DEMO_USER"]
    password = os.environ["DEMO_PASS"]
    r = client.post("/api/v1/auth/demo", json={"username": user, "password": password})
    assert r.status_code == 200
    assert r.json()["token_type"] == "bearer"
    assert r.json()["access_token"]

    r = client.post("/api/v1/auth/demo", json={"username": user, "password": "errado"})
    assert r.status_code == 401


def test_mutacao_sem_auth_rejeitada(client):
    r = client.post("/api/v1/provas", json={"codigo": "NOAUTH1", "foto_url": "https://x/n.png"})
    assert r.status_code == 401
    r = client.patch("/api/v1/provas/1/status", json={"status": "conferida"})
    assert r.status_code == 401
    r = client.post(
        "/api/v1/payments/charge",
        json={"provider": "manual", "amount": 10, "description": "x", "reference": "y"},
    )
    assert r.status_code == 401


def test_leitura_aberta_sem_auth(client):
    r = client.get("/api/v1/provas")
    assert r.status_code == 200
    r = client.get("/api/v1/payments/providers")
    assert r.status_code == 200


def test_prova_base64_salva(client, auth_headers):
    r = client.post(
        "/api/v1/provas",
        headers=auth_headers,
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
    assert body["foto_url"].startswith("/media/") or body["foto_url"].startswith("/api/media/")
    assert body["foto_storage"]

    r2 = client.get("/api/v1/provas/por-codigo/ABC123")
    assert r2.status_code == 200
    assert r2.json()["id"] == body["id"]


def test_prova_sem_foto_rejeitada(client, auth_headers):
    r = client.post(
        "/api/v1/provas",
        headers=auth_headers,
        json={"codigo": "X1"},
    )
    assert r.status_code == 422


def test_filtro_codigo_status(client, auth_headers):
    for i, st in enumerate(["conferida", "recusada"]):
        r = client.post(
            "/api/v1/provas",
            headers=auth_headers,
            json={"codigo": f"FILTRO{i}", "foto_url": "https://x/f.png"},
        )
        pid = r.json()["id"]
        client.patch(f"/api/v1/provas/{pid}/status", headers=auth_headers, json={"status": st})

    r = client.get("/api/v1/provas", params={"codigo": "FILTRO0"})
    assert len(r.json()) == 1
    r = client.get("/api/v1/provas", params={"status": "conferida"})
    assert len(r.json()) == 1
    assert r.json()[0]["codigo"] == "FILTRO0"


def test_patch_status(client, auth_headers):
    r = client.post(
        "/api/v1/provas",
        headers=auth_headers,
        json={"codigo": "PATCH1", "foto_url": "https://x/p.png"},
    )
    pid = r.json()["id"]
    r = client.patch(f"/api/v1/provas/{pid}/status", headers=auth_headers, json={"status": "recusada"})
    assert r.status_code == 200
    assert r.json()["status"] == "recusada"
    r = client.patch(f"/api/v1/provas/{pid}/status", headers=auth_headers, json={"status": "invalida"})
    assert r.status_code == 422


def test_payments_manual(client, auth_headers):
    r = client.get("/api/v1/payments/providers")
    assert r.status_code == 200
    assert "manual" in r.json()["providers"]

    r = client.post(
        "/api/v1/payments/charge",
        headers=auth_headers,
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


def test_patch_prova_campos(client, auth_headers):
    r = client.post(
        "/api/v1/provas",
        headers=auth_headers,
        json={"codigo": "OLD123", "foto_url": "https://x/o.png", "notas": "a"},
    )
    assert r.status_code == 201
    pid = r.json()["id"]

    r = client.patch(
        f"/api/v1/provas/{pid}",
        headers=auth_headers,
        json={"codigo": "new456", "tipo_vinculo": "etiqueta", "notas": "caixa"},
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["codigo"] == "NEW456"
    assert body["tipo_vinculo"] == "etiqueta"
    assert body["notas"] == "caixa"
    assert body["status"] == "registrada"

    r = client.patch(f"/api/v1/provas/{pid}", json={"codigo": "X"})
    assert r.status_code == 401


def test_delete_prova(client, auth_headers):
    r = client.post(
        "/api/v1/provas",
        headers=auth_headers,
        json={
            "codigo": "DEL1",
            "foto_base64": f"data:image/png;base64,{PNG_B64}",
        },
    )
    assert r.status_code == 201
    pid = r.json()["id"]
    storage = r.json()["foto_storage"]
    assert storage

    import os
    from app.config import get_settings

    path = os.path.join(get_settings().upload_dir, storage)
    assert os.path.isfile(path)

    r = client.delete(f"/api/v1/provas/{pid}")
    assert r.status_code == 401

    r = client.delete(f"/api/v1/provas/{pid}", headers=auth_headers)
    assert r.status_code == 204
    assert not os.path.isfile(path)

    r = client.get(f"/api/v1/provas/{pid}")
    assert r.status_code == 404


def test_resumo_dia(client, auth_headers):
    r = client.post(
        "/api/v1/provas",
        headers=auth_headers,
        json={"codigo": "RES1", "foto_url": "https://x/r.png"},
    )
    pid = r.json()["id"]
    client.patch(
        f"/api/v1/provas/{pid}/status",
        headers=auth_headers,
        json={"status": "conferida"},
    )
    client.post(
        "/api/v1/provas",
        headers=auth_headers,
        json={"codigo": "RES2", "foto_url": "https://x/r2.png"},
    )

    r = client.get("/api/v1/provas/resumo")
    assert r.status_code == 200
    body = r.json()
    assert body["timezone"] == "America/Sao_Paulo"
    assert "dia" in body
    assert body["total"] >= 2
    assert body["conferidas"] >= 1
    assert body["registradas"] >= 1
    assert body["recusadas"] >= 0
