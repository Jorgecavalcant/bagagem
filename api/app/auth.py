from __future__ import annotations

import hashlib
import hmac
import time
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import get_settings

_bearer = HTTPBearer(auto_error=False)
TOKEN_TTL_SECONDS = 12 * 3600


def _sign(payload: str) -> str:
    secret = get_settings().demo_token_secret.encode()
    return hmac.new(secret, payload.encode(), hashlib.sha256).hexdigest()


def issue_demo_token(username: str) -> str:
    exp = int(time.time()) + TOKEN_TTL_SECONDS
    payload = f"{username}.{exp}"
    return f"{payload}.{_sign(payload)}"


def verify_demo_token(token: str) -> Optional[str]:
    try:
        username, exp_raw, sig = token.rsplit(".", 2)
        payload = f"{username}.{exp_raw}"
        if not hmac.compare_digest(sig, _sign(payload)):
            return None
        if int(exp_raw) < time.time():
            return None
        return username
    except (ValueError, TypeError):
        return None


def require_operador(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> str:
    if creds is None or creds.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="autenticação necessária",
            headers={"WWW-Authenticate": "Bearer"},
        )
    username = verify_demo_token(creds.credentials)
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="token inválido ou expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return username
