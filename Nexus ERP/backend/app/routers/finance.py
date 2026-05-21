from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.schemas.finance import (
    AccountCreate,
    AccountResponse,
    GeneralLedgerResponse,
    GeneralLedgerSummary,
    LedgerItemResponse,
    GeneralLedgerCreate,
)
from app.services.finance_service import (
    list_accounts,
    create_account,
    list_ledger,
    get_summary,
    create_ledger_entry,
)

router = APIRouter()


@router.get("/accounts", response_model=list[AccountResponse])
def get_accounts(db: Session = Depends(get_db)):
    return list_accounts(db)


@router.post("/accounts", response_model=AccountResponse)
def new_account(data: AccountCreate, db: Session = Depends(get_db)):
    account = create_account(db, data.code, data.name, data.account_type)
    return account


@router.get("/ledger", response_model=list[GeneralLedgerResponse])
def get_ledger(db: Session = Depends(get_db)):
    entries = list_ledger(db)
    return [
        GeneralLedgerResponse(
            id=e.id,
            description=e.description,
            transaction_date=e.transaction_date,
            created_at=e.created_at,
            items=[
                LedgerItemResponse(
                    id=i.id,
                    account_id=i.account_id,
                    debit=i.debit,
                    credit=i.credit,
                )
                for i in e.items
            ],
        )
        for e in entries
    ]


@router.post("/ledger", response_model=GeneralLedgerResponse)
def new_ledger_entry(data: GeneralLedgerCreate, db: Session = Depends(get_db)):
    entry = create_ledger_entry(db, data)
    return GeneralLedgerResponse(
        id=entry.id,
        description=entry.description,
        transaction_date=entry.transaction_date,
        created_at=entry.created_at,
        items=[
            LedgerItemResponse(
                id=i.id,
                account_id=i.account_id,
                debit=i.debit,
                credit=i.credit,
            )
            for i in entry.items
        ],
    )


@router.get("/summary", response_model=GeneralLedgerSummary)
def ledger_summary(db: Session = Depends(get_db)):
    data = get_summary(db)
    return GeneralLedgerSummary(**data)