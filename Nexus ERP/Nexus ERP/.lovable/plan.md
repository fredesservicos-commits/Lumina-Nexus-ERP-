
# Landing Page — Nexus ERP

Site institucional de uma página apresentando o **Nexus ERP**, um sistema de gestão empresarial com rigor contábil estilo SAP, focado no mercado brasileiro.

## Estilo visual
- **Tema:** corporativo escuro moderno (tipo Linear/Vercel)
- **Paleta:** fundo `#0A0E1A` (quase preto azulado), superfícies `#111827`, primária azul elétrico `#3B82F6` com gradiente para roxo `#8B5CF6`, texto branco/cinza claro
- **Tipografia:** Inter (sem-serifa), títulos grandes e ousados
- **Detalhes:** gradientes sutis nos CTAs, glow em hover, cards com borda fina translúcida, grid de fundo discreto no hero
- **Idioma:** 100% Português BR

## Estrutura (página única com âncoras de scroll suave)

1. **Header fixo** — logo "Nexus ERP", navegação (Módulos, Fases, Dashboard, Planos, FAQ), botão "Solicitar Demo"

2. **Hero**
   - Título: *"O ERP que une rigor contábil com inteligência operacional"*
   - Subtítulo sobre os 100% da empresa (Financeiro, Compras, Vendas, RH) com automação por IA
   - CTAs: "Solicitar Demo" + "Ver Módulos"
   - Visual: mockup ilustrado de dashboard ao lado / grid sutil ao fundo

3. **Módulos do ERP** (6 cards com ícones)
   - Financeiro (estrutura SAP — partidas dobradas, plano de contas, ledger)
   - Compras (lançamento contábil automático Estoque ↔ Contas a Pagar)
   - Vendas (proteção de margem, limite de crédito, Nexus Intelligence)
   - RH (custo real brasileiro: salário + encargos + provisões 13º/férias)
   - Estoque & Produtos (SKU, custo médio, movimentação)
   - IA & Automação (leitura de XML de NF-e, auto-posting)

4. **Diferenciais / Por que Nexus** (3-4 blocos)
   - Rigor contábil de verdade · Visão 100% da empresa · IA elimina burocracia · Multi-empresa nativo

5. **Como funciona — As 4 Fases** (timeline vertical)
   - Fase 1: Fundação (Banco PostgreSQL)
   - Fase 2: Backend (FastAPI + regras de negócio)
   - Fase 3: Interface (telas conectadas às APIs)
   - Fase 4: IA (leitura automática de notas)

6. **Dashboard Preview** — mockup visual do "Dashboard de Rentabilidade" com cards de Receita, Custo de Compras, Custo RH, Lucro Líquido e Margem %

7. **Planos** (3 colunas: Starter / Business / Enterprise)
   - Cada plano com preço fictício, lista de recursos, CTA. Plano do meio em destaque com gradiente.

8. **FAQ** (accordion com 6-8 perguntas: o que é, suporte SPED, integração NF-e, multi-empresa, segurança, implantação, etc.)

9. **CTA final + Formulário de contato** (visual apenas)
   - Campos: Nome, Empresa, E-mail, Telefone, Mensagem
   - Botão "Solicitar Demonstração" → mostra toast de sucesso

10. **Footer** — logo, links, copyright, redes sociais

## Arquitetura técnica
- Página única em `src/routes/index.tsx` (substituindo o placeholder) com âncoras `#modulos`, `#fases`, `#planos`, `#faq` para navegação por scroll
- Componentes em `src/components/landing/` (Header, Hero, Modules, Differentials, Phases, DashboardPreview, Pricing, FAQ, ContactForm, Footer)
- Tema escuro definido como padrão em `src/styles.css` via tokens HSL semânticos (background, foreground, primary, accent, etc.)
- Ícones: `lucide-react` (já incluído via shadcn)
- Componentes shadcn: Button, Card, Accordion, Input, Textarea, Label
- Toast de sucesso via Sonner
- Meta tags PT-BR em `head()` (title, description, og:title, og:description) na rota index
- Totalmente responsivo (mobile-first, viewport 379px funcionando perfeitamente)
- Sem backend — formulário apenas dispara feedback visual
