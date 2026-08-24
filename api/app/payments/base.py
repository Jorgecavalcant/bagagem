from abc import ABC, abstractmethod
from typing import Optional


class PaymentProvider(ABC):
    name: str

    @abstractmethod
    def charge(self, amount: float, description: Optional[str], reference: Optional[str]) -> dict:
        ...
