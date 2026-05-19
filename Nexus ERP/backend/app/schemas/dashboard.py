from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_sales: float
    total_purchases: float
    net_profit: float
