import { ShieldCheck, Eye, Bot, Building2 } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Rigor contábil de verdade",
    desc: "Partidas dobradas obrigatórias, ledger imutável e plano de contas auditável. Pronto para SPED.",
  },
  {
    icon: Eye,
    title: "Visão 100% da empresa",
    desc: "Receita, custo de compras, custo de RH, margem e lucro — tudo em um único dashboard em tempo real.",
  },
  {
    icon: Bot,
    title: "IA elimina burocracia",
    desc: "Leitura de XML, classificação automática e sugestões inteligentes. Seu time foca no que importa.",
  },
  {
    icon: Building2,
    title: "Multi-empresa nativo",
    desc: "Gerencie várias empresas com isolamento total de dados via RLS. Consolidação na ponta dos dedos.",
  },
];

export function Differentials() {
  return (
    <section id="diferenciais" className="relative border-y border-border bg-card/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Por que Nexus
          </span>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Construído para quem leva <span className="text-gradient">contabilidade a sério</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <div
                key={it.title}
                className="group rounded-2xl border border-white/5 bg-background/40 p-8 backdrop-blur-md transition-all hover:bg-card/40 hover:border-primary/30 hover:translate-y-[-4px]"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary transition-all group-hover:bg-gradient-primary group-hover:text-primary-foreground group-hover:shadow-glow">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold tracking-tight">{it.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground/80 group-hover:text-muted-foreground transition-colors">{it.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
