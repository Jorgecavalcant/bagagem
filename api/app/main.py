from __future__ import annotations
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import init_db
from app.routers import health, provas

@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    yield

app = FastAPI(title="Bagagem API", version="0.1.0", description="MVP sem API de companhia", lifespan=lifespan)
s = get_settings()
app.add_middleware(CORSMiddleware, allow_origins=s.cors_list or ["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(health.router)
app.include_router(provas.router)
