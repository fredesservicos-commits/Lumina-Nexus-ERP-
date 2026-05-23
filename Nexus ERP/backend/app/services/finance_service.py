from datetime import datetime, UTC
from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.financeiro import ChartOfAccounts, GeneralLedger, LedgerItem
from app.schemas.finance import GeneralLedgerCreate

DEFAULT_COMPANY_ID = "00000000-0000-0000-0000-000000000001"


def list_accounts(db: Session) -> list[ChartOfAccounts]:
    return db.query(ChartOfAccounts).order_by(ChartOfAccounts.code).all()


def create_account(db: Session, code: str, name: str, account_type: str) -> ChartOfAccounts:
    exists = db.query(ChartOfAccounts).filter(ChartOfAccounts.code == code).first()
    if exists:
        raise HTTPException(status_code=400, detail="Código de conta já existe")
    account = ChartOfAccounts(
        company_id=DEFAULT_COMPANY_ID,
        code=code,
        name=name,
        account_type=account_type,
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    return account


def list_ledger(db: Session) -> list[GeneralLedger]:
    return (
        db.query(GeneralLedger)
        .order_by(GeneralLedger.transaction_date.desc())
        .all()
    )


def create_ledger_entry(db: Session, data: GeneralLedgerCreate) -> GeneralLedger:
    if len(data.items) < 2:
        raise HTTPException(
            status_code=400,
            detail="Um lançamento contábil precisa de pelo menos 2 itens (débito e crédito)",
        )

    total_debit = sum(item.debit for item in data.items)
    total_credit = sum(item.credit for item in data.items)

    if round(total_debit, 2) != round(total_credit, 2):
        raise HTTPException(
            status_code=400,
            detail=f"Lançamento desbalanceado. Total Débitos: {total_debit}, Total Créditos: {total_credit}",
        )

    if round(total_debit, 2) <= 0:
        raise HTTPException(
            status_code=400, detail="O valor total do lançamento deve ser maior que zero"
        )

    # Validar se todas as contas existem
    account_ids = [item.account_id for item in data.items]
    existing_accounts = (
        db.query(ChartOfAccounts.id)
        .filter(ChartOfAccounts.id.in_(account_ids))
        .all()
    )
    existing_account_ids = {acc[0] for acc in existing_accounts}

    for item in data.items:
        if item.account_id not in existing_account_ids:
            raise HTTPException(
                status_code=400,
                detail=f"Conta com ID {item.account_id} não existe no Plano de Contas",
            )

    # Criar GeneralLedger
    ledger = GeneralLedger(
        company_id=DEFAULT_COMPANY_ID,
        description=data.description,
        transaction_date=data.transaction_date or datetime.now(UTC),
    )
    db.add(ledger)
    db.flush()

    # Criar LedgerItems
    for item in data.items:
        ledger_item = LedgerItem(
            ledger_id=ledger.id,
            account_id=item.account_id,
            debit=item.debit,
            credit=item.credit,
        )
        db.add(ledger_item)

    db.commit()
    db.refresh(ledger)
    return ledger


def update_account(db: Session, account_id: int, name: str | None = None, account_type: str | None = None) -> ChartOfAccounts:
    account = db.query(ChartOfAccounts).filter(ChartOfAccounts.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Conta não encontrada")
    if name is not None:
        account.name = name
    if account_type is not None:
        account.account_type = account_type
    db.commit()
    db.refresh(account)
    return account


def delete_account(db: Session, account_id: int) -> None:
    account = db.query(ChartOfAccounts).filter(ChartOfAccounts.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Conta não encontrada")
    db.delete(account)
    db.commit()


def get_summary(db: Session) -> dict:
    debits = db.query(func.coalesce(func.sum(LedgerItem.debit), 0)).scalar() or 0
    credits = db.query(func.coalesce(func.sum(LedgerItem.credit), 0)).scalar() or 0
    count = db.query(func.count(GeneralLedger.id)).scalar() or 0
    return {
        "total_debits": round(debits, 2),
        "total_credits": round(credits, 2),
        "balance": round(debits - credits, 2),
        "entry_count": count,
    }