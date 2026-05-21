from app.routers import sales, purchases, dashboard, employees, finance, auth


def register_routers(app):
    app.include_router(sales.router, prefix="/sales", tags=["Vendas"])
    app.include_router(purchases.router, prefix="/purchases", tags=["Compras"])
    app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
    app.include_router(employees.router, prefix="/employees", tags=["RH"])
    app.include_router(finance.router, prefix="/finance", tags=["Financeiro"])
    app.include_router(auth.router, prefix="/auth", tags=["Autenticação"])
