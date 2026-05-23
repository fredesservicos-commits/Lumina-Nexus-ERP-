from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.models.user import User
from app.schemas.purchases import PurchaseCreate, PurchaseResponse, PurchaseUpdate
from app.services.purchases_service import register_purchase, list_purchases, search_purchases, update_purchase, delete_purchase
from app.services.auth_dependencies import get_current_user

router = APIRouter()


@router.post("/new", response_model=PurchaseResponse)
def create_purchase(data: PurchaseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    purchase = register_purchase(db, data.item_name, data.total, company_id=current_user.company_id)
    return PurchaseResponse(
        id=purchase.id,
        item_name=data.item_name,
        total=data.total,
        created_at=purchase.created_at,
    )


@router.get("/list")
def get_purchases(page: int = Query(1, ge=1), per_page: int = Query(20, ge=1, le=100), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from app.core.pagination import paginate
    from app.models.operacional import Document
    query = db.query(Document).filter(Document.doc_type == "PURCHASE_INVOICE")
    if current_user.company_id:
        query = query.filter(Document.company_id == current_user.company_id)
    query = query.order_by(Document.created_at.desc())
    result = paginate(query, page, per_page)
    result["data"] = [
        PurchaseResponse(
            id=p.id,
            item_name=p.description.replace("Compra - ", "") if p.description else "",
            total=p.total_amount,
            created_at=p.created_at,
        )
        for p in result["data"]
    ]
    return result


@router.get("/search")
def search_purchases_endpoint(q: str = Query(""), page: int = Query(1, ge=1), per_page: int = Query(20, ge=1, le=100), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from app.core.pagination import paginate
    from app.models.operacional import Document
    query = db.query(Document).filter(
        Document.doc_type == "PURCHASE_INVOICE",
        Document.description.ilike(f"%{q}%"),
    )
    if current_user.company_id:
        query = query.filter(Document.company_id == current_user.company_id)
    query = query.order_by(Document.created_at.desc())
    result = paginate(query, page, per_page)
    result["data"] = [
        PurchaseResponse(
            id=p.id,
            item_name=p.description.replace("Compra - ", "") if p.description else "",
            total=p.total_amount,
            created_at=p.created_at,
        )
        for p in result["data"]
    ]
    return result


@router.put("/{purchase_id}", response_model=PurchaseResponse)
def edit_purchase(purchase_id: str, data: PurchaseUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    purchase = update_purchase(db, purchase_id, data.item_name, data.total)
    return PurchaseResponse(
        id=purchase.id,
        item_name=data.item_name,
        total=data.total,
        created_at=purchase.created_at,
    )


@router.delete("/{purchase_id}", status_code=204)
def remove_purchase(purchase_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    delete_purchase(db, purchase_id)
