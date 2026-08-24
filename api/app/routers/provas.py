from __future__ import annotations

import os
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models import Prova
from app.schemas import ProvaCreate, ProvaOut, StatusUpdate
from app.storage import save_base64_image

router = APIRouter(prefix="/api/v1/provas", tags=["provas"])

ALLOWED_STATUS = {"registrada", "conferida", "recusada"}


@router.post("", response_model=ProvaOut, status_code=201)
def criar_prova(payload: ProvaCreate, db: Session = Depends(get_db)):
    foto_url = payload.foto_url
    foto_storage = None
    if payload.foto_base64:
        try:
            foto_url, foto_storage = save_base64_image(payload.foto_base64)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    prova = Prova(
        codigo=payload.codigo.strip().upper(),
        foto_url=foto_url,
        notas=payload.notas,
        tipo_vinculo=payload.tipo_vinculo,
        foto_storage=foto_storage,
    )
    db.add(prova)
    db.commit()
    db.refresh(prova)
    return prova


@router.post("/upload", response_model=ProvaOut, status_code=201)
async def upload_prova(
    codigo: str = Form(...),
    tipo_vinculo: str = Form("bilhete"),
    notas: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="arquivo deve ser image/*")
    if tipo_vinculo not in ("bilhete", "etiqueta"):
        raise HTTPException(status_code=400, detail="tipo_vinculo inválido")

    settings = get_settings()
    os.makedirs(settings.upload_dir, exist_ok=True)
    ext = (os.path.splitext(file.filename or "")[1] or ".bin").lower()
    filename = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(settings.upload_dir, filename)
    content = await file.read()
    with open(path, "wb") as f:
        f.write(content)

    prova = Prova(
        codigo=codigo.strip().upper(),
        foto_url=f"/api/media/{filename}",
        notas=notas,
        tipo_vinculo=tipo_vinculo,
        foto_storage=filename,
    )
    db.add(prova)
    db.commit()
    db.refresh(prova)
    return prova


@router.get("", response_model=List[ProvaOut])
def listar_provas(
    codigo: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Prova)
    if codigo:
        q = q.filter(Prova.codigo == codigo.strip().upper())
    if status:
        if status not in ALLOWED_STATUS:
            raise HTTPException(status_code=400, detail="status inválido")
        q = q.filter(Prova.status == status)
    return q.order_by(Prova.created_at.desc()).all()


@router.get("/por-codigo/{codigo}", response_model=ProvaOut)
def por_codigo(codigo: str, db: Session = Depends(get_db)):
    prova = (
        db.query(Prova)
        .filter(Prova.codigo == codigo.strip().upper())
        .order_by(Prova.created_at.desc())
        .first()
    )
    if not prova:
        raise HTTPException(status_code=404, detail="prova não encontrada")
    return prova


@router.get("/{prova_id}", response_model=ProvaOut)
def obter_prova(prova_id: int, db: Session = Depends(get_db)):
    prova = db.get(Prova, prova_id)
    if not prova:
        raise HTTPException(status_code=404, detail="prova não encontrada")
    return prova


@router.patch("/{prova_id}/status", response_model=ProvaOut)
def atualizar_status(prova_id: int, payload: StatusUpdate, db: Session = Depends(get_db)):
    prova = db.get(Prova, prova_id)
    if not prova:
        raise HTTPException(status_code=404, detail="prova não encontrada")
    prova.status = payload.status
    db.commit()
    db.refresh(prova)
    return prova
