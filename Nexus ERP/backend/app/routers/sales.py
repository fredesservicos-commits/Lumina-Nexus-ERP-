import uuid
from datetime import datetime, UTC

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.models.operacional import Document, DocumentItem
from app.models.financeiro import GeneralLedger, LedgerItem
from app.schemas.sales import SaleCreate, SaleResponse, SaleSearchResult

router = APIRouter()


@router.post("/new", response_model=SaleResponse)
def register_sale(data: SaleCreate, db: Session = Depends(get_db)):
    if data.total <= 0:
        raise HTTPException(status_code=400, detail="Valor da venda inválido")

    sale_id = str(uuid.uuid4())
    sale = Document(
        id=sale_id,
        doc_type="SALES_ORDER",
        status="CONFIRMED",
        total_amount=data.total,
        description=f"Venda - {data.customer}",
    )
    db.add(sale)

    ledger = GeneralLedger(
        company_id=sale.company_id,
        description=f"Lançamento automático venda {sale_id[:8]}",
        reference_doc_id=sale_id,
    )
    db.add(ledger)
    db.commit()
    db.refresh(sale)

    return SaleResponse(
        id=sale.id,
        customer=data.customer,
        total=data.total,
        created_at=sale.created_at,
    )


@router.get("/list", response_model=list[SaleResponse])
def list_sales(db: Session = Depends(get_db)):
    sales = (
        db.query(Document)
        .filter(Document.doc_type == "SALES_ORDER")
        .order_by(Document.created_at.desc())
        .all()
    )
    return [
        SaleResponse(
            id=s.id,
            customer=s.description.replace("Venda - ", "") if s.description else "",
            total=s.total_amount,
            created_at=s.created_at,
        )
        for s in sales
    ]


@router.get("/search", response_model=list[SaleSearchResult])
def search_sales(q: str = Query(""), db: Session = Depends(get_db)):
    sales = (
        db.query(Document)
        .filter(Document.doc_type == "SALES_ORDER")
        .filter(Document.description.ilike(f"%{q}%"))
        .order_by(Document.created_at.desc())
        .all()
    )
    return [
        SaleSearchResult(
            id=s.id,
            customer=s.description.replace("Venda - ", "") if s.description else "",
            total=s.total_amount,
            created_at=s.created_at,
        )
        for s in sales
    ]
