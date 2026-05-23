from app.services.payroll_service import calculate_payroll, calculate_inss, calculate_irrf


def test_calculate_inss_minimum_wage():
    inss, aliquot = calculate_inss(1412.00)
    assert inss == 105.90
    assert aliquot > 0


def test_calculate_inss_ceiling():
    inss, _ = calculate_inss(10000.00)
    assert inss > 500
    assert inss <= 1000


def test_calculate_inss_zero():
    inss, _ = calculate_inss(0)
    assert inss == 0


def test_calculate_irrf_exempt():
    irrf, _ = calculate_irrf(2000.00)
    assert irrf == 0


def test_calculate_irrf_with_tax():
    irrf, _ = calculate_irrf(5000.00)
    assert irrf > 0


def test_calculate_irrf_with_dependents():
    irrf_no_dep, _ = calculate_irrf(5000.00, 0)
    irrf_with_dep, _ = calculate_irrf(5000.00, 2)
    assert irrf_with_dep < irrf_no_dep


def test_full_payroll():
    result = calculate_payroll(5000.00, num_dependents=0, months_worked=12)
    assert result.gross_salary == 5000.00
    assert result.net_salary < result.gross_salary
    assert result.inss > 0
    assert result.irrf >= 0
    assert result.fgts > 0
    assert result.thirteenth > 0
    assert result.vacation > 0
    assert result.annual_cost > 0
    assert result.monthly_cost > 0


def test_payroll_minimum_wage():
    result = calculate_payroll(1412.00)
    assert result.net_salary <= result.gross_salary
    assert result.inss > 0


def test_payroll_negative_salary():
    try:
        calculate_payroll(-100)
        assert False, "Deveria ter levantado ValueError"
    except ValueError:
        pass
