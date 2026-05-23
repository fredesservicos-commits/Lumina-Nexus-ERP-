from math import ceil
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Query


class PaginationParams:
    def __init__(self, page: int = 1, per_page: int = 20):
        self.page = max(1, page)
        self.per_page = min(max(1, per_page), 100)


class PaginatedResult(BaseModel):
    data: list
    page: int
    per_page: int
    total: int
    total_pages: int
    has_next: bool
    has_prev: bool


def paginate(query: Query, page: int = 1, per_page: int = 20) -> dict:
    p = PaginationParams(page, per_page)
    total = query.count()
    items = query.offset((p.page - 1) * p.per_page).limit(p.per_page).all()
    total_pages = max(1, ceil(total / p.per_page))

    return {
        "data": items,
        "page": p.page,
        "per_page": p.per_page,
        "total": total,
        "total_pages": total_pages,
        "has_next": p.page < total_pages,
        "has_prev": p.page > 1,
    }
