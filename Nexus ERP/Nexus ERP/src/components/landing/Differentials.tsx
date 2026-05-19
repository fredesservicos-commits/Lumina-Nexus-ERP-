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
    <section className="relative border-y border-border bg-card/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Por que Nexus
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Construído para quem leva{" "}
            <span className="text-gradient">contabilidade a sério</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <div
                key={it.title}
                className="rounded-2xl border border-border bg-background/40 p-6 transition-all hover:border-accent/40"
              >
                <Icon className="h-6 w-6 text-accent" />
                <h3 className="mt-4 text-base font-semibold">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {it.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
