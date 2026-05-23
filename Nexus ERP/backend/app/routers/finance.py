from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.models.user import User
from app.models.financeiro import ChartOfAccounts
from app.schemas.finance import (
    AccountCreate,
    AccountResponse,
    AccountUpdate,
    GeneralLedgerResponse,
    GeneralLedgerSummary,
    LedgerItemResponse,
    GeneralLedgerCreate,
)
from app.services.finance_service import (
    list_accounts,
    create_account,
    update_account,
    delete_account,
    list_ledger,
    get_summary,
    create_ledger_entry,
)
from app.services.auth_dependencies import get_current_user, require_role

router = APIRouter()


@router.get("/accounts", response_model=list[AccountResponse])
def get_accounts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return list_accounts(db)


@router.post("/accounts", response_model=AccountResponse)
def new_account(data: AccountCreate, db: Session = Depends(get_db), current_user: User = Depends(require_role("admin", "gerente"))):
    account = create_account(db, data.code, data.name, data.account_type)
    return account


@router.put("/accounts/{account_id}", response_model=AccountResponse)
def edit_account(account_id: int, data: AccountUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_role("admin", "gerente"))):
    return update_account(db, account_id, data.name, data.account_type)


@router.delete("/accounts/{account_id}", status_code=204)
def remove_account(account_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_role("admin"))):
    delete_account(db, account_id)


@router.get("/ledger", response_model=list[GeneralLedgerResponse])
def get_ledger(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
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
def new_ledger_entry(data: GeneralLedgerCreate, db: Session = Depends(get_db), current_user: User = Depends(require_role("admin", "gerente"))):
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
def ledger_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = get_summary(db)
    return GeneralLedgerSummary(**data)
