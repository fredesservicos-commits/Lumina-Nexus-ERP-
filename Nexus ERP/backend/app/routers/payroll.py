from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.models.user import User
from app.models.rh import Employee
from app.services.auth_dependencies import get_current_user, require_role
from app.services.payroll_service import calculate_payroll

router = APIRouter()


class PayrollRequest(BaseModel):
    employee_id: str
    num_dependents: int = 0
    months_worked: int = 12


class PayrollResponse(BaseModel):
    employee_id: str
    gross_salary: float
    inss: float
    inss_aliquot: float
    irrf: float
    irrf_aliquot: float
    net_salary: float
    fgts: float
    thirteenth: float
    vacation: float
    annual_cost: float
    monthly_cost: float
    dependent_deduction: float


@router.post("/calculate", response_model=PayrollResponse)
def calculate_employee_payroll(
    data: PayrollRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin", "gerente")),
):
    employee = db.query(Employee).filter(Employee.id == data.employee_id).first()
    if not employee:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")

    result = calculate_payroll(
        gross_salary=employee.base_salary,
        num_dependents=data.num_dependents,
        months_worked=data.months_worked,
        benefits_total=employee.benefits_total,
    )

    return PayrollResponse(
        employee_id=employee.id,
        gross_salary=result.gross_salary,
        inss=result.inss,
        inss_aliquot=result.inss_aliquot,
        irrf=result.irrf,
        irrf_aliquot=result.irrf_aliquot,
        net_salary=result.net_salary,
        fgts=result.fgts,
        thirteenth=result.thirteenth,
        vacation=result.vacation,
        annual_cost=result.annual_cost,
        monthly_cost=result.monthly_cost,
        dependent_deduction=result.dependent_deduction,
    )


@router.post("/calculate-all", response_model=list[PayrollResponse])
def calculate_all_payrolls(
    num_dependents: int = 0,
    months_worked: int = 12,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin", "gerente")),
):
    employees = db.query(Employee).all()
    results = []
    for emp in employees:
        result = calculate_payroll(
            gross_salary=emp.base_salary,
            num_dependents=num_dependents,
            months_worked=months_worked,
            benefits_total=emp.benefits_total,
        )
        results.append(PayrollResponse(
            employee_id=emp.id,
            gross_salary=result.gross_salary,
            inss=result.inss,
            inss_aliquot=result.inss_aliquot,
            irrf=result.irrf,
            irrf_aliquot=result.irrf_aliquot,
            net_salary=result.net_salary,
            fgts=result.fgts,
            thirteenth=result.thirteenth,
            vacation=result.vacation,
            annual_cost=result.annual_cost,
            monthly_cost=result.monthly_cost,
            dependent_deduction=result.dependent_deduction,
        ))
    return results
