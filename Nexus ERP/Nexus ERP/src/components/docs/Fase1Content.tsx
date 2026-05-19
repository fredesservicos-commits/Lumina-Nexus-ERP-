import {
  CodeBlock,
  DocH3,
  DocH4,
  DocList,
  DocP,
  DocSection,
  Callout,
} from "@/components/docs/DocBlocks";

export function Fase1Content() {
  return (
    <DocSection>
      <DocP>
        A <strong className="text-foreground">Fase 1</strong> estabelece a fundação
        do Nexus ERP: a modelagem completa do banco de dados PostgreSQL com
        rigor contábil estilo SAP. Cada tabela aqui é a base sobre a qual todos
        os módulos (Financeiro, Compras, Vendas, RH, Estoque) operam.
      </DocP>

      <DocH3>1. Princípios da modelagem</DocH3>
      <DocList
        items={[
          <>
            <strong className="text-foreground">Multi-empresa nativo:</strong>{" "}
            toda tabela transacional carrega <code className="font-mono text-primary">company_id</code>{" "}
            e é protegida por Row-Level Security.
          </>,
          <>
            <strong className="text-foreground">Partidas dobradas:</strong> o ledger
            contábil só aceita lançamentos cuja soma de débitos é igual à soma de
            créditos.
          </>,
          <>
            <strong className="text-foreground">Imutabilidade:</strong> registros do
            ledger nunca são alterados — correções viram novos lançamentos de estorno.
          </>,
          <>
            <strong className="text-foreground">UUIDs como chave primária:</strong>{" "}
            evita colisões entre empresas e facilita sincronização.
          </>,
        ]}
      />

      <DocH3>2. Núcleo: empresa, parceiros e plano de contas</DocH3>
      <DocP>
        As três tabelas fundamentais que sustentam toda a operação. Sem elas,
        nada do restante existe.
      </DocP>

      <CodeBlock
        language="sql"
        filename="01_core.sql"
        code={`-- Empresa (multi-tenant)
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cnpj VARCHAR(14) UNIQUE NOT NULL,
  legal_name VARCHAR(200) NOT NULL,
  trade_name VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parceiros: clientes, fornecedores, ambos
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  document VARCHAR(14) NOT NULL,            -- CPF/CNPJ
  name VARCHAR(200) NOT NULL,
  is_customer BOOLEAN DEFAULT FALSE,
  is_supplier BOOLEAN DEFAULT FALSE,
  credit_limit NUMERIC(14,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, document)
);

-- Plano de contas (hierárquico, padrão SPED)
CREATE TABLE chart_of_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  code VARCHAR(20) NOT NULL,                -- ex: 1.1.01.001
  name VARCHAR(200) NOT NULL,
  account_type VARCHAR(20) NOT NULL,        -- ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
  parent_id UUID REFERENCES chart_of_accounts(id),
  is_synthetic BOOLEAN DEFAULT FALSE,
  UNIQUE(company_id, code)
);`}
      />

      <DocH3>3. Ledger: o coração contábil</DocH3>
      <DocP>
        O ledger é o registro único da verdade. Cada lançamento tem dois lados
        (débito/crédito) e a soma deve sempre fechar em zero.
      </DocP>

      <CodeBlock
        language="sql"
        filename="02_ledger.sql"
        code={`CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  description TEXT NOT NULL,
  source_module VARCHAR(20),                -- PURCHASE, SALE, PAYROLL, MANUAL
  source_doc_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE journal_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
  account_id UUID REFERENCES chart_of_accounts(id),
  debit NUMERIC(14,2) DEFAULT 0,
  credit NUMERIC(14,2) DEFAULT 0,
  CHECK ((debit > 0 AND credit = 0) OR (credit > 0 AND debit = 0))
);

-- Constraint: o lançamento sempre fecha em zero
CREATE OR REPLACE FUNCTION enforce_balanced_entry()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT SUM(debit) - SUM(credit)
      FROM journal_lines WHERE entry_id = NEW.entry_id) <> 0 THEN
    RAISE EXCEPTION 'Lançamento desbalanceado (débitos ≠ créditos)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;`}
      />

      <DocH3>4. Operacional: produtos, documentos, RH</DocH3>
      <CodeBlock
        language="sql"
        filename="03_operational.sql"
        code={`CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  sku VARCHAR(50) NOT NULL,
  name VARCHAR(200) NOT NULL,
  unit_cost NUMERIC(14,4) DEFAULT 0,        -- custo médio ponderado
  stock NUMERIC(14,3) DEFAULT 0,
  UNIQUE(company_id, sku)
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  doc_type VARCHAR(20),                     -- NFE_IN, NFE_OUT, RECEIPT
  partner_id UUID REFERENCES partners(id),
  number VARCHAR(50),
  total NUMERIC(14,2),
  issued_at DATE,
  status VARCHAR(20) DEFAULT 'DRAFT'
);

CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  cpf VARCHAR(11) NOT NULL,
  name VARCHAR(200) NOT NULL,
  base_salary NUMERIC(14,2) NOT NULL,
  hired_at DATE NOT NULL,
  UNIQUE(company_id, cpf)
);`}
      />

      <DocH3>5. Segurança: roles e RLS</DocH3>
      <DocP>
        Roles ficam em tabela separada — nunca em colunas booleanas no perfil
        do usuário — para evitar escalonamento de privilégios.
      </DocP>

      <CodeBlock
        language="sql"
        filename="04_roles_rls.sql"
        code={`CREATE TYPE app_role AS ENUM ('admin', 'accountant', 'operator', 'viewer');

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, company_id, role)
);

-- Função SECURITY DEFINER (evita recursão de RLS)
CREATE OR REPLACE FUNCTION has_role(_user UUID, _company UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user AND company_id = _company AND role = _role
  );
$$;

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "company_isolation" ON journal_entries
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), company_id, 'accountant')
      OR has_role(auth.uid(), company_id, 'admin'));`}
      />

      <Callout title="Resultado da Fase 1" variant="success">
        Banco modelado, isolado por empresa, com integridade contábil garantida
        no nível do banco de dados. Pronto para receber o backend (Fase 2).
      </Callout>
    </DocSection>
  );
}
