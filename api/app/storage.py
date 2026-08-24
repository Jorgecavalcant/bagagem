from __future__ import annotations

import base64
import binascii
import os
import re
import uuid
from typing import Tuple

from app.config import get_settings

_EXT_RE = re.compile(r"^data:image/(png|jpe?g|webp);base64,(.*)$", re.DOTALL)


def save_base64_image(data_b64: str) -> Tuple[str, str]:
    """Salva imagem base64 em upload_dir. Retorna (foto_url, foto_storage)."""
    m = _EXT_RE.match(data_b64.strip())
    ext = m.group(1).replace("jpeg", "jpg") if m else "png"
    payload = m.group(2) if m else data_b64.strip()
    try:
        raw = base64.b64decode(payload)
    except (binascii.Error, ValueError) as e:
        raise ValueError("base64 inválido") from e

    settings = get_settings()
    os.makedirs(settings.upload_dir, exist_ok=True)
    filename = f"{uuid.uuid4().hex}.{ext}"
    path = os.path.join(settings.upload_dir, filename)
    with open(path, "wb") as f:
        f.write(raw)
    # Público via /api/media (Caddy já faz proxy de /api*); /media também montado na API
    return f"/api/media/{filename}", filename
