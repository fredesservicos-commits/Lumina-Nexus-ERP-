from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.models.rh import Employee
from app.schemas.employees import EmployeeCreate, EmployeeResponse

router = APIRouter()


@router.post("/new", response_model=EmployeeResponse)
def register_employee(data: EmployeeCreate, db: Session = Depends(get_db)):
    emp = Employee(
        partner_id=data.partner_id,
        department=data.department,
        hire_date=data.hire_date,
        base_salary=data.base_salary,
        benefits_total=data.benefits_total,
        tax_load_percent=data.tax_load_percent,
    )
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return _to_response(emp)


@router.get("/list", response_model=list[EmployeeResponse])
def list_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    return [_to_response(e) for e in employees]


def _to_response(emp: Employee) -> EmployeeResponse:
    monthly_cost = emp.base_salary + emp.benefits_total
    if emp.tax_load_percent > 0:
        monthly_cost += monthly_cost * (emp.tax_load_percent / 100)
    return EmployeeResponse(
        id=emp.id,
        partner_id=emp.partner_id,
        department=emp.department,
        hire_date=emp.hire_date,
        base_salary=emp.base_salary,
        benefits_total=emp.benefits_total,
        tax_load_percent=emp.tax_load_percent,
        monthly_cost=round(monthly_cost, 2),
    )
