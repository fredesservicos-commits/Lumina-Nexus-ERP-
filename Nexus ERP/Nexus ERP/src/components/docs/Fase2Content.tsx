import {
  CodeBlock,
  DocH3,
  DocH4,
  DocList,
  DocP,
  DocSection,
  Callout,
} from "@/components/docs/DocBlocks";

export function Fase2Content() {
  return (
    <DocSection>
      <DocP>
        Para que o sistema saia do "papel" (código de simulação) e funcione em
        cenário real, conectamos o <strong className="text-foreground">Endpoint</strong>{" "}
        (porta de entrada) ao <strong className="text-foreground">Banco de Dados Real</strong>{" "}
        (cofre de informações).
      </DocP>

      <DocH3>1. O que é o quê nessa engrenagem?</DocH3>
      <DocList
        items={[
          <>
            <strong className="text-foreground">Banco de Dados Real (PostgreSQL):</strong>{" "}
            software rodando em um servidor que guarda as tabelas permanentemente.
            Mesmo com o computador desligado, os dados continuam lá.
          </>,
          <>
            <strong className="text-foreground">Endpoint (API):</strong> endereço
            (ex.: <code className="font-mono text-primary">meusistema.com/vendas</code>) que
            recebe ordens. É o intermediário.
          </>,
          <>
            <strong className="text-foreground">Driver (a ponte):</strong> para o
            Python falar com o PostgreSQL usamos{" "}
            <code className="font-mono text-primary">SQLAlchemy</code> ou{" "}
            <code className="font-mono text-primary">psycopg2</code>. Eles traduzem o
            código para a linguagem do banco.
          </>,
        ]}
      />

      <DocH3>2. O fluxo de trabalho</DocH3>
      <DocList
        ordered
        items={[
          <>O <strong className="text-foreground">usuário</strong> clica em "Salvar Venda" na tela.</>,
          <>O <strong className="text-foreground">front-end</strong> envia um pacote de dados (JSON) para o endpoint.</>,
          <>O <strong className="text-foreground">endpoint</strong> recebe, valida (estoque e crédito) e abre uma transação.</>,
          <>O <strong className="text-foreground">banco de dados</strong> grava a informação e responde "Ok".</>,
          <>O <strong className="text-foreground">endpoint</strong> responde para o usuário: "Venda realizada com sucesso!".</>,
        ]}
      />

      <DocH3>3. Código prático: Endpoint conectado ao banco real</DocH3>
      <DocP>
        Usamos <strong className="text-foreground">SQLAlchemy</strong> — padrão de
        mercado que garante a qualidade SAP e evita SQL Injection.
      </DocP>

      <DocH4>Passo A: Instalar as ferramentas</DocH4>
      <CodeBlock
        language="bash"
        code={`pip install fastapi uvicorn sqlalchemy psycopg2-binary`}
      />

      <DocH4>Passo B: Conexão e gravação</DocH4>
      <CodeBlock
        language="python"
        filename="main.py"
        code={`from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import datetime
import uuid

# 1. CONFIGURAÇÃO DO BANCO DE DADOS (o "Cofre")
DATABASE_URL = "postgresql://usuario:senha@localhost:5432/nexus_erp"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. DEFINIÇÃO DA TABELA (o "Modelo" no Python)
class SalesDB(Base):
    __tablename__ = "sales"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_name = Column(String)
    total_value = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# Cria a tabela no banco real se não existir
Base.metadata.create_all(bind=engine)

# 3. ENDPOINT (a "Porta de Entrada")
app = FastAPI()

# Função para abrir e fechar a conexão automaticamente
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/sales/save")
def save_sale(customer: str, value: float, db: Session = Depends(get_db)):
    # LÓGICA DE NEGÓCIO (Qualidade)
    if value <= 0:
        raise HTTPException(status_code=400, detail="Valor da venda inválido")

    # GRAVAÇÃO NO BANCO REAL
    new_sale = SalesDB(customer_name=customer, total_value=value)
    db.add(new_sale)        # adiciona
    db.commit()             # salva permanentemente (o "Commit" do SAP)
    db.refresh(new_sale)    # atualiza os dados

    return {"status": "Venda gravada no Banco Real", "id": new_sale.id}`}
      />

      <DocH3>4. Por que isso é importante para o seu sistema?</DocH3>

      <DocH4>A. Atomicidade (tudo ou nada)</DocH4>
      <DocP>
        No Nexus, quando você faz uma compra, o sistema deve: (1) aumentar o
        estoque, (2) criar a conta a pagar, (3) gerar o lançamento contábil. Com
        o banco real, se o passo 3 falhar, os passos 1 e 2 são cancelados
        automaticamente (rollback). Essa é a robustez SAP.
      </DocP>

      <DocH4>B. Performance</DocH4>
      <DocP>
        O PostgreSQL aguenta milhões de vendas por dia sem ficar lento,
        garantindo que a rentabilidade da empresa não seja prejudicada por
        sistema travado.
      </DocP>

      <DocH4>C. Segurança</DocH4>
      <DocP>
        O endpoint garante que ninguém mexa no banco sem permissão. Você coloca
        uma camada de login (OAuth2) no endpoint e o banco fica "escondido"
        atrás dele.
      </DocP>

      <DocH3>5. O que você precisa para testar agora?</DocH3>
      <DocList
        ordered
        items={[
          <>Instalar o PostgreSQL no seu computador (ou usar um serviço de nuvem).</>,
          <>Configurar a URL de conexão (<code className="font-mono text-primary">DATABASE_URL</code>) no código acima.</>,
          <>Executar o código e testar via Postman ou pela documentação do FastAPI em <code className="font-mono text-primary">http://localhost:8000/docs</code>.</>,
        ]}
      />

      <Callout title="Próximo passo" variant="info">
        A Fase 3 automatiza tudo isso com Docker — banco e dependências sobem
        com um único comando.
      </Callout>
    </DocSection>
  );
}
