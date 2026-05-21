from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.schemas.purchases import PurchaseCreate, PurchaseResponse
from app.services.purchases_service import register_purchase, list_purchases, search_purchases

router = APIRouter()


@router.post("/new", response_model=PurchaseResponse)
def create_purchase(data: PurchaseCreate, db: Session = Depends(get_db)):
    purchase = register_purchase(db, data.item_name, data.total)
    return PurchaseResponse(
        id=purchase.id,
        item_name=data.item_name,
        total=data.total,
        created_at=purchase.created_at,
    )


@router.get("/list", response_model=list[PurchaseResponse])
def get_purchases(db: Session = Depends(get_db)):
    purchases = list_purchases(db)
    return [
        PurchaseResponse(
            id=p.id,
            item_name=p.description.replace("Compra - ", "") if p.description else "",
            total=p.total_amount,
            created_at=p.created_at,
        )
        for p in purchases
    ]


@router.get("/search", response_model=list[PurchaseResponse])
def search_purchases_endpoint(q: str = Query(""), db: Session = Depends(get_db)):
    purchases = search_purchases(db, q)
    return [
        PurchaseResponse(
            id=p.id,
            item_name=p.description.replace("Compra - ", "") if p.description else "",
            total=p.total_amount,
            created_at=p.created_at,
        )
        for p in purchases
    ]