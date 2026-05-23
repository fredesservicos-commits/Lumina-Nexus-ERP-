from datetime import datetime

from pydantic import BaseModel


class SaleCreate(BaseModel):
    customer: str
    total: float


class SaleUpdate(BaseModel):
    customer: str | None = None
    total: float | None = None


class SaleResponse(BaseModel):
    id: str
    customer: str
    total: float
    created_at: datetime

    model_config = {"from_attributes": True}


class SaleSearchResult(BaseModel):
    id: str
    customer: str
    total: float
    created_at: datetime

    model_config = {"from_attributes": True}
