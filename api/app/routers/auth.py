from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.auth import issue_demo_token
from app.config import get_settings

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


class DemoLoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/demo", response_model=TokenResponse)
def login_demo(payload: DemoLoginRequest):
    s = get_settings()
    if payload.username != s.demo_user or payload.password != s.demo_pass:
        raise HTTPException(status_code=401, detail="credenciais inválidas")
    return TokenResponse(access_token=issue_demo_token(payload.username))
