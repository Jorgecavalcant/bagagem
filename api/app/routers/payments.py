from fastapi import APIRouter, HTTPException

from app.payments.manual import PROVIDERS
from app.schemas import ChargeRequest, ChargeResponse

router = APIRouter(prefix="/api/v1/payments", tags=["payments"])


@router.get("/providers")
def listar_providers():
    return {"providers": list(PROVIDERS.keys())}


@router.post("/charge", response_model=ChargeResponse)
def criar_charge(payload: ChargeRequest):
    provider = PROVIDERS.get(payload.provider)
    if not provider:
        raise HTTPException(status_code=400, detail="provider desconhecido")
    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail="amount deve ser positivo")
    return provider.charge(payload.amount, payload.description, payload.reference)
