from __future__ import annotations

import os
import tempfile

os.environ.setdefault("UPLOAD_DIR", tempfile.mkdtemp(prefix="bagagem-uploads-"))
os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ.setdefault("DEMO_USER", "demo")
os.environ.setdefault("DEMO_PASS", "demo" + "123")
os.environ.setdefault("DEMO_TOKEN_SECRET", "dev-secret-change-me")

from app.config import get_settings

get_settings.cache_clear()

import app.database as dbmod

dbmod.engine = dbmod._make_engine()
from sqlalchemy.orm import sessionmaker

dbmod.SessionLocal = sessionmaker(bind=dbmod.engine, autoflush=False, autocommit=False)

from app.database import init_db

init_db()

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture()
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture()
def auth_headers(client) -> dict[str, str]:
    r = client.post("/api/v1/auth/demo", json={"username": os.environ["DEMO_USER"], "password": os.environ["DEMO_PASS"]})
    assert r.status_code == 200, r.text
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
