import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.models.operacional import Document
from app.schemas.purchases import PurchaseCreate, PurchaseResponse

router = APIRouter()


@router.post("/new", response_model=PurchaseResponse)
def register_purchase(data: PurchaseCreate, db: Session = Depends(get_db)):
    if data.total <= 0:
        raise HTTPException(status_code=400, detail="Valor da compra inválido")

    purchase = Document(
        doc_type="PURCHASE_INVOICE",
        status="CONFIRMED",
        total_amount=data.total,
        description=f"Compra - {data.item_name}",
    )
    db.add(purchase)
    db.commit()
    db.refresh(purchase)

    return PurchaseResponse(
        id=purchase.id,
        item_name=data.item_name,
        total=data.total,
        created_at=purchase.created_at,
    )


@router.get("/list", response_model=list[PurchaseResponse])
def list_purchases(db: Session = Depends(get_db)):
    purchases = (
        db.query(Document)
        .filter(Document.doc_type == "PURCHASE_INVOICE")
        .order_by(Document.created_at.desc())
        .all()
    )
    return [
        PurchaseResponse(
            id=p.id,
            item_name=p.description.replace("Compra - ", "") if p.description else "",
            total=p.total_amount,
            created_at=p.created_at,
        )
        for p in purchases
    ]
