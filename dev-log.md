# 📋 Dev Log — Nexus ERP

## ✅ O que Funciona
- Modelos de precificação para bakery/confectionery.
- Estrutura de gestão de produtos e serviços.

## ❌ O que Não Funciona
- ~~Cadastro de Cliente: O app apresenta congelamento de tela e travamentos durante o teste do serviço.~~ **RESOLVIDO** — vide Gotcha abaixo.
- ~~App trava completamente — impossível clicar em qualquer botão (ex: solicitar demo no dashboard).~~ **RESOLVIDO** — vide Gotcha abaixo.

## 💡 Padrões Descobertos
- Uso de modelos de dados robustos (Excel/Sheets para cálculo, integração PWA).

## 📋 Decisões de Arquitetura
- Centralização de dados financeiros do Grupo Fredes.

## ⚠️ Gotchas
- [2026-05-25] Identificado travamento crítico no fluxo de "Cadastro de Cliente" no Lumina Nexus ERP ao realizar testes de serviço. Investigar possível falha de persistência de dados ou conflito de API no front-end.
- [2026-05-25] **CAUSA RAIZ**: O endpoint `GET /sales/list` (back-end FastAPI) retornava um objeto paginado `{ data: [...], total, page, per_page }`, mas o front-end (`useSalesList` hook + `app.vendas.tsx`) esperava um array `Sale[]`. Isso fazia `sales?.filter()` lançar "sales.filter is not a function", derrubando o componente React — resultando em tela branca/congelamento.
- [2026-05-25] **CORREÇÃO**: (1) Back-end: `/sales/list` agora retorna `list[SaleResponse]` diretamente, sem paginação (remoção do `paginate()` e dos parâmetros `page`/`per_page`). (2) Front-end: `handleSubmit` e `saveEdit` em `app.vendas.tsx` agora possuem blocos `try/catch` para evitar unhandled promise rejections.
- [2026-05-25] **NOVA INVESTIGAÇÃO — TRAVAMENTO GLOBAL**: Usuário reportou que o app congela completamente, impossibilitando qualquer ação (inclusive botões na landing page). Investigação revelou 3 causas raiz:
  - **(A) Spinner full-screen no `AppLayout`**: `src/routes/app.tsx` substituía sidebar + conteúdo por um `<Loader2>` tela-cheia sempre que `user` transitava por `null`. Firebase `onAuthStateChanged` pode emitir `null` durante inicialização/expiracão de token, fazendo a UI sumir completamente.
  - **(B) Race condition no redirect**: `useRef(redirected)` causava falha no redirect para `/login` no StrictMode do React 19 (o ref persistia entre as duas montagens, impedindo o segundo redirect). Usuário ficava preso no spinner infinito.
  - **(C) Callback assíncrono sem cancellation**: `onAuthChange` recebia um callback `async` mas o Firebase não espera a Promise. Se `buildAuthUser()` falhasse (ex: `getIdToken` timeout), o erro caía em unhandled rejection e corrompia o estado do `AuthProvider`.
- [2026-05-25] **CORREÇÃO (Travamento Global)**:
  - **(A)** `app.tsx`: Substituído spinner full-screen por `return null` — não bloqueia mais a UI. Removido `useRef(redirected)` — agora usa `navigate({ to: "/login", replace: true })` diretamente no `useEffect`.
  - **(B)** `auth.tsx`: Adicionado flag `mounted` para cancelar operações assíncronas após desmontagem. Timeout de ready aumentado de 3s para 5s.
  - **(C)** `app.index.tsx`: Timeout de erro do dashboard reduzido de 15s para 8s, dando feedback mais rápido ao usuário.