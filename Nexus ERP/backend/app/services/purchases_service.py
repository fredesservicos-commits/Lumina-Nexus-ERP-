import uuid

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.operacional import Document


def register_purchase(db: Session, item_name: str, total: float, company_id: str | None = None) -> Document:
    if total <= 0:
        raise HTTPException(status_code=400, detail="Valor da compra inválido")

    purchase_id = str(uuid.uuid4())
    purchase = Document(
        id=purchase_id,
        company_id=company_id or "00000000-0000-0000-0000-000000000001",
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


def list_purchases(db: Session, company_id: str | None = None) -> list[Document]:
    query = db.query(Document).filter(Document.doc_type == "PURCHASE_INVOICE")
    if company_id:
        query = query.filter(Document.company_id == company_id)
    return query.order_by(Document.created_at.desc()).all()


def search_purchases(db: Session, q: str, company_id: str | None = None) -> list[Document]:
    query = db.query(Document).filter(
        Document.doc_type == "PURCHASE_INVOICE",
        Document.description.ilike(f"%{q}%"),
    )
    if company_id:
        query = query.filter(Document.company_id == company_id)
    return query.order_by(Document.created_at.desc()).all()


def update_purchase(db: Session, purchase_id: str, item_name: str | None = None, total: float | None = None) -> Document:
    purchase = db.query(Document).filter(Document.id == purchase_id, Document.doc_type == "PURCHASE_INVOICE").first()
    if not purchase:
        raise HTTPException(status_code=404, detail="Compra não encontrada")
    if item_name is not None:
        purchase.description = f"Compra - {item_name}"
    if total is not None:
        if total <= 0:
            raise HTTPException(status_code=400, detail="Valor da compra inválido")
        purchase.total_amount = total
    db.commit()
    db.refresh(purchase)
    return purchase


def delete_purchase(db: Session, purchase_id: str) -> None:
    purchase = db.query(Document).filter(Document.id == purchase_id, Document.doc_type == "PURCHASE_INVOICE").first()
    if not purchase:
        raise HTTPException(status_code=404, detail="Compra não encontrada")
    db.delete(purchase)
    db.commit()
