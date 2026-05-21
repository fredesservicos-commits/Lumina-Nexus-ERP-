import {
  CodeBlock,
  DocH3,
  DocH4,
  DocList,
  DocP,
  DocSection,
  Callout,
} from "@/components/docs/DocBlocks";

export function Fase4Content() {
  return (
    <DocSection>
      <DocP>
        Para que o sistema comece a ganhar "vida" visualmente, criamos uma página{" "}
        <strong className="text-foreground">Frontend</strong> simples e moderna usando HTML, CSS e
        JavaScript puro (sem instalar nada extra) para conversar com o Backend Python. Antes, é
        preciso um pequeno ajuste no <code className="font-mono text-primary">main.py</code> para
        liberar a comunicação do navegador (<strong className="text-foreground">CORS</strong>).
      </DocP>

      <DocH3>Passo 1: Ajuste no Backend (CORS)</DocH3>
      <DocP>
        Adicione estas linhas ao seu arquivo <code className="font-mono text-primary">main.py</code>{" "}
        para o Frontend conseguir conversar com o Backend.
      </DocP>

      <CodeBlock
        language="python"
        filename="main.py (trecho)"
        code={`from fastapi.middleware.cors import CORSMiddleware

# ... (mantenha o código anterior) ...

app = FastAPI(title="Nexus ERP Real-Time")

# ADICIONE ISSO AQUI:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Permite qualquer página acessar (ideal para teste)
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... (resto do código dos endpoints) ...`}
      />

      <Callout title="Atenção em produção" variant="warning">
        Em produção, troque <code className="font-mono">allow_origins=["*"]</code> pela lista exata
        de domínios autorizados (ex.:{" "}
        <code className="font-mono">["https://nexus.suaempresa.com.br"]</code>).
      </Callout>

      <DocH3>Passo 2: O Frontend (index.html)</DocH3>
      <DocP>
        Crie um arquivo <code className="font-mono text-primary">index.html</code> na mesma pasta. O
        estilo é "Clean Microsoft", para dar cara de praticidade.
      </DocP>

      <CodeBlock
        language="html"
        filename="index.html"
        code={`<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Nexus ERP – Painel de Vendas</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
           background: #f4f7f6; margin: 40px; }
    .card { background: white; padding: 25px; border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            max-width: 500px; margin-bottom: 20px; }
    h2 { color: #2c3e50; margin-top: 0; }
    input { width: 100%; padding: 10px; margin: 10px 0;
            border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    button { background: #0078d4; color: white; border: none;
             padding: 10px 20px; border-radius: 4px;
             cursor: pointer; width: 100%; font-weight: bold; }
    button:hover { background: #005a9e; }
    table { width: 100%; border-collapse: collapse; background: white;
            border-radius: 8px; overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #0078d4; color: white; }
  </style>
</head>
<body>

  <div class="card">
    <h2>Nova Venda (Nexus ERP)</h2>
    <input type="text"   id="customer" placeholder="Nome do Cliente">
    <input type="number" id="value"    placeholder="Valor da Venda (R$)">
    <button onclick="salvarVenda()">Registrar no Banco Real</button>
  </div>

  <h2>Vendas Registradas</h2>
  <table id="tabelaVendas">
    <thead>
      <tr>
        <th>ID</th>
        <th>Cliente</th>
        <th>Valor (R$)</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>

  <script>
    const API_URL = "http://localhost:8000";

    // Função para salvar a venda no Backend
    async function salvarVenda() {
      const customer = document.getElementById('customer').value;
      const value    = document.getElementById('value').value;

      const response = await fetch(
        \`\${API_URL}/sales/new?customer=\${customer}&value=\${value}\`,
        { method: 'POST' }
      );

      if (response.ok) {
        alert("Venda gravada no PostgreSQL com sucesso!");
        document.getElementById('customer').value = '';
        document.getElementById('value').value    = '';
        carregarVendas();
      } else {
        alert("Erro ao gravar venda.");
      }
    }

    // Carregar as vendas do banco
    async function carregarVendas() {
      // Crie um endpoint GET /sales no main.py para popular a tabela
    }
  </script>
</body>
</html>`}
      />

      <DocH3>Como testar o ciclo completo (Front → Back → Banco)</DocH3>
      <DocList
        ordered
        items={[
          <>
            <strong className="text-foreground">Ligue o Banco:</strong> no terminal, rode{" "}
            <code className="font-mono text-primary">docker compose up -d</code>.
          </>,
          <>
            <strong className="text-foreground">Ligue o Backend:</strong> no terminal, rode{" "}
            <code className="font-mono text-primary">uvicorn main:app --reload</code>.
          </>,
          <>
            <strong className="text-foreground">Abra o Frontend:</strong> dê dois cliques no arquivo{" "}
            <code className="font-mono text-primary">index.html</code>.
          </>,
          <>
            <strong className="text-foreground">Ação:</strong> digite nome e valor, clique no botão.
            O JavaScript envia para o Python, o Python valida e grava no PostgreSQL, o banco
            confirma e você recebe o alerta.
          </>,
        ]}
      />

      <DocH3>Por que isso é um marco para o projeto?</DocH3>
      <DocList
        items={[
          <>
            <strong className="text-foreground">Fim da teoria:</strong> agora você tem um sistema
            real. Digite uma venda, feche tudo, reinicie o computador, olhe no banco — a venda
            continua lá.
          </>,
          <>
            <strong className="text-foreground">Qualidade visual:</strong> o formulário é simples,
            mas segue o padrão de praticidade.
          </>,
          <>
            <strong className="text-foreground">Fundação de ERP:</strong> você pode duplicar esse{" "}
            <code className="font-mono text-primary">index.html</code> para criar as telas de
            Compras e RH usando a mesma lógica.
          </>,
        ]}
      />

      <DocH3>Próximo passo sugerido</DocH3>
      <DocP>
        Adicionar a funcionalidade <strong className="text-foreground">"Listar Vendas"</strong> —
        popular a tabela automaticamente ao carregar a página, dando o toque final de "sistema
        vivo". Isso requer um endpoint <code className="font-mono text-primary">GET /sales</code> no{" "}
        <code className="font-mono text-primary">main.py</code> e uma chamada{" "}
        <code className="font-mono text-primary">fetch</code> dentro de{" "}
        <code className="font-mono text-primary">carregarVendas()</code>.
      </DocP>

      <Callout title="Roadmap completo entregue" variant="success">
        Com as Fases 1 a 4 implementadas, o Nexus ERP tem banco persistente, backend com regras,
        ambiente dockerizado e interface conectada — um ciclo completo Front → Back → Banco
        funcionando.
      </Callout>
    </DocSection>
  );
}
