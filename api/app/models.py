from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer, String, Text

from app.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Prova(Base):
    __tablename__ = "provas"

    id = Column(Integer, primary_key=True)
    codigo = Column(String(64), nullable=False, index=True)
    foto_url = Column(String(512), nullable=True)
    notas = Column(Text, nullable=True)
    tipo_vinculo = Column(String(16), nullable=False, default="bilhete")  # bilhete|etiqueta
    status = Column(String(16), nullable=False, default="registrada")  # registrada|conferida|recusada
    foto_storage = Column(String(512), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=_utcnow)
