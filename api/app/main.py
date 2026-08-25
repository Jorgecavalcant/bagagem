from __future__ import annotations

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import get_settings
from app.database import init_db
from app.routers import auth, payments, provas


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    yield


settings = get_settings()
os.makedirs(settings.upload_dir, exist_ok=True)

app = FastAPI(
    title="Bagagem API",
    version="0.4.0",
    description="Salto UX 2026-08: login explícito, CRUD de provas, resumo do dia, deep-link. Sem API de companhia.",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/media", StaticFiles(directory=settings.upload_dir), name="media")
app.mount("/api/media", StaticFiles(directory=settings.upload_dir), name="api_media")
app.include_router(auth.router)
app.include_router(provas.router)
app.include_router(payments.router)


@app.get("/health")
def health():
    return {"status": "ok", "produto": "bagagem"}
