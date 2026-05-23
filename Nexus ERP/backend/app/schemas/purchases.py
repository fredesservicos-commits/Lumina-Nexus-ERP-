from datetime import datetime

from pydantic import BaseModel


class PurchaseCreate(BaseModel):
    item_name: str
    total: float


class PurchaseUpdate(BaseModel):
    item_name: str | None = None
    total: float | None = None


class PurchaseResponse(BaseModel):
    id: str
    item_name: str
    total: float
    created_at: datetime

    model_config = {"from_attributes": True}
