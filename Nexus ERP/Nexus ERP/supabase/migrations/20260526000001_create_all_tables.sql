-- Migration: Create all Nexus ERP tables
-- This is the initial schema for the Supabase project

-- 1. Companies (tenant)
CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    tax_id TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN companies.tax_id IS 'CNPJ';

-- 2. Users
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    display_name TEXT,
    role TEXT NOT NULL DEFAULT 'operador',
    company_id TEXT REFERENCES companies(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    supabase_uid TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
COMMENT ON COLUMN users.role IS 'admin | gerente | operador';

-- 3. Business Partners (customers / vendors)
CREATE TABLE IF NOT EXISTS business_partners (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    company_id TEXT NOT NULL REFERENCES companies(id),
    name TEXT NOT NULL,
    tax_id TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    credit_limit DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT true
);

COMMENT ON COLUMN business_partners.category IS 'CUSTOMER | VENDOR | BOTH | EMPLOYEE';

-- 4. Products
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    company_id TEXT NOT NULL REFERENCES companies(id),
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    avg_cost DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    sale_price DOUBLE PRECISION NOT NULL,
    stock_quantity DOUBLE PRECISION NOT NULL DEFAULT 0.00
);

-- 5. Documents (orders / invoices)
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    company_id TEXT NOT NULL REFERENCES companies(id),
    partner_id TEXT NOT NULL REFERENCES business_partners(id),
    doc_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    total_amount DOUBLE PRECISION NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN documents.doc_type IS 'PURCHASE_INVOICE | SALES_ORDER | PAYROLL';

-- 6. Document Items
CREATE TABLE IF NOT EXISTS document_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    doc_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES products(id),
    quantity DOUBLE PRECISION NOT NULL,
    unit_price DOUBLE PRECISION NOT NULL,
    total_price DOUBLE PRECISION NOT NULL
);

-- 7. Chart of Accounts (Plano de Contas)
CREATE TABLE IF NOT EXISTS chart_of_accounts (
    id SERIAL PRIMARY KEY,
    company_id TEXT NOT NULL REFERENCES companies(id),
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    account_type TEXT NOT NULL
);

COMMENT ON COLUMN chart_of_accounts.account_type IS 'ASSET | LIABILITY | EQUITY | REVENUE | EXPENSE';

-- 8. General Ledger
CREATE TABLE IF NOT EXISTS general_ledger (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    company_id TEXT NOT NULL REFERENCES companies(id),
    transaction_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    description TEXT,
    reference_doc_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Ledger Items (double-entry)
CREATE TABLE IF NOT EXISTS ledger_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    ledger_id TEXT NOT NULL REFERENCES general_ledger(id) ON DELETE CASCADE,
    account_id INTEGER NOT NULL REFERENCES chart_of_accounts(id),
    debit DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    credit DOUBLE PRECISION NOT NULL DEFAULT 0.00
);

-- 10. Employees (RH)
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    partner_id TEXT NOT NULL REFERENCES business_partners(id),
    department TEXT,
    hire_date DATE NOT NULL,
    base_salary DOUBLE PRECISION NOT NULL,
    benefits_total DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    tax_load_percent DOUBLE PRECISION NOT NULL DEFAULT 0.00
);

-- Auto-update updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
