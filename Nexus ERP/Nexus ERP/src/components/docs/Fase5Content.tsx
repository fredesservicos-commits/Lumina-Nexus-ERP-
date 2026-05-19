import {
  CodeBlock,
  DocH3,
  DocList,
  DocP,
  DocSection,
  Callout,
} from "@/components/docs/DocBlocks";

export function Fase5Content() {
  return (
    <DocSection>
      <DocP>
        Para que o sistema pareça um ERP profissional, ele precisa de{" "}
        <strong className="text-foreground">reatividade</strong>: você salva um
        dado e ele aparece na tela instantaneamente. Aqui está a atualização
        completa do Backend e do Frontend para incluir a funcionalidade de{" "}
        <strong className="text-foreground">Listar Vendas</strong>, puxando
        direto do PostgreSQL real.
      </DocP>

      <DocH3>1. Atualização do Backend (main.py)</DocH3>
      <DocP>
        Adicione este novo endpoint{" "}
        <code className="font-mono text-primary">GET /sales/list</code> para
        buscar as vendas no banco de dados.
      </DocP>

      <CodeBlock
        language="python"
        filename="main.py (trecho)"
        code={`# ... (mantenha o código anterior de conexão e modelos) ...

@app.get("/sales/list")
def list_sales(db: Session = Depends(get_db)):
    # Busca todas as vendas ordenadas pela data mais recente
    vendas = db.query(Sale).order_by(Sale.created_at.desc()).all()
    return vendas

# ... (mantenha o restante dos endpoints) ...`}
      />

      <DocH3>2. Atualização do Frontend (index.html)</DocH3>
      <DocP>
        Agora dá-se "inteligência" ao JavaScript para ele desenhar a tabela
        sempre que a página abrir ou uma venda nova for feita. Mantenha o HTML
        e o CSS anteriores — substitua apenas o bloco{" "}
        <code className="font-mono text-primary">&lt;script&gt;</code>.
      </DocP>

      <CodeBlock
        language="html"
        filename="index.html (somente o <script>)"
        code={`<script>
  const API_URL = "http://localhost:8000";

  // 1. Carregar as vendas do PostgreSQL
  async function carregarVendas() {
    try {
      const response = await fetch(\`\${API_URL}/sales/list\`);
      const vendas   = await response.json();

      const corpoTabela = document.querySelector("#tabelaVendas tbody");
      corpoTabela.innerHTML = ""; // limpa antes de preencher

      vendas.forEach(venda => {
        const dataFormatada = new Date(venda.created_at).toLocaleString('pt-BR');
        const linha = \`
          <tr>
            <td>\${venda.id.substring(0, 8)}...</td>
            <td>\${venda.customer}</td>
            <td>R$ \${venda.total.toFixed(2)}</td>
          </tr>
        \`;
        corpoTabela.innerHTML += linha;
      });
    } catch (error) {
      console.error("Erro ao carregar vendas:", error);
    }
  }

  // 2. Salvar a venda
  async function salvarVenda() {
    const customer = document.getElementById('customer').value;
    const value    = document.getElementById('value').value;

    if (!customer || !value) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const response = await fetch(
      \`\${API_URL}/sales/new?customer=\${customer}&value=\${value}\`,
      { method: 'POST' }
    );

    if (response.ok) {
      alert("Venda gravada no PostgreSQL!");
      document.getElementById('customer').value = '';
      document.getElementById('value').value    = '';

      // ATUALIZAÇÃO AUTOMÁTICA DA LISTA
      carregarVendas();
    } else {
      alert("Erro ao gravar venda.");
    }
  }

  // 3. Executa ao abrir a página (Praticidade!)
  window.onload = carregarVendas;
</script>`}
      />

      <DocH3>O ciclo completo agora</DocH3>
      <DocList
        ordered
        items={[
          <><strong className="text-foreground">Entrada:</strong> o usuário digita os dados.</>,
          <><strong className="text-foreground">Processamento:</strong> o Python valida, gera um ID (UUID) e grava no PostgreSQL.</>,
          <><strong className="text-foreground">Persistência:</strong> o banco confirma a gravação segura.</>,
          <><strong className="text-foreground">Saída:</strong> o sistema busca a lista atualizada do banco e redesenha a tabela.</>,
        ]}
      />

      <DocH3>Como testar</DocH3>
      <DocList
        ordered
        items={[
          <>Certifique-se de que o Docker (<code className="font-mono text-primary">nexus_db</code>) está ligado.</>,
          <>Rode o backend: <code className="font-mono text-primary">uvicorn main:app --reload</code>.</>,
          <>Abra o <code className="font-mono text-primary">index.html</code>.</>,
          <>
            Insira uma venda. Você verá que ela aparece na tabela{" "}
            <strong className="text-foreground">automaticamente</strong>, sem
            precisar dar F5 na página.
          </>,
        ]}
      />

      <DocH3>Próximos passos sugeridos</DocH3>
      <DocList
        ordered
        items={[
          <><strong className="text-foreground">Filtro de busca:</strong> barra de pesquisa para filtrar clientes ou valores na tabela.</>,
          <><strong className="text-foreground">Módulo de Compras (Entrada):</strong> tela similar para cadastrar o que a empresa compra.</>,
          <><strong className="text-foreground">Dashboard de Lucro:</strong> caixa no topo que soma o total de todas as vendas registradas no banco (Rentabilidade).</>,
        ]}
      />

      <Callout title="Sistema vivo" variant="success">
        Com a Fase 5 o sistema deixa de ser estático e passa a se autoatualizar
        — o toque final que separa um protótipo de um ERP profissional.
      </Callout>
    </DocSection>
  );
}
