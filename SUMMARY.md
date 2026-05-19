# Nexus ERP — Resumo do Projeto

## 📋 Visão Geral

ERP brasileiro com rigor contábil estilo SAP: Financeiro, Compras, Vendas, RH e Estoque integrados ao ledger contábil, com IA para leitura automática de NF-e. Multi-empresa nativo.

---

## 🏗️ Estrutura do Projeto

```
Lumina Nexus ERP/
├── Nexus ERP/                          → Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                     → 46 componentes shadcn/ui
│   │   │   ├── landing/                → Landing page (Hero, Modules, FAQ, etc.)
│   │   │   └── docs/                   → Documentação técnica (Fase 1-6)
│   │   ├── routes/
│   │   │   ├── __root.tsx              → Layout raiz
│   │   │   ├── index.tsx               → Landing page
│   │   │   ├── documentacao.tsx        → Documentação
│   │   │   ├── app.tsx                 → Layout interno (sidebar)
│   │   │   ├── app.index.tsx           → Dashboard
│   │   │   ├── app.vendas.tsx          → Vendas
│   │   │   ├── app.compras.tsx         → Compras
│   │   │   ├── app.rh.tsx             → RH
│   │   │   └── app.relatorios.tsx      → Relatórios
│   │   ├── hooks/
│   │   │   ├── useSales.ts            → API de vendas
│   │   │   ├── usePurchases.ts        → API de compras
│   │   │   └── useDashboard.ts        → API do dashboard
│   │   ├── lib/
│   │   │   ├── api.ts                 → Cliente HTTP
│   │   │   ├── types.ts               → Tipos TypeScript
│   │   │   └── utils.ts               → Utilitários
│   │   ├── main.tsx                   → Entry point
│   │   └── router.tsx                 → Roteador
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                            → Backend FastAPI
│   ├── app/
│   │   ├── main.py                    → App FastAPI + CORS
│   │   ├── core/
│   │   │   └── config.py              → Config via env vars
│   │   ├── models/
│   │   │   ├── database.py            → Engine + Session
│   │   │   ├── company.py             → companies
│   │   │   ├── financeiro.py          → chart_of_accounts, ledger
│   │   │   ├── operacional.py         → partners, products, documents
│   │   │   └── rh.py                  → employees
│   │   ├── routers/
│   │   │   ├── sales.py               → Vendas (CRUD + busca)
│   │   │   ├── purchases.py           → Compras (CRUD)
│   │   │   ├── dashboard.py           → Dashboard financeiro
│   │   │   └── employees.py           → RH com cálculo de custo
│   │   └── schemas/                   → Pydantic models
│   ├── requirements.txt
│   ├── Dockerfile
│   └── run.py
│
├── docker-compose.yml                  → PostgreSQL + Backend
├── scripts/
│   └── start_dev.bat                  → Setup 1-clique
├── .antigravity                        → Skills da equipe (20 skills)
├── TASKS.md                            → 66 tarefas organizadas
└── SUMMARY.md                          → Este arquivo
```

---

## 🚀 Serviços Rodando

| Serviço | URL | Porta |
|---------|-----|-------|
| Frontend | http://localhost:7777 | 7777 |
| Backend API | http://localhost:8000 | 8000 |
| Swagger Docs | http://localhost:8000/docs | 8000 |

---

## 📡 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/` | Status do servidor |
| `POST` | `/sales/new` | Criar venda |
| `GET` | `/sales/list` | Listar vendas |
| `GET` | `/sales/search?q=` | Buscar vendas |
| `POST` | `/purchases/new` | Registrar compra |
| `GET` | `/purchases/list` | Listar compras |
| `GET` | `/dashboard/summary` | Resumo financeiro |
| `POST` | `/employees/new` | Cadastrar funcionário |
| `GET` | `/employees/list` | Listar funcionários |

---

## 📋 Quadro de Tarefas (TASKS.md)

66 tarefas distribuídas em 7 fases, cada uma com skill Antigravity responsável:

| Fase | 🟢 Críticas | 🟡 Médias | ⚪ Futuras |
|------|:-----------:|:---------:|:---------:|
| F0 - Infraestrutura | 8 concluídas | — | — |
| F1 - PostgreSQL | 4 | 2 | 2 |
| F2 - Backend regras | 6 | 3 | 2 |
| F3 - Docker/CI | 1 | 3 | 2 |
| F4 - Frontend telas | 5 | 4 | 2 |
| F5 - Reatividade | 3 | 3 | 1 |
| F6 - Torre Controle | 4 | 3 | 2 |
| F7 - IA NF-e | 2 | 3 | 1 |
| **Total** | **25** | **21** | **12** |

---

## 👤 Equipe Antigravity (20 Skills)

| Especialidade | Skills |
|--------------|--------|
| 🗄️ Banco de Dados | `database-architect`, `postgres-best-practices`, `database-migration` |
| ⚙️ Backend | `fastapi-pro`, `api-design-principles`, `backend-architect`, `auth-implementation-patterns` |
| 🎨 Frontend | `react-best-practices`, `frontend-developer`, `ui-design-system`, `react-state-management` |
| 🐳 Infraestrutura | `docker-expert`, `cicd-automation-workflow-automate`, `devops-deploy` |
| 🤖 IA | `ai-engineer`, `ai-ml` |
| 🧹 Qualidade | `clean-code`, `code-review-excellence`, `python-testing-patterns` |

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19, TypeScript, Vite 7, TanStack Router, Tailwind CSS 4, shadcn/ui, Recharts |
| Backend | Python 3.12+, FastAPI, SQLAlchemy 2.0, Pydantic v2 |
| Banco | PostgreSQL 15 (produção) / SQLite (desenvolvimento) |
| Infra | Docker, Docker Compose |

---

## 📄 PDFs de Referência

Os PDFs originais com o blueprint completo estão em:
```
A:\Projetos De Aplicativos e Sistemas\Lumina Nexus ERP\
├── Nexus ERP Fase 1.pdf   → Modelagem PostgreSQL
├── Nexus ERP Fase 2.pdf   → FastAPI + SQLAlchemy
├── Nexus ERP Fase 3.pdf   → Docker + automação
├── Nexus ERP Fase 4.pdf   → Frontend + CORS
├── Nexus ERP Fase 5.pdf   → Reatividade
└── Nexus ERP Fase 6.pdf   → Torre de Controle
```
