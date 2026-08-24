from __future__ import annotations

import os
import tempfile

os.environ.setdefault("UPLOAD_DIR", tempfile.mkdtemp(prefix="bagagem-uploads-"))
os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"

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
