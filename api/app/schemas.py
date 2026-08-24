from __future__ import annotations
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, HttpUrl

class ProvaCreate(BaseModel):
    codigo: str = Field(min_length=3, max_length=80, description="Bilhete ou etiqueta")
    foto_url: str = Field(min_length=5)  # URL ou path; upload real = fase 2
    notas: Optional[str] = None

class ProvaOut(BaseModel):
    id: int
    codigo: str
    foto_url: str
    notas: Optional[str]
    created_at: datetime
    model_config = {"from_attributes": True}
