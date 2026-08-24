from __future__ import annotations
from datetime import datetime
from typing import Optional
from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base

class Prova(Base):
    __tablename__ = "provas"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    codigo: Mapped[str] = mapped_column(String(80), index=True)  # bilhete ou etiqueta
    foto_url: Mapped[str] = mapped_column(String(500))
    notas: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
