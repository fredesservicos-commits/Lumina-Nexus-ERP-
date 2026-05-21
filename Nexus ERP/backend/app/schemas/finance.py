from datetime import datetime

from pydantic import BaseModel


class LedgerItemResponse(BaseModel):
    id: str
    account_id: int
    debit: float
    credit: float

    model_config = {"from_attributes": True}


class GeneralLedgerResponse(BaseModel):
    id: str
    description: str | None
    transaction_date: datetime
    created_at: datetime
    items: list[LedgerItemResponse]

    model_config = {"from_attributes": True}


class AccountResponse(BaseModel):
    id: int
    code: str
    name: str
    account_type: str

    model_config = {"from_attributes": True}


class AccountCreate(BaseModel):
    code: str
    name: str
    account_type: str


class GeneralLedgerSummary(BaseModel):
    total_debits: float
    total_credits: float
    balance: float
    entry_count: int


class LedgerItemCreate(BaseModel):
    account_id: int
    debit: float
    credit: float


class GeneralLedgerCreate(BaseModel):
    description: str | None = None
    transaction_date: datetime | None = None
    items: list[LedgerItemCreate]