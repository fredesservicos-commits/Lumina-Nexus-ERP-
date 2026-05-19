export interface Sale {
  id: string;
  customer: string;
  total: number;
  created_at: string;
}

export interface Purchase {
  id: string;
  item_name: string;
  total: number;
  created_at: string;
}

export interface DashboardSummary {
  total_sales: number;
  total_purchases: number;
  net_profit: number;
}

export interface Employee {
  id: string;
  partner_id: string;
  department: string | null;
  hire_date: string;
  base_salary: number;
  benefits_total: number;
  tax_load_percent: number;
  monthly_cost: number;
}
