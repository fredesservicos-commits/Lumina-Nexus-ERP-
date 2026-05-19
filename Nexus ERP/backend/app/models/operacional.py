import uuid
from datetime import datetime, UTC

from sqlalchemy import String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.database import Base


class BusinessPartner(Base):
    __tablename__ = "business_partners"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    company_id: Mapped[str] = mapped_column(String, ForeignKey("companies.id"))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    tax_id: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    category: Mapped[str] = mapped_column(String(20), comment="CUSTOMER | VENDOR | BOTH | EMPLOYEE")
    credit_limit: Mapped[float] = mapped_column(Float, default=0.00)
    is_active: Mapped[bool] = mapped_column(default=True)


class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    company_id: Mapped[str] = mapped_column(String, ForeignKey("companies.id"))
    sku: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    avg_cost: Mapped[float] = mapped_column(Float, default=0.00)
    sale_price: Mapped[float] = mapped_column(Float, nullable=False)
    stock_quantity: Mapped[float] = mapped_column(Float, default=0.00)


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    company_id: Mapped[str] = mapped_column(String, ForeignKey("companies.id"))
    partner_id: Mapped[str] = mapped_column(String, ForeignKey("business_partners.id"))
    doc_type: Mapped[str] = mapped_column(String(20), comment="PURCHASE_INVOICE | SALES_ORDER | PAYROLL")
    status: Mapped[str] = mapped_column(String(20), default="DRAFT")
    total_amount: Mapped[float] = mapped_column(Float, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC))
    items = relationship("DocumentItem", back_populates="document", cascade="all, delete-orphan")


class DocumentItem(Base):
    __tablename__ = "document_items"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    doc_id: Mapped[str] = mapped_column(String, ForeignKey("documents.id"))
    product_id: Mapped[str] = mapped_column(String, ForeignKey("products.id"))
    quantity: Mapped[float] = mapped_column(Float, nullable=False)
    unit_price: Mapped[float] = mapped_column(Float, nullable=False)
    total_price: Mapped[float] = mapped_column(Float, nullable=False)
    document = relationship("Document", back_populates="items")
