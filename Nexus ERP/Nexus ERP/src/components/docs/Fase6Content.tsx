import { CodeBlock, Callout, DocH3, DocList, DocP, DocSection } from "./DocBlocks";

const backendCode = `# main.py — adições da Fase 6 (Torre de Controle)
from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy import create_engine, Column, String, Float, DateTime, func
from sqlalchemy.orm import Session
import uuid, datetime
# ... (mantenha os imports e a configuração anterior) ...

# --- NOVO MODELO: COMPRAS ---
class Purchase(Base):
    __tablename__ = "purchases"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    item_name = Column(String)
    total = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

Base.metadata.create_all(bind=engine)

# --- NOVOS ENDPOINTS ---

# 1. BUSCA DE VENDAS (Passo 1)
@app.get("/sales/search")
def search_sales(q: str = "", db: Session = Depends(get_db)):
    return db.query(Sale).filter(Sale.customer.ilike(f"%{q}%")).all()

# 2. MÓDULO DE COMPRAS (Passo 2)
@app.post("/purchases/new")
def register_purchase(item: str, value: float, db: Session = Depends(get_db)):
    nova_compra = Purchase(item_name=item, total=value)
    db.add(nova_compra)
    db.commit()
    return {"message": "Compra registrada!"}

# 3. DASHBOARD DE RENTABILIDADE (Passo 3)
@app.get("/dashboard/summary")
def get_summary(db: Session = Depends(get_db)):
    total_vendas = db.query(func.sum(Sale.total)).scalar() or 0
    total_compras = db.query(func.sum(Purchase.total)).scalar() or 0
    lucro = total_vendas - total_compras
    return {
        "vendas": total_vendas,
        "compras": total_compras,
        "lucro": lucro,
    }
`;

const frontendCode = `<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <title>Nexus ERP – Torre de Controle</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #f0f2f5; margin: 30px; display: flex; flex-direction: column; gap: 20px; }
    .dashboard { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
    .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
    .stat-card h3 { margin: 0; color: #666; font-size: 14px; }
    .stat-card p { font-size: 24px; font-weight: bold; margin: 10px 0 0 0; }
    .forms-container { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    input { width: 100%; padding: 8px; margin: 8px 0; border: 1px solid #ddd; border-radius: 4px; }
    button { background: #0078d4; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; width: 100%; }
    .search-bar { width: 100%; padding: 12px; font-size: 16px; border: 2px solid #0078d4; border-radius: 8px; margin-bottom: 10px; }
    table { width: 100%; background: white; border-collapse: collapse; border-radius: 8px; overflow: hidden; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #0078d4; color: white; }
  </style>
</head>
<body>

  <div class="dashboard">
    <div class="stat-card"><h3>Total Vendas</h3><p id="dash-vendas" style="color:#28a745;">R$ 0,00</p></div>
    <div class="stat-card"><h3>Total Compras</h3><p id="dash-compras" style="color:#dc3545;">R$ 0,00</p></div>
    <div class="stat-card"><h3>Lucro Real</h3><p id="dash-lucro" style="color:#0078d4;">R$ 0,00</p></div>
  </div>

  <input type="text" id="search" class="search-bar"
         placeholder="🔍 Buscar cliente na lista de vendas..."
         onkeyup="buscarVendas()" />

  <div class="forms-container">
    <div class="card">
      <h2>Registrar Venda</h2>
      <input type="text" id="v_customer" placeholder="Cliente" />
      <input type="number" id="v_value" placeholder="Valor" />
      <button onclick="registrar('venda')">Salvar Venda</button>
    </div>

    <div class="card">
      <h2>Registrar Compra</h2>
      <input type="text" id="c_item" placeholder="Item / Fornecedor" />
      <input type="number" id="c_value" placeholder="Valor" />
      <button onclick="registrar('compra')" style="background:#5c2d91;">Salvar Compra</button>
    </div>
  </div>

  <table>
    <thead><tr><th>Data</th><th>Entidade</th><th>Valor (R$)</th></tr></thead>
    <tbody id="listaVendas"></tbody>
  </table>

  <script>
    const API = "http://localhost:8000";

    // PASSO 3: ATUALIZAR DASHBOARD
    async function atualizarDash() {
      const res = await fetch(\`\${API}/dashboard/summary\`);
      const data = await res.json();
      document.getElementById('dash-vendas').innerText  = \`R$ \${data.vendas.toFixed(2)}\`;
      document.getElementById('dash-compras').innerText = \`R$ \${data.compras.toFixed(2)}\`;
      document.getElementById('dash-lucro').innerText   = \`R$ \${data.lucro.toFixed(2)}\`;
    }

    // PASSO 1: BUSCA FILTRADA
    async function buscarVendas() {
      const q = document.getElementById('search').value;
      const res = await fetch(\`\${API}/sales/search?q=\${q}\`);
      const vendas = await res.json();
      desenharTabela(vendas);
    }

    // REGISTRAR VENDA OU COMPRA
    async function registrar(tipo) {
      const ent = tipo === 'venda'
        ? document.getElementById('v_customer').value
        : document.getElementById('c_item').value;
      const val = tipo === 'venda'
        ? document.getElementById('v_value').value
        : document.getElementById('c_value').value;
      const rota = tipo === 'venda'
        ? \`sales/new?customer=\${ent}&value=\${val}\`
        : \`purchases/new?item=\${ent}&value=\${val}\`;

      await fetch(\`\${API}/\${rota}\`, { method: 'POST' });
      atualizarDash();
      buscarVendas();
    }

    function desenharTabela(lista) {
      const body = document.getElementById('listaVendas');
      body.innerHTML = lista.map(v =>
        \`<tr>
           <td>\${new Date(v.created_at).toLocaleDateString()}</td>
           <td>\${v.customer}</td>
           <td>R$ \${v.total.toFixed(2)}</td>
         </tr>\`
      ).join('');
    }

    window.onload = () => { atualizarDash(); buscarVendas(); };
  </script>
</body>
</html>
`;

export function Fase6Content() {
  return (
    <DocSection>
      <DocP>
        Esta é a fase em que o Nexus deixa de ser um cadastro e vira uma{" "}
        <strong>Torre de Controle</strong>. Unimos três peças que, juntas, entregam a primeira
        versão funcional do ERP: <strong>Busca de Vendas</strong>,{" "}
        <strong>Módulo de Compras</strong> e <strong>Dashboard de Rentabilidade</strong> — tudo
        calculado em tempo real direto do PostgreSQL.
      </DocP>

      <Callout title="O salto desta fase" variant="success">
        O sistema passa a responder à pergunta que importa para o dono:{" "}
        <em>"Estou ganhando ou perdendo dinheiro agora?"</em>. A conta{" "}
        <strong>Receita − Despesa = Lucro</strong> deixa de ser planilha e vira endpoint.
      </Callout>

      <DocH3>1. Backend — novos modelos e endpoints (`main.py`)</DocH3>
      <DocP>
        Adicionamos a tabela <code>purchases</code> e três novos endpoints: busca por cliente,
        registro de compras e o resumo financeiro consolidado.
      </DocP>
      <CodeBlock code={backendCode} language="python" filename="main.py" />

      <DocList
        items={[
          <>
            <strong>/sales/search</strong> — usa <code>ilike</code> para busca case-insensitive por
            cliente.
          </>,
          <>
            <strong>/purchases/new</strong> — espelha a estrutura de vendas, mas representa{" "}
            <em>saída</em> de caixa.
          </>,
          <>
            <strong>/dashboard/summary</strong> — agrega <code>SUM(total)</code> das duas tabelas e
            devolve o lucro em uma única chamada.
          </>,
        ]}
      />

      <Callout title="Por que SUM no banco e não no frontend?" variant="info">
        Agregar no PostgreSQL é ordens de magnitude mais rápido do que trafegar milhares de linhas
        até o browser para somar lá. É a mesma filosofia que SAP/Oracle aplicam:{" "}
        <strong>cálculo perto do dado</strong>.
      </Callout>

      <DocH3>2. Frontend — Dashboard, Busca e Formulários (`index.html`)</DocH3>
      <DocP>
        O layout ganha três blocos: cards de KPI no topo, barra de busca reativa e dois formulários
        lado a lado (Vendas e Compras). A tabela agora é alimentada pelo endpoint de busca.
      </DocP>
      <CodeBlock code={frontendCode} language="html" filename="index.html" />

      <DocH3>3. O ciclo completo de uma transação</DocH3>
      <DocList
        ordered
        items={[
          <>
            Usuário clica <strong>Salvar Venda</strong> → POST <code>/sales/new</code>.
          </>,
          <>
            Frontend dispara <code>atualizarDash()</code> → GET <code>/dashboard/summary</code> →
            KPIs recalculam.
          </>,
          <>
            Frontend dispara <code>buscarVendas()</code> → GET <code>/sales/search</code> → tabela é
            redesenhada.
          </>,
          <>Tudo isso sem reload — a página vive em estado contínuo com o banco.</>,
        ]}
      />

      <DocH3>Como validar o sucesso</DocH3>
      <DocList
        ordered
        items={[
          <>
            Registre uma <strong>Venda de R$ 1.000</strong> → o card <em>Lucro Real</em> sobe para
            R$ 1.000.
          </>,
          <>
            Registre uma <strong>Compra de R$ 400</strong> → o lucro cai para R$ 600
            instantaneamente.
          </>,
          <>Digite parte do nome do cliente na busca → a tabela filtra em tempo real, sem F5.</>,
        ]}
      />

      <Callout title="O que você acabou de construir" variant="success">
        Um protótipo funcional de ERP com <strong>dois departamentos conversando</strong> (Vendas e
        Compras), persistência relacional e leitura financeira consolidada. É o esqueleto sobre o
        qual entram, nas próximas fases, autenticação, multi-empresa e IA.
      </Callout>
    </DocSection>
  );
}
