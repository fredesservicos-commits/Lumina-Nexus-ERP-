-- Seed data for Nexus ERP
-- This runs after migrations during `supabase db reset`

-- Default Company
INSERT INTO companies (id, name, tax_id)
VALUES ('default-company', 'Lumina Nexus ERP Ltda', '00.000.000/0001-00')
ON CONFLICT (id) DO NOTHING;

-- Default Admin User (password: "admin123" hashed with bcrypt)
-- In production, change this immediately after first login
INSERT INTO users (id, email, hashed_password, display_name, role, company_id, is_active)
VALUES (
    'default-admin',
    'admin@nexuserp.com',
    '$2b$12$LJ3m4ys3Lk0TSwGQj9GzHOeK.7FmH5Xx5Q5Y5a5b5c5d5e5f5g5h5i',
    'Administrador',
    'admin',
    'default-company',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Default Chart of Accounts (Plano de Contas padrão)
INSERT INTO chart_of_accounts (company_id, code, name, account_type) VALUES
    ('default-company', '1', 'Ativo', 'ASSET'),
    ('default-company', '1.1', 'Ativo Circulante', 'ASSET'),
    ('default-company', '1.1.1', 'Caixa e Equivalentes', 'ASSET'),
    ('default-company', '1.1.2', 'Contas a Receber', 'ASSET'),
    ('default-company', '1.1.3', 'Estoques', 'ASSET'),
    ('default-company', '1.2', 'Ativo Não Circulante', 'ASSET'),
    ('default-company', '1.2.1', 'Imobilizado', 'ASSET'),
    ('default-company', '2', 'Passivo', 'LIABILITY'),
    ('default-company', '2.1', 'Passivo Circulante', 'LIABILITY'),
    ('default-company', '2.1.1', 'Fornecedores', 'LIABILITY'),
    ('default-company', '2.1.2', 'Obrigações Fiscais', 'LIABILITY'),
    ('default-company', '2.2', 'Passivo Não Circulante', 'LIABILITY'),
    ('default-company', '2.2.1', 'Financiamentos', 'LIABILITY'),
    ('default-company', '3', 'Patrimônio Líquido', 'EQUITY'),
    ('default-company', '3.1', 'Capital Social', 'EQUITY'),
    ('default-company', '3.2', 'Lucros Acumulados', 'EQUITY'),
    ('default-company', '4', 'Receitas', 'REVENUE'),
    ('default-company', '4.1', 'Receita de Vendas', 'REVENUE'),
    ('default-company', '4.2', 'Receitas Financeiras', 'REVENUE'),
    ('default-company', '5', 'Despesas', 'EXPENSE'),
    ('default-company', '5.1', 'Custo das Mercadorias Vendidas', 'EXPENSE'),
    ('default-company', '5.2', 'Despesas Operacionais', 'EXPENSE'),
    ('default-company', '5.3', 'Despesas com Pessoal', 'EXPENSE'),
    ('default-company', '5.4', 'Despesas Tributárias', 'EXPENSE')
ON CONFLICT DO NOTHING;
