from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.schemas.sales import SaleCreate, SaleResponse, SaleSearchResult
from app.services.sales_service import register_sale, list_sales, search_sales

router = APIRouter()


@router.post("/new", response_model=SaleResponse)
def create_sale(data: SaleCreate, db: Session = Depends(get_db)):
    sale = register_sale(db, data.customer, data.total)
    return SaleResponse(
        id=sale.id,
        customer=data.customer,
        total=data.total,
        created_at=sale.created_at,
    )


@router.get("/list", response_model=list[SaleResponse])
def get_sales(db: Session = Depends(get_db)):
    sales = list_sales(db)
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
def get_sales_search(q: str = Query(""), db: Session = Depends(get_db)):
    sales = search_sales(db, q)
    return [
        SaleSearchResult(
            id=s.id,
            customer=s.description.replace("Venda - ", "") if s.description else "",
            total=s.total_amount,
            created_at=s.created_at,
        )
        for s in sales
    ]