import uuid
from datetime import date

from sqlalchemy import String, Float, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.database import Base


class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    partner_id: Mapped[str] = mapped_column(String, ForeignKey("business_partners.id"))
    department: Mapped[str] = mapped_column(String(50), nullable=True)
    hire_date: Mapped[date] = mapped_column(Date, nullable=False)
    base_salary: Mapped[float] = mapped_column(Float, nullable=False)
    benefits_total: Mapped[float] = mapped_column(Float, default=0.00)
    tax_load_percent: Mapped[float] = mapped_column(Float, default=0.00)
