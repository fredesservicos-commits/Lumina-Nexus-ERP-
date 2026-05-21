import uuid

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.operacional import Document
from app.models.financeiro import GeneralLedger

DEFAULT_COMPANY_ID = "00000000-0000-0000-0000-000000000001"


def register_sale(db: Session, customer: str, total: float) -> Document:
    if total <= 0:
        raise HTTPException(status_code=400, detail="Valor da venda inválido")

    sale_id = str(uuid.uuid4())
    sale = Document(
        id=sale_id,
        company_id=DEFAULT_COMPANY_ID,
        partner_id="00000000-0000-0000-0000-000000000000",
        doc_type="SALES_ORDER",
        status="CONFIRMED",
        total_amount=total,
        description=f"Venda - {customer}",
    )
    db.add(sale)

    ledger = GeneralLedger(
        company_id=DEFAULT_COMPANY_ID,
        description=f"Lançamento automático venda {sale_id[:8]}",
        reference_doc_id=sale_id,
    )
    db.add(ledger)
    db.commit()
    db.refresh(sale)
    return sale


def list_sales(db: Session) -> list[Document]:
    return (
        db.query(Document)
        .filter(Document.doc_type == "SALES_ORDER")
        .order_by(Document.created_at.desc())
        .all()
    )


def search_sales(db: Session, q: str) -> list[Document]:
    return (
        db.query(Document)
        .filter(Document.doc_type == "SALES_ORDER")
        .filter(Document.description.ilike(f"%{q}%"))
        .order_by(Document.created_at.desc())
        .all()
    )