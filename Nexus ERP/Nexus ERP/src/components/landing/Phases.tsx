import { Database, Server, Layout, Sparkles } from "lucide-react";

const phases = [
  {
    n: "01",
    icon: Database,
    title: "Fundação",
    subtitle: "Banco PostgreSQL",
    desc: "Modelagem completa: companies, partners, plano de contas, ledger, produtos, documentos, funcionários e roles. RLS por empresa.",
  },
  {
    n: "02",
    icon: Server,
    title: "Backend",
    subtitle: "FastAPI + regras de negócio",
    desc: "APIs REST com validação Pydantic, regras de partidas dobradas, cálculo de encargos brasileiros e provisões mensais.",
  },
  {
    n: "03",
    icon: Layout,
    title: "Interface",
    subtitle: "Telas conectadas às APIs",
    desc: "Dashboard de rentabilidade, telas operacionais de Compras/Vendas/RH e relatórios contábeis exportáveis.",
  },
  {
    n: "04",
    icon: Sparkles,
    title: "Inteligência",
    subtitle: "IA para leitura de notas",
    desc: "Parsing de XML de NF-e, classificação contábil automática, sugestão de margem e detecção de anomalias.",
  },
];

export function Phases() {
  return (
    <section id="fases" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Roadmap
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Como funciona — <span className="text-gradient">As 4 Fases</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Construção sólida, em camadas, sem atalhos.</p>
        </div>

        <ol className="relative mt-14 space-y-8 before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-primary/60 before:via-accent/40 before:to-transparent sm:before:left-8">
          {phases.map((p) => {
            const Icon = p.icon;
            return (
              <li key={p.n} className="relative pl-16 sm:pl-20">
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card shadow-glow sm:h-16 sm:w-16">
                  <Icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                </div>
                <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur sm:p-6">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-xs font-mono font-semibold text-accent">FASE {p.n}</span>
                    <h3 className="text-lg font-semibold sm:text-xl">{p.title}</h3>
                    <span className="text-sm text-muted-foreground">— {p.subtitle}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
