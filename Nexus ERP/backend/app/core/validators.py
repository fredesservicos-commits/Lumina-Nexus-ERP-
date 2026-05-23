import re


def validate_cpf(cpf: str) -> bool:
    cpf = re.sub(r"\D", "", cpf)
    if len(cpf) != 11 or cpf == cpf[0] * 11:
        return False

    for i in range(9, 11):
        total = sum(int(cpf[j]) * (i + 1 - j) for j in range(i))
        digit = (total * 10 % 11) % 11
        if int(cpf[i]) != digit:
            return False
    return True


def validate_cnpj(cnpj: str) -> bool:
    cnpj = re.sub(r"\D", "", cnpj)
    if len(cnpj) != 14 or cnpj == cnpj[0] * 14:
        return False

    weights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    for i in range(12, 14):
        total = sum(int(cnpj[j]) * weights[j - (i == 13)] for j in range(i))
        digit = total % 11
        digit = 0 if digit < 2 else 11 - digit
        if int(cnpj[i]) != digit:
            return False
    return True


def format_cpf(cpf: str) -> str:
    cpf = re.sub(r"\D", "", cpf)
    return f"{cpf[:3]}.{cpf[3:6]}.{cpf[6:9]}-{cpf[9:]}"


def format_cnpj(cnpj: str) -> str:
    cnpj = re.sub(r"\D", "", cnpj)
    return f"{cnpj[:2]}.{cnpj[2:5]}.{cnpj[5:8]}/{cnpj[8:12]}-{cnpj[12:]}"
