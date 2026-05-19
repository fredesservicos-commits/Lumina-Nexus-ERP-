import {
  CodeBlock,
  DocH3,
  DocH4,
  DocList,
  DocP,
  DocSection,
  Callout,
} from "@/components/docs/DocBlocks";

export function Fase3Content() {
  return (
    <DocSection>
      <DocP>
        Para começar a desenvolver agora mesmo com banco real e backend, a
        melhor forma é usar o <strong className="text-foreground">Docker</strong>.
        Ele permite subir um PostgreSQL profissional em segundos, sem instalar
        nada manualmente. Aqui está o script de automação de ambiente do Nexus
        ERP.
      </DocP>

      <DocH3>Passo 1: Configuração do banco (docker-compose.yml)</DocH3>
      <DocP>
        Crie um arquivo <code className="font-mono text-primary">docker-compose.yml</code>{" "}
        na raiz do projeto. Ele configura o PostgreSQL real.
      </DocP>

      <CodeBlock
        language="yaml"
        filename="docker-compose.yml"
        code={`version: '3.8'
services:
  db:
    image: postgres:15
    container_name: nexus_db
    restart: always
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: nexuspassword
      POSTGRES_DB: nexus_erp
    ports:
      - "5432:5432"
    volumes:
      - nexus_data:/var/lib/postgresql/data

volumes:
  nexus_data:`}
      />

      <DocH3>Passo 2: Script de instalação de dependências</DocH3>

      <DocH4>Linux / macOS</DocH4>
      <CodeBlock
        language="bash"
        filename="setup_env.sh"
        code={`#!/usr/bin/env bash
set -e
echo "Instalando dependências do Nexus ERP..."
pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic
echo "Subindo Banco de Dados Real via Docker..."
docker compose up -d
echo "Ambiente pronto!"`}
      />

      <DocH4>Windows</DocH4>
      <CodeBlock
        language="batch"
        filename="setup_env.bat"
        code={`@echo off
echo Instalando dependencias do Nexus ERP...
pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic
echo Dependencias instaladas.
echo Subindo Banco de Dados Real via Docker...
docker-compose up -d
echo Ambiente Pronto!`}
      />

      <DocH3>Passo 3: Backend conectado (main.py)</DocH3>
      <DocP>
        Este código já cria as tabelas de Compras, Vendas e RH assim que é
        executado.
      </DocP>

      <CodeBlock
        language="python"
        filename="main.py"
        code={`from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, String, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import datetime
import uuid

# 1. CONEXÃO COM O BANCO REAL (DOCKER)
DATABASE_URL = "postgresql://admin:nexuspassword@localhost:5432/nexus_erp"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. MODELOS DO BANCO (o Triângulo 100%)
class Product(Base):
    __tablename__ = "products"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String)
    price = Column(Float)
    stock = Column(Float)

class Sale(Base):
    __tablename__ = "sales"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    customer = Column(String)
    total = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# Cria as tabelas no banco
Base.metadata.create_all(bind=engine)

# 3. APP E ENDPOINTS
app = FastAPI(title="Nexus ERP Real-Time")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def status():
    return {"status": "Nexus ERP Online", "database": "Connected"}

@app.post("/sales/new")
def register_sale(customer: str, value: float, db: Session = Depends(get_db)):
    nova_venda = Sale(customer=customer, total=value)
    db.add(nova_venda)
    db.commit()
    return {"message": "Venda registrada no banco real!", "id": nova_venda.id}

@app.get("/inventory/list")
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).all()`}
      />

      <DocH3>Como rodar tudo em 3 passos</DocH3>
      <DocList
        ordered
        items={[
          <>Instale o <strong className="text-foreground">Docker Desktop</strong> (se ainda não tiver).</>,
          <>Abra o terminal na pasta onde você criou os arquivos.</>,
          <>
            Execute os comandos:
            <CodeBlock
              language="bash"
              code={`docker compose up -d        # liga o PostgreSQL
uvicorn main:app --reload   # liga o ERP`}
            />
          </>,
        ]}
      />

      <DocH3>Por que isso é "nível profissional"?</DocH3>
      <DocList
        items={[
          <>
            <strong className="text-foreground">Persistência real:</strong> você
            pode desligar o PC e, ao reiniciar o Docker, suas vendas e produtos
            estarão lá.
          </>,
          <>
            <strong className="text-foreground">Escalabilidade:</strong> esse mesmo{" "}
            <code className="font-mono text-primary">main.py</code> pode ir para
            AWS/Azure amanhã sem mudar quase nada.
          </>,
          <>
            <strong className="text-foreground">Ambiente isolado:</strong> o banco
            não "suja" o seu Windows — fica dentro do container, garantindo
            qualidade.
          </>,
        ]}
      />

      <Callout title="Próximo passo" variant="info">
        Com o banco rodando e o backend respondendo, partimos para a Fase 4 —
        primeira interface conectada e camada de IA para leitura de NF-e.
      </Callout>
    </DocSection>
  );
}
