from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.schemas.dashboard import DashboardSummary
from app.services.dashboard_service import get_summary, get_recent_transactions

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary)
def dashboard_summary(db: Session = Depends(get_db)):
    data = get_summary(db)
    return DashboardSummary(**data)


@router.get("/recent")
def recent_transactions(limit: int = Query(10), db: Session = Depends(get_db)):
    return get_recent_transactions(db, limit)