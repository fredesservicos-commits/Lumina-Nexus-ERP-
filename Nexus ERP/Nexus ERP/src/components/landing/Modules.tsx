import {
  Calculator,
  ShoppingCart,
  TrendingUp,
  Users,
  Package,
  Brain,
  ArrowRight,
} from "lucide-react";

const modules = [
  {
    icon: Calculator,
    title: "Financeiro",
    desc: "Estrutura SAP com partidas dobradas, plano de contas hierárquico e ledger imutável. Cada lançamento, balanceado.",
  },
  {
    icon: ShoppingCart,
    title: "Compras",
    desc: "Recebimento de NF-e gera lançamento automático: Estoque ↔ Contas a Pagar. Custo médio atualizado em tempo real.",
  },
  {
    icon: TrendingUp,
    title: "Vendas",
    desc: "Proteção de margem, limite de crédito por cliente e Nexus Intelligence para sugerir o melhor preço de venda.",
  },
  {
    icon: Users,
    title: "RH",
    desc: "Custo real brasileiro: salário, encargos (INSS, FGTS), provisões mensais de 13º (1/12) e férias (1/12 + 1/3).",
  },
  {
    icon: Package,
    title: "Estoque & Produtos",
    desc: "Gestão de SKU, custo médio ponderado, movimentações entradas/saídas e rastreabilidade fiscal completa.",
  },
  {
    icon: Brain,
    title: "IA & Automação",
    desc: "Leitura automática de XML de NF-e, classificação contábil sugerida e auto-posting com revisão humana.",
  },
];

export function Modules() {
  return (
    <section id="modulos" className="relative overflow-hidden py-24 sm:py-32">
      {/* Background glow for the section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Arquitetura de Dados
          </div>
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Seis módulos. Uma única{" "}
            <span className="text-gradient">verdade contábil</span>.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground/80">
            Tudo conectado ao ledger imutável. Sem planilhas paralelas, sem retrabalho,
            sem dúvida sobre a integridade do seu dado.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => {
            const Icon = m.icon;
            return (
              <div
                key={m.title}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-card/20 p-8 backdrop-blur-md transition-all hover:bg-card/40 hover:border-primary/30 hover:translate-y-[-4px]"
              >
                {/* Individual card glow */}
                <div
                  className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-all duration-500 group-hover:opacity-20 group-hover:scale-150"
                  style={{ background: "var(--gradient-primary)" }}
                  aria-hidden
                />
                
                <div className="relative">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary shadow-sm transition-all group-hover:bg-gradient-primary group-hover:text-primary-foreground group-hover:shadow-glow">
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <div className="mt-6 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-primary/50 font-mono">0{i+1}</span>
                    <h3 className="text-xl font-bold tracking-tight">{m.title}</h3>
                  </div>
                  
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground/80 group-hover:text-muted-foreground transition-colors">
                    {m.desc}
                  </p>
                  
                  <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 translate-x-[-10px] transition-all group-hover:opacity-100 group-hover:translate-x-0">
                    Detalhes do Módulo <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
