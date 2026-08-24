from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, model_validator


class ProvaCreate(BaseModel):
    codigo: str
    foto_url: Optional[str] = None
    notas: Optional[str] = None
    tipo_vinculo: Literal["bilhete", "etiqueta"] = "bilhete"
    foto_base64: Optional[str] = None

    @model_validator(mode="after")
    def precisa_foto(self):
        if not (self.foto_url or self.foto_base64):
            raise ValueError("informe foto_url ou foto_base64")
        return self


class ProvaOut(BaseModel):
    id: int
    codigo: str
    foto_url: Optional[str]
    notas: Optional[str]
    tipo_vinculo: str
    status: str
    foto_storage: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class StatusUpdate(BaseModel):
    status: Literal["registrada", "conferida", "recusada"]


class ChargeRequest(BaseModel):
    provider: str = "manual"
    amount: float
    description: Optional[str] = None
    reference: Optional[str] = None


class ChargeResponse(BaseModel):
    provider: str
    amount: float
    description: Optional[str]
    reference: Optional[str]
    instructions: str
