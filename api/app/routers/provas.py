from __future__ import annotations

import os
import uuid
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Response, UploadFile
from sqlalchemy.orm import Session

from app.auth import require_operador
from app.config import get_settings
from app.database import get_db
from app.models import Prova
from app.schemas import ProvaCreate, ProvaOut, ProvaUpdate, ResumoDiaOut, StatusUpdate
from app.storage import save_base64_image

router = APIRouter(prefix="/api/v1/provas", tags=["provas"])

ALLOWED_STATUS = {"registrada", "conferida", "recusada"}
TZ_SP = ZoneInfo("America/Sao_Paulo")


@router.post("", response_model=ProvaOut, status_code=201)
def criar_prova(
    payload: ProvaCreate,
    db: Session = Depends(get_db),
    _user: str = Depends(require_operador),
):
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
    _user: str = Depends(require_operador),
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
        foto_url=f"/media/{filename}",
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


@router.get("/resumo", response_model=ResumoDiaOut)
def resumo_dia(db: Session = Depends(get_db)):
    agora_sp = datetime.now(TZ_SP)
    dia_str = agora_sp.date().isoformat()
    inicio_sp = datetime(agora_sp.year, agora_sp.month, agora_sp.day, tzinfo=TZ_SP)
    fim_sp = inicio_sp + timedelta(days=1)
    inicio_utc = inicio_sp.astimezone(timezone.utc)
    fim_utc = fim_sp.astimezone(timezone.utc)

    provas = (
        db.query(Prova)
        .filter(Prova.created_at >= inicio_utc, Prova.created_at < fim_utc)
        .all()
    )
    registradas = sum(1 for p in provas if p.status == "registrada")
    conferidas = sum(1 for p in provas if p.status == "conferida")
    recusadas = sum(1 for p in provas if p.status == "recusada")
    return ResumoDiaOut(
        dia=dia_str,
        timezone="America/Sao_Paulo",
        registradas=registradas,
        conferidas=conferidas,
        recusadas=recusadas,
        total=len(provas),
    )


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


@router.patch("/{prova_id}", response_model=ProvaOut)
def atualizar_prova(
    prova_id: int,
    payload: ProvaUpdate,
    db: Session = Depends(get_db),
    _user: str = Depends(require_operador),
):
    prova = db.get(Prova, prova_id)
    if not prova:
        raise HTTPException(status_code=404, detail="prova não encontrada")
    data = payload.model_dump(exclude_unset=True)
    if "codigo" in data:
        codigo = (data["codigo"] or "").strip()
        if not codigo:
            raise HTTPException(status_code=422, detail="codigo não pode ficar vazio")
        prova.codigo = codigo.upper()
    if "tipo_vinculo" in data and data["tipo_vinculo"] is not None:
        prova.tipo_vinculo = data["tipo_vinculo"]
    if "notas" in data:
        prova.notas = data["notas"]
    db.commit()
    db.refresh(prova)
    return prova


@router.patch("/{prova_id}/status", response_model=ProvaOut)
def atualizar_status(
    prova_id: int,
    payload: StatusUpdate,
    db: Session = Depends(get_db),
    _user: str = Depends(require_operador),
):
    prova = db.get(Prova, prova_id)
    if not prova:
        raise HTTPException(status_code=404, detail="prova não encontrada")
    prova.status = payload.status
    db.commit()
    db.refresh(prova)
    return prova


@router.delete("/{prova_id}", status_code=204)
def excluir_prova(
    prova_id: int,
    db: Session = Depends(get_db),
    _user: str = Depends(require_operador),
):
    prova = db.get(Prova, prova_id)
    if not prova:
        raise HTTPException(status_code=404, detail="prova não encontrada")
    settings = get_settings()
    if prova.foto_storage:
        path = os.path.join(settings.upload_dir, prova.foto_storage)
        try:
            os.remove(path)
        except FileNotFoundError:
            pass
    db.delete(prova)
    db.commit()
    return Response(status_code=204)
