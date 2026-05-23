from datetime import date

from pydantic import BaseModel


class EmployeeCreate(BaseModel):
    partner_id: str
    department: str
    hire_date: date
    base_salary: float
    benefits_total: float = 0.00
    tax_load_percent: float = 0.00


class EmployeeUpdate(BaseModel):
    department: str | None = None
    base_salary: float | None = None
    benefits_total: float | None = None
    tax_load_percent: float | None = None


class EmployeeResponse(BaseModel):
    id: str
    partner_id: str
    department: str | None
    hire_date: date
    base_salary: float
    benefits_total: float
    tax_load_percent: float
    monthly_cost: float

    model_config = {"from_attributes": True}
