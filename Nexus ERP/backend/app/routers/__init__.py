from app.routers import sales, purchases, dashboard, employees


def register_routers(app):
    app.include_router(sales.router, prefix="/sales", tags=["Vendas"])
    app.include_router(purchases.router, prefix="/purchases", tags=["Compras"])
    app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
    app.include_router(employees.router, prefix="/employees", tags=["RH"])
