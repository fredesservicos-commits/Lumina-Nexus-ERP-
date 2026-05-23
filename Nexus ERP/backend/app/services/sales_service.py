import uuid

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.operacional import Document
from app.models.financeiro import GeneralLedger


def register_sale(db: Session, customer: str, total: float, company_id: str | None = None) -> Document:
    if total <= 0:
        raise HTTPException(status_code=400, detail="Valor da venda inválido")

    sale_id = str(uuid.uuid4())
    sale = Document(
        id=sale_id,
        company_id=company_id or "00000000-0000-0000-0000-000000000001",
        partner_id="00000000-0000-0000-0000-000000000000",
        doc_type="SALES_ORDER",
        status="CONFIRMED",
        total_amount=total,
        description=f"Venda - {customer}",
    )
    db.add(sale)

    ledger = GeneralLedger(
        company_id=company_id or "00000000-0000-0000-0000-000000000001",
        description=f"Lançamento automático venda {sale_id[:8]}",
        reference_doc_id=sale_id,
    )
    db.add(ledger)
    db.commit()
    db.refresh(sale)
    return sale


def list_sales(db: Session, company_id: str | None = None) -> list[Document]:
    query = db.query(Document).filter(Document.doc_type == "SALES_ORDER")
    if company_id:
        query = query.filter(Document.company_id == company_id)
    return query.order_by(Document.created_at.desc()).all()


def search_sales(db: Session, q: str, company_id: str | None = None) -> list[Document]:
    query = db.query(Document).filter(
        Document.doc_type == "SALES_ORDER",
        Document.description.ilike(f"%{q}%"),
    )
    if company_id:
        query = query.filter(Document.company_id == company_id)
    return query.order_by(Document.created_at.desc()).all()


def update_sale(db: Session, sale_id: str, customer: str | None = None, total: float | None = None) -> Document:
    sale = db.query(Document).filter(Document.id == sale_id, Document.doc_type == "SALES_ORDER").first()
    if not sale:
        raise HTTPException(status_code=404, detail="Venda não encontrada")
    if customer is not None:
        sale.description = f"Venda - {customer}"
    if total is not None:
        if total <= 0:
            raise HTTPException(status_code=400, detail="Valor da venda inválido")
        sale.total_amount = total
    db.commit()
    db.refresh(sale)
    return sale


def delete_sale(db: Session, sale_id: str) -> None:
    sale = db.query(Document).filter(Document.id == sale_id, Document.doc_type == "SALES_ORDER").first()
    if not sale:
        raise HTTPException(status_code=404, detail="Venda não encontrada")
    db.delete(sale)
    db.commit()
