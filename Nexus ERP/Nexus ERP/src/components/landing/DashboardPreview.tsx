import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Package2,
  Users2,
  Wallet,
  Percent,
} from "lucide-react";

const kpis = [
  { label: "Receita", value: "R$ 1.248.300", trend: "+18,4%", up: true, icon: DollarSign },
  { label: "Custo de Compras", value: "R$ 482.110", trend: "+6,2%", up: false, icon: Package2 },
  { label: "Custo RH", value: "R$ 287.450", trend: "+2,1%", up: false, icon: Users2 },
  { label: "Lucro Líquido", value: "R$ 312.870", trend: "+9,1%", up: true, icon: Wallet },
  { label: "Margem %", value: "26,1%", trend: "+1,4 p.p.", up: true, icon: Percent },
];

export function DashboardPreview() {
  return (
    <section id="dashboard" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-accent/5 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            Visão Executiva
          </div>
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            O pulso da sua empresa em <span className="text-gradient">tempo real</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground/80">
            Números auditáveis, extraídos diretamente do ledger contábil. A precisão do SAP com a
            agilidade da era da IA.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="absolute -inset-4 rounded-3xl bg-primary/10 opacity-20 blur-3xl pointer-events-none" />

          <div className="relative rounded-3xl border border-white/5 bg-card/10 p-4 shadow-2xl backdrop-blur-3xl sm:p-8 lg:p-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {kpis.map((k, i) => {
                const Icon = k.icon;
                const Trend = k.up ? ArrowUpRight : ArrowDownRight;
                return (
                  <div
                    key={k.label}
                    className="group relative rounded-2xl border border-white/5 bg-background/20 p-5 transition-all hover:bg-background/40 hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          k.up
                            ? "bg-success/10 text-success border border-success/20"
                            : "bg-warning/10 text-warning border border-warning/20"
                        }`}
                      >
                        <Trend className="mr-0.5 h-3 w-3" />
                        {k.trend}
                      </span>
                    </div>
                    <div className="mt-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      {k.label}
                    </div>
                    <div className="mt-1 text-xl font-bold tracking-tight">{k.value}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/5 bg-background/20 p-6 lg:col-span-2">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest">
                      Performance Consolidada
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Receita vs Custos Operacionais (2025)
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.1em]">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      Receita
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-accent" />
                      Custos
                    </span>
                  </div>
                </div>

                <div className="flex h-52 items-end gap-3">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const r = 40 + ((i * 7) % 55);
                    const c = 25 + ((i * 5) % 35);
                    return (
                      <div key={i} className="group relative flex flex-1 items-end gap-1">
                        <div
                          className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/20 to-primary transition-all group-hover:brightness-125"
                          style={{ height: `${r}%` }}
                        />
                        <div
                          className="flex-1 rounded-t-sm bg-gradient-to-t from-accent/20 to-accent transition-all group-hover:brightness-125"
                          style={{ height: `${c}%` }}
                        />
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card px-2 py-1 rounded text-[10px] border border-white/10 z-10 whitespace-nowrap">
                          Mês {i + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-background/20 p-6">
                <h4 className="text-sm font-bold uppercase tracking-widest">Alocação de Capital</h4>
                <p className="mb-8 text-xs text-muted-foreground">Principais rubricas de despesa</p>

                <div className="space-y-6">
                  {[
                    { l: "Compras & Mercadorias", v: 56, c: "bg-primary" },
                    { l: "Folha & Encargos", v: 33, c: "bg-accent" },
                    { l: "Despesas Operacionais", v: 11, c: "bg-success" },
                  ].map((b) => (
                    <div key={b.l} className="group">
                      <div className="mb-2 flex justify-between items-end">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                          {b.l}
                        </span>
                        <span className="text-sm font-bold">{b.v}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/5 border border-white/5">
                        <div
                          className={`h-full ${b.c} transition-all duration-1000 group-hover:brightness-125 shadow-glow`}
                          style={{ width: `${b.v}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 rounded-xl bg-white/5 p-4 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Percent className="h-4 w-4" />
                    </div>
                    <div className="text-[11px] font-semibold leading-tight text-muted-foreground">
                      Margem bruta consolidada: <span className="text-foreground">44.0%</span>
                    </div>
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
