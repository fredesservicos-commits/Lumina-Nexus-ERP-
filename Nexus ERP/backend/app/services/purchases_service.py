import uuid

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.operacional import Document

DEFAULT_COMPANY_ID = "00000000-0000-0000-0000-000000000001"


def register_purchase(db: Session, item_name: str, total: float) -> Document:
    if total <= 0:
        raise HTTPException(status_code=400, detail="Valor da compra inválido")

    purchase_id = str(uuid.uuid4())
    purchase = Document(
        id=purchase_id,
        company_id=DEFAULT_COMPANY_ID,
        partner_id="00000000-0000-0000-0000-000000000000",
        doc_type="PURCHASE_INVOICE",
        status="CONFIRMED",
        total_amount=total,
        description=f"Compra - {item_name}",
    )
    db.add(purchase)
    db.commit()
    db.refresh(purchase)
    return purchase


def list_purchases(db: Session) -> list[Document]:
    return (
        db.query(Document)
        .filter(Document.doc_type == "PURCHASE_INVOICE")
        .order_by(Document.created_at.desc())
        .all()
    )


def search_purchases(db: Session, q: str) -> list[Document]:
    return (
        db.query(Document)
        .filter(Document.doc_type == "PURCHASE_INVOICE")
        .filter(Document.description.ilike(f"%{q}%"))
        .order_by(Document.created_at.desc())
        .all()
    )