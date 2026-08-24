from typing import Optional

from app.payments.base import PaymentProvider


class ManualProvider(PaymentProvider):
    name = "manual"

    def charge(self, amount: float, description: Optional[str] = None, reference: Optional[str] = None) -> dict:
        return {
            "provider": self.name,
            "amount": amount,
            "description": description,
            "reference": reference,
            "instructions": (
                "Pagamento manual: realize a transferência/PIX informando a referência "
                f"{reference or 'sem-referencia'} no valor de R$ {amount:.2f} e envie o comprovante."
            ),
        }


PROVIDERS: dict[str, PaymentProvider] = {p.name: p for p in [ManualProvider()]}
