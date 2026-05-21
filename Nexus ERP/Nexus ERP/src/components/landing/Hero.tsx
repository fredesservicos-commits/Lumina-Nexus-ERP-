import { ArrowRight, BarChart3, TrendingUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-44 sm:pb-32">
      {/* Background grid + dynamic glow */}
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />

      {/* Animated background blobs for depth */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-[150px] animate-pulse [animation-delay:2s]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/30 px-3.5 py-1 text-xs font-semibold text-muted-foreground backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-glow"></span>
              </span>
              Nova era da gestão empresarial brasileira
            </div>

            <h1 className="mt-8 text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              O ERP que une <span className="text-gradient">rigor contábil</span> com{" "}
              <span className="text-gradient">IA operacional</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground/90 sm:text-xl">
              Visão de 100% da empresa — Financeiro, Compras, Vendas, RH e Estoque integrados com
              partidas dobradas e automação inteligente. Estrutura SAP, feita para o Brasil.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 bg-gradient-primary px-8 text-sm font-bold text-primary-foreground shadow-glow transition-all hover:scale-105 hover:brightness-110"
              >
                <a href="#contato">
                  Solicitar Demo <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-border bg-card/30 px-8 text-sm font-semibold backdrop-blur-md transition-all hover:bg-card/50"
              >
                <a href="#modulos">Ver Módulos</a>
              </Button>
            </div>

            <dl className="mt-14 grid grid-cols-3 gap-8 border-t border-border pt-10">
              {[
                { v: "100%", l: "Visão da empresa" },
                { v: "6", l: "Módulos integrados" },
                { v: "IA", l: "Auto-lançamento NF-e" },
              ].map((s) => (
                <div key={s.l} className="group cursor-default">
                  <dt className="text-3xl font-bold text-gradient transition-all group-hover:scale-110 origin-left">
                    {s.v}
                  </dt>
                  <dd className="mt-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                    {s.l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Dashboard mockup with layered floating elements */}
          <div className="relative lg:ml-10">
            <div className="animate-float">
              <div className="relative rounded-2xl border border-white/10 bg-card/40 p-4 shadow-2xl backdrop-blur-2xl sm:p-6 lg:p-8">
                <div className="flex items-center gap-1.5 pb-6">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-destructive/40" />
                    <div className="h-3 w-3 rounded-full bg-warning/40" />
                    <div className="h-3 w-3 rounded-full bg-success/40" />
                  </div>
                  <div className="ml-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    nexus.app — Enterprise Dashboard
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <MiniCard
                    icon={<Wallet className="h-4 w-4" />}
                    label="Receita Mensal"
                    value="R$ 1.248.000"
                    trend="+18,4%"
                    color="primary"
                  />
                  <MiniCard
                    icon={<TrendingUp className="h-4 w-4" />}
                    label="Lucro Líquido"
                    value="R$ 312.450"
                    trend="+9,1%"
                    color="accent"
                  />
                </div>

                <div className="mt-4 rounded-xl border border-white/5 bg-background/30 p-5 backdrop-blur-md">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <BarChart3 className="h-3.5 w-3.5" />
                      </div>
                      Fluxo de Caixa (Mensal)
                    </div>
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success border border-success/20">
                      SAUDÁVEL
                    </span>
                  </div>
                  <div className="flex h-32 items-end gap-2">
                    {[30, 45, 38, 60, 52, 70, 62, 80, 75, 85, 78, 100].map((h, i) => (
                      <div key={i} className="group relative flex-1">
                        <div
                          className="w-full rounded-t-sm bg-gradient-to-t from-primary/20 to-primary transition-all duration-500 hover:brightness-125"
                          style={{ height: `${h}%` }}
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card px-1.5 py-0.5 rounded text-[10px] border border-border">
                          {h}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Overlapping floating elements */}
            <div className="absolute -bottom-6 -left-12 hidden lg:block animate-float-delayed">
              <div className="glass rounded-xl p-4 shadow-elegant">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center text-success">
                    <span className="text-xs font-bold">NF-e</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Última Leitura
                    </div>
                    <div className="text-xs font-semibold">Nota #8942 — R$ 4.290</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-10 -right-8 hidden lg:block animate-float">
              <div className="glass rounded-xl p-4 shadow-glow">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <div className="text-[10px] font-bold uppercase tracking-widest">
                    IA Nexus Ativa
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniCard({
  icon,
  label,
  value,
  trend,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  color: "primary" | "accent";
}) {
  return (
    <div className="group relative rounded-xl border border-white/5 bg-background/20 p-5 transition-all hover:bg-background/40 hover:border-white/10">
      <div
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg shadow-sm transition-transform group-hover:scale-110 ${
          color === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
        }`}
      >
        {icon}
      </div>
      <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
        {label}
      </div>
      <div className="mt-1 text-xl font-extrabold tracking-tight">{value}</div>
      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-success">
        <TrendingUp className="h-3 w-3" />
        {trend}
      </div>
    </div>
  );
}
