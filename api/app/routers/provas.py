from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Prova
from app.schemas import ProvaCreate, ProvaOut

router = APIRouter(prefix="/api/v1/provas", tags=["provas"])

@router.get("", response_model=list[ProvaOut])
def list_provas(db: Session = Depends(get_db)):
    return db.query(Prova).order_by(Prova.id.desc()).all()

@router.post("", response_model=ProvaOut, status_code=201)
def create_prova(body: ProvaCreate, db: Session = Depends(get_db)):
    row = Prova(codigo=body.codigo.strip().upper(), foto_url=body.foto_url, notas=body.notas)
    db.add(row); db.commit(); db.refresh(row)
    return row

@router.get("/por-codigo/{codigo}", response_model=list[ProvaOut])
def by_codigo(codigo: str, db: Session = Depends(get_db)):
    return db.query(Prova).filter(Prova.codigo == codigo.strip().upper()).all()

@router.get("/{prova_id}", response_model=ProvaOut)
def get_prova(prova_id: int, db: Session = Depends(get_db)):
    row = db.get(Prova, prova_id)
    if not row: raise HTTPException(404, "Prova não encontrada.")
    return row
