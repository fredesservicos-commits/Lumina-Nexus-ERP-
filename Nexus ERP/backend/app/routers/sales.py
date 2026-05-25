from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.models.user import User
from app.schemas.sales import SaleCreate, SaleResponse, SaleSearchResult, SaleUpdate
from app.services.sales_service import register_sale, list_sales, search_sales, update_sale, delete_sale
from app.services.auth_dependencies import get_current_user

router = APIRouter()


@router.post("/new", response_model=SaleResponse)
def create_sale(data: SaleCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    sale = register_sale(db, data.customer, data.total, company_id=current_user.company_id)
    return SaleResponse(
        id=sale.id,
        customer=data.customer,
        total=data.total,
        created_at=sale.created_at,
    )


@router.get("/list", response_model=list[SaleResponse])
def get_sales(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from app.models.operacional import Document
    query = db.query(Document).filter(Document.doc_type == "SALES_ORDER")
    if current_user.company_id:
        query = query.filter(Document.company_id == current_user.company_id)
    query = query.order_by(Document.created_at.desc()).all()
    return [
        SaleResponse(
            id=s.id,
            customer=s.description.replace("Venda - ", "") if s.description else "",
            total=s.total_amount,
            created_at=s.created_at,
        )
        for s in query
    ]


@router.get("/search")
def get_sales_search(q: str = Query(""), page: int = Query(1, ge=1), per_page: int = Query(20, ge=1, le=100), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from app.core.pagination import paginate
    from app.models.operacional import Document
    query = db.query(Document).filter(
        Document.doc_type == "SALES_ORDER",
        Document.description.ilike(f"%{q}%"),
    )
    if current_user.company_id:
        query = query.filter(Document.company_id == current_user.company_id)
    query = query.order_by(Document.created_at.desc())
    result = paginate(query, page, per_page)
    result["data"] = [
        SaleSearchResult(
            id=s.id,
            customer=s.description.replace("Venda - ", "") if s.description else "",
            total=s.total_amount,
            created_at=s.created_at,
        )
        for s in result["data"]
    ]
    return result


@router.put("/{sale_id}", response_model=SaleResponse)
def edit_sale(sale_id: str, data: SaleUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    sale = update_sale(db, sale_id, data.customer, data.total)
    return SaleResponse(
        id=sale.id,
        customer=data.customer,
        total=data.total,
        created_at=sale.created_at,
    )


@router.delete("/{sale_id}", status_code=204)
def remove_sale(sale_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    delete_sale(db, sale_id)
