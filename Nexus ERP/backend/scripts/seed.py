import sys
import os
from datetime import date
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.models.database import engine, SessionLocal, Base
from app.models.company import Company
from app.models.rh import Employee
from app.models.financeiro import ChartOfAccounts, GeneralLedger, LedgerItem
from app.models.operacional import BusinessPartner, Product, Document, DocumentItem

Base.metadata.create_all(bind=engine)
db = SessionLocal()

DEFAULT_COMPANY_ID = "00000000-0000-0000-0000-000000000001"
DEFAULT_PARTNER_ID = "00000000-0000-0000-0000-000000000000"

# Empresa
if not db.query(Company).filter(Company.id == DEFAULT_COMPANY_ID).first():
    db.add(Company(id=DEFAULT_COMPANY_ID, name="Nexus ERP Ltda", tax_id="00.000.000/0001-00"))
    print("Empresa criada.")

# Plano de Contas
contas = [
    ("1.01", "Caixa", "ASSET"),
    ("1.02", "Bancos", "ASSET"),
    ("1.03", "Contas a Receber", "ASSET"),
    ("1.04", "Estoque", "ASSET"),
    ("2.01", "Contas a Pagar", "LIABILITY"),
    ("2.02", "Salários a Pagar", "LIABILITY"),
    ("2.03", "Impostos a Recolher", "LIABILITY"),
    ("3.01", "Capital Social", "EQUITY"),
    ("3.02", "Lucros Acumulados", "EQUITY"),
    ("4.01", "Receita de Vendas", "REVENUE"),
    ("5.01", "Custo de Mercadorias", "EXPENSE"),
    ("5.02", "Despesas Operacionais", "EXPENSE"),
    ("5.03", "Salários", "EXPENSE"),
    ("5.04", "Impostos", "EXPENSE"),
]
for code, name, tipo in contas:
    if not db.query(ChartOfAccounts).filter(ChartOfAccounts.code == code).first():
        db.add(ChartOfAccounts(company_id=DEFAULT_COMPANY_ID, code=code, name=name, account_type=tipo))
        print(f"Conta criada: {code} - {name}")

# Fornecedores / Clientes
partners_data = [
    ("Fornecedor A", "11.111.111/0001-11", "VENDOR"),
    ("Fornecedor B", "22.222.222/0001-22", "VENDOR"),
    ("Cliente X", "33.333.333/0001-33", "CUSTOMER"),
    ("Cliente Y", "44.444.444/0001-44", "CUSTOMER"),
]
partners = {}
for name, tax_id, category in partners_data:
    existing = db.query(BusinessPartner).filter(BusinessPartner.tax_id == tax_id).first()
    if not existing:
        p = BusinessPartner(company_id=DEFAULT_COMPANY_ID, name=name, tax_id=tax_id, category=category, is_active=True)
        db.add(p)
        db.flush()
        partners[name] = p
        print(f"Parceiro criado: {name}")
    else:
        partners[name] = existing

# Produtos
produtos_data = [
    ("PROD-001", "Notebook", 3500.00, 5200.00, 15),
    ("PROD-002", "Monitor 27\"", 1200.00, 2100.00, 30),
    ("PROD-003", "Teclado Mecânico", 180.00, 350.00, 50),
    ("PROD-004", "Mouse Wireless", 80.00, 150.00, 40),
    ("PROD-005", "Cadeira Ergonômica", 800.00, 1500.00, 10),
]
products = {}
for sku, name, cost, price, stock in produtos_data:
    existing = db.query(Product).filter(Product.sku == sku).first()
    if not existing:
        p = Product(company_id=DEFAULT_COMPANY_ID, sku=sku, name=name, avg_cost=cost, sale_price=price, stock_quantity=stock)
        db.add(p)
        db.flush()
        products[name] = p
        print(f"Produto criado: {name}")
    else:
        products[name] = existing

db.commit()

# Vendas (Document SALES_ORDER)
vendas_data = [
    ("Cliente X", 5200.00, products["Notebook"]),
    ("Cliente Y", 350.00, products["Teclado Mecânico"]),
    ("Cliente X", 150.00, products["Mouse Wireless"]),
]
for cliente_nome, total, produto in vendas_data:
    partner = partners.get(cliente_nome)
    if partner:
        doc = Document(
            company_id=DEFAULT_COMPANY_ID,
            partner_id=partner.id,
            doc_type="SALES_ORDER",
            status="CONFIRMED",
            total_amount=total,
            description=f"Venda - {cliente_nome}",
        )
        db.add(doc)
        db.flush()
        db.add(DocumentItem(doc_id=doc.id, product_id=produto.id, quantity=1, unit_price=total, total_price=total))
        # Ledger automático (débito Contas a Receber, crédito Receita de Vendas)
        ledger = GeneralLedger(
            company_id=DEFAULT_COMPANY_ID,
            description=f"Lançamento automático venda {doc.id[:8]}",
            reference_doc_id=doc.id,
        )
        db.add(ledger)
        db.flush()
        conta_receber = db.query(ChartOfAccounts).filter(ChartOfAccounts.code == "1.03").first()
        conta_receita = db.query(ChartOfAccounts).filter(ChartOfAccounts.code == "4.01").first()
        if conta_receber and conta_receita:
            db.add(LedgerItem(ledger_id=ledger.id, account_id=conta_receber.id, debit=total, credit=0))
            db.add(LedgerItem(ledger_id=ledger.id, account_id=conta_receita.id, debit=0, credit=total))
        print(f"Venda criada: {cliente_nome} - R$ {total:.2f}")

# Compras (Document PURCHASE_INVOICE)
compras_data = [
    ("Fornecedor A", 3500.00, products["Notebook"]),
    ("Fornecedor A", 3600.00, products["Monitor 27\""]),
    ("Fornecedor B", 180.00, products["Teclado Mecânico"]),
]
for forn_nome, total, produto in compras_data:
    partner = partners.get(forn_nome)
    if partner:
        doc = Document(
            company_id=DEFAULT_COMPANY_ID,
            partner_id=partner.id,
            doc_type="PURCHASE_INVOICE",
            status="CONFIRMED",
            total_amount=total,
            description=f"Compra - {produto.name}",
        )
        db.add(doc)
        db.flush()
        db.add(DocumentItem(doc_id=doc.id, product_id=produto.id, quantity=1, unit_price=total, total_price=total))
        print(f"Compra criada: {forn_nome} - {produto.name} - R$ {total:.2f}")

# Funcionários
func_data = [
    ("TI", 8000.00),
    ("Vendas", 5000.00),
    ("RH", 6000.00),
    ("Financeiro", 7000.00),
]
for dept, salario in func_data:
    emp = Employee(
        partner_id=DEFAULT_PARTNER_ID,
        department=dept,
        hire_date=date(2025, 1, 15),
        base_salary=salario,
        benefits_total=salario * 0.3,
        tax_load_percent=28.0,
    )
    db.add(emp)
    print(f"Funcionário criado: {dept} - R$ {salario:.2f}")

db.commit()
db.close()
print("\nSeed concluído! Dados de teste inseridos com sucesso.")
