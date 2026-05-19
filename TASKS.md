# Nexus ERP — Quadro de Tarefas da Equipe

## Legenda

| Ícone | Significado |
|-------|-------------|
| 🟢 | Must-have (prioridade crítica) |
| 🟡 | Nice-to-have (prioridade média) |
| ⚪ | Futuro (baixa prioridade) |
| 👤 | Skill Antigravity responsável |

---

## Fase 0: Infraestrutura e Setup (JÁ EXECUTADO)

| # | Tarefa | Status | Responsável |
|---|--------|--------|-------------|
| 0.1 | Estrutura do projeto front-end (Vite + React + TanStack Router) | ✅ Concluído | react-best-practices |
| 0.2 | Componentes shadcn/ui + tema escuro | ✅ Concluído | ui-design-system |
| 0.3 | Landing page institucional | ✅ Concluído | react-ui-patterns |
| 0.4 | Backend FastAPI + SQLAlchemy estrutural | ✅ Concluído | fastapi-pro |
| 0.5 | Modelos de dados (companies, products, documents, ledger, etc.) | ✅ Concluído | database-architect |
| 0.6 | Docker Compose (PostgreSQL + Backend) | ✅ Concluído | docker-expert |
| 0.7 | Rotas do app: Dashboard, Vendas, Compras, RH, Relatórios | ✅ Concluído | frontend-developer |
| 0.8 | Hooks de API (useSales, usePurchases, useDashboard) | ✅ Concluído | api-design-principles |

---

## Fase 1: Fundação — Banco de Dados PostgreSQL (REFINAMENTO)

👤 **Skill líder:** `database-architect`
👤 **Apoio:** `database-migration`, `postgres-best-practices`, `database-design`

| # | Tarefa | Prioridade | Descrição |
|---|--------|------------|-----------|
| 1.1 | 🔒 Migrar de SQLite para PostgreSQL em produção | 🟢 | Configurar DATABASE_URL via env var, testar com pg8000 |
| 1.2 | 🔒 Adicionar migrations com Alembic | 🟢 | Versionamento do schema: `alembic init` + scripts automáticos |
| 1.3 | 🔒 Índices de performance | 🟢 | Índices em `tax_id`, `sku`, `doc_type`, `company_id`, `created_at` |
| 1.4 | 🔒 Row-Level Security (RLS) por empresa | 🟢 | Isolamento multi-tenant: cada company vê só seus dados |
| 1.5 | 🟡 Constraints de integridade contábil | 🟡 | CHECK nas partidas dobradas (debit/credit nunca negativos, soma = 0) |
| 1.6 | 🟡 Seed data para testes | 🟡 | Script com company, plano de contas, produtos, parceiros fictícios |
| 1.7 | ⚪ Audit triggers | ⚪ | Triggers `updated_at` e log de alterações em tabelas sensíveis |
| 1.8 | ⚪ Backup automático | ⚪ | Script agendado de `pg_dump` com rotação |

**Critério de aceite:** Rodar `alembic upgrade head` cria todas as tabelas; RLS funciona; consultas com filtro por company_id usam índices.

---

## Fase 2: Backend — FastAPI + Regras de Negócio (REFINAMENTO)

👤 **Skill líder:** `fastapi-pro`
👤 **Apoio:** `api-design-principles`, `backend-architect`, `python-testing-patterns`, `auth-implementation-patterns`, `clean-code`

| # | Tarefa | Prioridade | Descrição |
|---|--------|------------|-----------|
| 2.1 | 🔒 Autenticação JWT (login/register) | 🟢 | `POST /auth/login`, `POST /auth/register`, middleware de proteção |
| 2.2 | 🔒 RBAC (roles: admin, gerente, operador) | 🟢 | Decorator `require_role("admin")`, controle por endpoint |
| 2.3 | 🔒 Regra de partidas dobradas | 🟢 | `POST /ledger/entries`: valida que débito = crédito antes de salvar |
| 2.4 | 🔒 Cálculo de encargos brasileiros | 🟢 | Endpoint `POST /payroll/calculate`: INSS, FGTS, IRRF, 13º, férias |
| 2.5 | 🔒 Módulo de Compras completo | 🟢 | Criação de pedido → lançamento contábil automático (Estoque ↔ Contas a Pagar) |
| 2.6 | 🔒 Módulo de Vendas completo | 🟢 | Proteção de margem, limite de crédito do parceiro |
| 2.7 | 🟡 Testes automatizados (pytest) | 🟡 | Testes unitários + integração com banco de testes |
| 2.8 | 🟡 Validação de CNPJ/CPF | 🟡 | Função de validação com dígitos verificadores |
| 2.9 | 🟡 Paginação em listagens | 🟡 | `?page=1&per_page=20` com metadados (total, pages) |
| 2.10 | ⚪ WebSocket para notificações em tempo real | ⚪ | Notificar frontend quando uma venda for criada |
| 2.11 | ⚪ Rate limiting por usuário | ⚪ | Proteção contra abuso por IP/token |

**Critério de aceite:** `pytest` passa; login + JWT protege rotas; partidas dobradas nunca quebram; cálculo de RH está correto.

---

## Fase 3: Ambiente — Docker + Automação

👤 **Skill líder:** `docker-expert`
👤 **Apoio:** `cicd-automation-workflow-automate`, `devops-deploy`, `deployment-engineer`

| # | Tarefa | Prioridade | Descrição |
|---|--------|------------|-----------|
| 3.1 | 🔒 Docker Compose multi-serviço | 🟢 | `docker-compose up` sobe PostgreSQL + Backend + (futuro) Nginx |
| 3.2 | 🟡 Script de setup 1-clique | 🟡 | `scripts/setup.sh` + `scripts/setup.bat` que instalam deps + sobem tudo |
| 3.3 | 🟡 Dockerfile otimizado (multi-stage) | 🟡 | Build smaller images com cache de camadas Python |
| 3.4 | 🟡 Healthchecks nos containers | 🟡 | PostgreSQL healthcheck + backend depende dele |
| 3.5 | ⚪ CI/CD com GitHub Actions | ⚪ | Rodar lint + testes + build em cada PR |
| 3.6 | ⚪ Deploy automatizado | ⚪ | Push na main → deploy em VPS ou cloud |

**Critério de aceite:** `docker-compose up` → sistema completo rodando em < 30s.

---

## Fase 4: Frontend — Telas Conectadas às APIs

👤 **Skill líder:** `frontend-developer`
👤 **Apoio:** `react-best-practices`, `ui-design-system`, `react-ui-patterns`, `frontend-design`, `react-state-management`

| # | Tarefa | Prioridade | Descrição |
|---|--------|------------|-----------|
| 4.1 | 🔒 Integrar login no frontend | 🟢 | Tela de login + token storage + redirect |
| 4.2 | 🔒 Tela de Vendas (CRUD completo) | 🟢 | Lista, cadastro, edição, filtro por data/cliente |
| 4.3 | 🔒 Tela de Compras (CRUD completo) | 🟢 | Lista, cadastro, edição, vínculo com NF-e |
| 4.4 | 🔒 Tela de RH (funcionários + custos) | 🟢 | Cadastro, cálculo automático de encargos, provisões |
| 4.5 | 🔒 Dashboard de Rentabilidade ao vivo | 🟢 | Cards + gráficos puxando da API em tempo real |
| 4.6 | 🟡 Tabelas com sorting e paginação | 🟡 | Ordenar por coluna, navegação entre páginas |
| 4.7 | 🟡 Formulário multi-etapa para vendas | 🟡 | Wizard: selecionar cliente → adicionar itens → confirmar |
| 4.8 | 🟡 Pesquisa global (command palette) | 🟡 | `Cmd+K` para buscar clientes, produtos, documentos |
| 4.9 | 🟡 Modo escuro/claro | 🟡 | Toggle de tema com persistência |
| 4.10 | ⚪ PWA (instalável como app) | ⚪ | Service worker + manifest.json |
| 4.11 | ⚪ Versão mobile responsiva | ⚪ | Layout adaptado para celular |

**Critério de aceite:** CRUD funcional em todas as telas; dados refletem o backend em tempo real; dashboard atualiza automaticamente.

---

## Fase 5: Reatividade — Listar e Auto-atualizar

👤 **Skill líder:** `react-best-practices`
👤 **Apoio:** `react-state-management`, `api-patterns`, `performance-optimizer`

| # | Tarefa | Prioridade | Descrição |
|---|--------|------------|-----------|
| 5.1 | 🔒 Cache de queries com TanStack Query | 🟢 | Substituir `useEffect` + `fetch` por `useQuery` + `useMutation` |
| 5.2 | 🔒 Refetch automático ao focar a janela | 🟢 | `refetchOnWindowFocus: true` — dados sempre frescos |
| 5.3 | 🔒 Estado de loading e erro globais | 🟢 | Skeleton loading + toasts de erro centralizados |
| 5.4 | 🟡 Mutations otimistas (Optimistic UI) | 🟡 | UI atualiza instantaneamente, depois sincroniza com backend |
| 5.5 | 🟡 Atualização em tempo real via polling | 🟡 | Dashboard recarrega a cada 30s automaticamente |
| 5.6 | 🟡 Indicador de "salvo" / "não salvo" | 🟡 | Badge nos formulários indicando estado da persistência |
| 5.7 | ⚪ WebSocket para dados em tempo real | ⚪ | Backend empurra atualizações sem polling |

**Critério de aceite:** TanStack Query implementado em todas as queries; loading/error states visíveis; refetch automático funcionando.

---

## Fase 6: Torre de Controle — Busca, Compras e Dashboard

👤 **Skill líder:** `frontend-developer`
👤 **Apoio:** `react-flow-architect`, `ui-design-system`, `api-design-principles`, `database-architect`

| # | Tarefa | Prioridade | Descrição |
|---|--------|------------|-----------|
| 6.1 | 🔒 Busca full-text em vendas/compras | 🟢 | Campo de busca com debounce + resultados instantâneos |
| 6.2 | 🔒 Dashboard financeiro completo | 🟢 | Receita, Custo, Lucro, Margem % + metas |
| 6.3 | 🔒 Filtros combinados (data + status + parceiro) | 🟢 | Filtros em cascata na listagem de documentos |
| 6.4 | 🔒 Lançamento contábil automático | 🟢 | Ao criar venda/compra → ledger é populado automaticamente |
| 6.5 | 🟡 Gráfico de série temporal (Receita vs Custo) | 🟡 | Evolução diária/semanal/mensal com Recharts |
| 6.6 | 🟡 Exportar relatório em CSV/PDF | 🟡 | Botão de exportação nas listagens |
| 6.7 | 🟡 Dashboard multi-empresa | 🟡 | Seletor de empresa no topo, dados isolados |
| 6.8 | ⚪ Alertas de margem baixa | ⚪ | Notificação visual quando margem < threshold |
| 6.9 | ⚪ Previsão de fluxo de caixa | ⚪ | Projeção com base em contas a pagar/receber |

**Critério de aceite:** Busca retorna em < 500ms; dashboard mostra dados reais do banco; lançamento contábil é automático e auditável.

---

## Fase 7: IA — Leitura Automática de NF-e (DIFERENCIAL)

👤 **Skill líder:** `ai-engineer`
👤 **Apoio:** `python-patterns`, `fastapi-pro`, `database-architect`

| # | Tarefa | Prioridade | Descrição |
|---|--------|------------|-----------|
| 7.1 | 🔒 Upload e parsing de XML de NF-e | 🟢 | Endpoint `POST /nfe/upload`: extrai dados do XML |
| 7.2 | 🔒 Classificação contábil automática | 🟢 | ML mapeia CFOP/NCM → conta contábil correta |
| 7.3 | 🟡 Sugestão de margem por produto | 🟡 | Preço de venda sugerido com base em custo + markup |
| 7.4 | 🟡 Detecção de anomalias | 🟡 | Alertar se NF-e tem valor muito acima/dentro do esperado |
| 7.5 | 🟡 Validação fiscal (SPED) | 🟡 | Conferir se documento atende requisitos Fisco |
| 7.6 | ⚪ OCR para NF-e escaneada (PDF/imagem) | ⚪ | Usar Tesseract/OCR para notas sem XML |

**Critério de aceite:** Upload de XML → dados extraídos → classificação contábil → lançamento no ledger sem intervenção manual.

---

## Resumo de Prioridades

| Fase | Tarefas Críticas 🟢 | Tarefas Médias 🟡 | Tarefas Futuras ⚪ |
|------|--------------------|--------------------|---------------------|
| F1 - Banco | 4 | 2 | 2 |
| F2 - Backend | 6 | 3 | 2 |
| F3 - Docker | 1 | 3 | 2 |
| F4 - Frontend | 5 | 4 | 2 |
| F5 - Reatividade | 3 | 3 | 1 |
| F6 - Torre | 4 | 3 | 2 |
| F7 - IA | 2 | 3 | 1 |
| **Total** | **25** | **21** | **12** |

---

## Skills Antigravity por Especialidade

| Área | Skill Responsável | Membros da Equipe |
|------|-------------------|-------------------|
| 🗄️ Banco de Dados | `database-architect` | `postgres-best-practices`, `database-migration`, `database-design` |
| ⚙️ Backend | `fastapi-pro` | `api-design-principles`, `backend-architect`, `auth-implementation-patterns`, `python-testing-patterns` |
| 🐳 Infraestrutura | `docker-expert` | `cicd-automation-workflow-automate`, `devops-deploy` |
| 🎨 Frontend | `frontend-developer` | `react-best-practices`, `ui-design-system`, `react-state-management`, `react-ui-patterns` |
| 🤖 IA | `ai-engineer` | `python-patterns`, `fastapi-pro` |
| 🧹 Qualidade | `clean-code` | `python-testing-patterns`, `code-review-excellence` |

---

## Como Usar

1. Cada membro da equipe carrega sua skill Antigravity:
   ```
   👤 `database-architect` → Trabalha nas tarefas F1
   👤 `frontend-developer` → Trabalha nas tarefas F4, F6
   👤 `fastapi-pro` → Trabalha nas tarefas F2, F7
   ```

2. Tarefas 🟢 são **must-have** para o MVP — priorize essas primeiro.

3. Ao finalizar uma tarefa, marque como concluída e mova para a próxima.

4. Commits devem referenciar o número da tarefa (ex: `feat: adiciona autenticação JWT (#2.1)`).
