import uuid
from datetime import datetime, UTC

from sqlalchemy import String, Float, DateTime, ForeignKey, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.database import Base


class ChartOfAccounts(Base):
    __tablename__ = "chart_of_accounts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    company_id: Mapped[str] = mapped_column(String, ForeignKey("companies.id"))
    code: Mapped[str] = mapped_column(String(20), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    account_type: Mapped[str] = mapped_column(String(20), comment="ASSET | LIABILITY | EQUITY | REVENUE | EXPENSE")


class GeneralLedger(Base):
    __tablename__ = "general_ledger"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    company_id: Mapped[str] = mapped_column(String, ForeignKey("companies.id"))
    transaction_date: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC))
    description: Mapped[str] = mapped_column(Text, nullable=True)
    reference_doc_id: Mapped[str] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC))
    items = relationship("LedgerItem", back_populates="ledger", cascade="all, delete-orphan")


class LedgerItem(Base):
    __tablename__ = "ledger_items"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    ledger_id: Mapped[str] = mapped_column(String, ForeignKey("general_ledger.id"))
    account_id: Mapped[int] = mapped_column(Integer, ForeignKey("chart_of_accounts.id"))
    debit: Mapped[float] = mapped_column(Float, default=0.00)
    credit: Mapped[float] = mapped_column(Float, default=0.00)
    ledger = relationship("GeneralLedger", back_populates="items")
