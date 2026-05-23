from dataclasses import dataclass


INSS_TABLE = [
    (1412.00, 0.075),
    (2666.68, 0.09),
    (4000.03, 0.12),
    (7786.02, 0.14),
]

INSS_CEILING = 7786.02

IRRF_TABLE = [
    (2259.20, 0.0, 0.0),
    (2826.65, 0.075, 169.44),
    (3751.05, 0.15, 381.44),
    (4664.68, 0.225, 662.77),
    (float("inf"), 0.275, 896.00),
]

IRRF_DEPENDENT_DEDUCTION = 189.59


@dataclass
class PayrollBreakdown:
    gross_salary: float
    inss: float
    inss_aliquot: float
    irrf_base: float
    irrf: float
    irrf_aliquot: float
    net_salary: float
    fgts: float
    fgts_total: float
    thirteenth: float
    vacation: float
    vacation_one_third: float
    annual_cost: float
    monthly_cost: float
    dependent_deduction: float = 0.0
    base_inss: float = 0.0
    base_irrf: float = 0.0


def calculate_inss(salary: float) -> tuple[float, float]:
    if salary <= 0:
        return 0.0, 0.0
    tax = 0.0
    previous_limit = 0.0
    aliquot = 0.0
    for limit, rate in INSS_TABLE:
        if salary > previous_limit:
            bracket = min(salary, limit) - previous_limit
            tax += bracket * rate
            if salary <= limit:
                aliquot = rate
                break
            previous_limit = limit
        else:
            break
    else:
        aliquot = INSS_TABLE[-1][1]

    effective_aliquot = round((tax / salary) * 100, 2) if salary > 0 else 0
    return round(tax, 2), effective_aliquot


def calculate_irrf(base: float, num_dependents: int = 0) -> tuple[float, float]:
    dependent_deduction = num_dependents * IRRF_DEPENDENT_DEDUCTION
    adjusted_base = max(0, base - dependent_deduction)

    aliquot = 0.0
    deduction = 0.0
    for limit, rate, deduct in IRRF_TABLE:
        if adjusted_base <= limit:
            aliquot = rate
            deduction = deduct
            break

    irrf = max(0, round(adjusted_base * aliquot - deduction, 2))
    effective_aliquot = round((irrf / base) * 100, 2) if base > 0 else 0
    return irrf, effective_aliquot


def calculate_payroll(
    gross_salary: float,
    num_dependents: int = 0,
    months_worked: int = 12,
    benefits_total: float = 0.0,
) -> PayrollBreakdown:
    if gross_salary <= 0:
        raise ValueError("Salário bruto deve ser maior que zero")

    inss, inss_aliquot = calculate_inss(gross_salary)
    irrf_base = gross_salary - inss
    irrf, irrf_aliquot = calculate_irrf(irrf_base, num_dependents)

    dependent_deduction = num_dependents * IRRF_DEPENDENT_DEDUCTION

    net_salary = round(gross_salary - inss - irrf, 2)
    fgts = round(gross_salary * 0.08, 2)
    fgts_total = round(fgts + benefits_total, 2)
    thirteenth = round(gross_salary / 12 * months_worked, 2)
    vacation = round(gross_salary + gross_salary / 3, 2)
    vacation_one_third = round(gross_salary / 3, 2)
    annual_cost = round(
        (net_salary * 12) + thirteenth + vacation + (fgts * 12) + (benefits_total * 12),
        2,
    )
    monthly_cost = round(annual_cost / 12, 2)

    return PayrollBreakdown(
        gross_salary=gross_salary,
        inss=inss,
        inss_aliquot=inss_aliquot,
        irrf_base=irrf_base,
        irrf=irrf,
        irrf_aliquot=irrf_aliquot,
        net_salary=net_salary,
        fgts=fgts,
        fgts_total=fgts_total,
        thirteenth=thirteenth,
        vacation=vacation,
        vacation_one_third=vacation_one_third,
        annual_cost=annual_cost,
        monthly_cost=monthly_cost,
        dependent_deduction=round(dependent_deduction, 2),
    )
