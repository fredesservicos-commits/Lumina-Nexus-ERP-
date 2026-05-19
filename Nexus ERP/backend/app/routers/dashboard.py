from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.models.operacional import Document
from app.schemas.dashboard import DashboardSummary

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_sales = (
        db.query(func.coalesce(func.sum(Document.total_amount), 0))
        .filter(Document.doc_type == "SALES_ORDER", Document.status == "CONFIRMED")
        .scalar()
        or 0
    )
    total_purchases = (
        db.query(func.coalesce(func.sum(Document.total_amount), 0))
        .filter(Document.doc_type == "PURCHASE_INVOICE", Document.status == "CONFIRMED")
        .scalar()
        or 0
    )

    return DashboardSummary(
        total_sales=round(total_sales, 2),
        total_purchases=round(total_purchases, 2),
        net_profit=round(total_sales - total_purchases, 2),
    )
