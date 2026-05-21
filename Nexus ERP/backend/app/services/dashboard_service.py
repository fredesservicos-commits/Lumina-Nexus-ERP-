from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.operacional import Document


def get_summary(db: Session) -> dict:
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
    return {
        "total_sales": round(total_sales, 2),
        "total_purchases": round(total_purchases, 2),
        "net_profit": round(total_sales - total_purchases, 2),
    }


def get_recent_transactions(db: Session, limit: int = 10) -> list[dict]:
    docs = (
        db.query(Document)
        .order_by(Document.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id": d.id,
            "type": d.doc_type,
            "description": d.description or "",
            "total": d.total_amount,
            "created_at": d.created_at.isoformat(),
        }
        for d in docs
    ]