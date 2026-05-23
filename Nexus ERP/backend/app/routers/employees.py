from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.models.rh import Employee
from app.models.user import User
from app.schemas.employees import EmployeeCreate, EmployeeResponse, EmployeeUpdate
from app.services.auth_dependencies import get_current_user, require_role

router = APIRouter()


@router.post("/new", response_model=EmployeeResponse)
def register_employee(data: EmployeeCreate, db: Session = Depends(get_db), current_user: User = Depends(require_role("admin", "gerente"))):
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


@router.get("/list")
def list_employees(page: int = Query(1, ge=1), per_page: int = Query(20, ge=1, le=100), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from app.core.pagination import paginate
    query = db.query(Employee)
    result = paginate(query, page, per_page)
    result["data"] = [_to_response(e) for e in result["data"]]
    return result


@router.put("/{employee_id}", response_model=EmployeeResponse)
def edit_employee(employee_id: str, data: EmployeeUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_role("admin", "gerente"))):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")
    if data.department is not None:
        emp.department = data.department
    if data.base_salary is not None:
        emp.base_salary = data.base_salary
    if data.benefits_total is not None:
        emp.benefits_total = data.benefits_total
    if data.tax_load_percent is not None:
        emp.tax_load_percent = data.tax_load_percent
    db.commit()
    db.refresh(emp)
    return _to_response(emp)


@router.delete("/{employee_id}", status_code=204)
def remove_employee(employee_id: str, db: Session = Depends(get_db), current_user: User = Depends(require_role("admin"))):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")
    db.delete(emp)
    db.commit()


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
