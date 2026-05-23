from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.models.user import User
from app.schemas.dashboard import DashboardSummary
from app.services.dashboard_service import get_summary, get_recent_transactions
from app.services.auth_dependencies import get_current_user

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary)
def dashboard_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = get_summary(db)
    return DashboardSummary(**data)


@router.get("/recent")
def recent_transactions(limit: int = Query(10), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_recent_transactions(db, limit)
