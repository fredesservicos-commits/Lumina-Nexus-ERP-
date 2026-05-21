import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "R$ 499",
    period: "/mês",
    desc: "Para pequenas operações começando com rigor contábil.",
    features: [
      "1 empresa",
      "Até 3 usuários",
      "Financeiro + Compras + Vendas",
      "Plano de contas padrão BR",
      "Suporte por e-mail",
    ],
    highlighted: false,
  },
  {
    name: "Business",
    price: "R$ 1.490",
    period: "/mês",
    desc: "O coração das PMEs brasileiras. Tudo integrado, IA inclusa.",
    features: [
      "Até 3 empresas",
      "Usuários ilimitados",
      "Todos os módulos (RH + Estoque)",
      "IA: leitura de XML de NF-e",
      "Dashboard de rentabilidade",
      "Suporte prioritário",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Sob consulta",
    period: "",
    desc: "Para grupos econômicos com necessidades específicas.",
    features: [
      "Multi-empresa ilimitado",
      "SSO + auditoria avançada",
      "SLA dedicado",
      "Integrações personalizadas",
      "Onboarding assistido",
      "Customer Success dedicado",
    ],
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="planos" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Planos
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Escolha o plano que <span className="text-gradient">acompanha sua empresa</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Sem taxas escondidas. Cancele quando quiser.</p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={cn(
                "relative rounded-2xl border p-7 backdrop-blur transition-all",
                p.highlighted
                  ? "border-primary/40 bg-card/80 shadow-glow lg:-translate-y-2 lg:scale-[1.02]"
                  : "border-border bg-card/40 hover:border-border/80",
              )}
            >
              {p.highlighted && (
                <>
                  <div
                    className="absolute -inset-px rounded-2xl opacity-40 blur-xl"
                    style={{ background: "var(--gradient-primary)" }}
                    aria-hidden
                  />
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground shadow-glow">
                    <Sparkles className="h-3 w-3" />
                    Mais popular
                  </span>
                </>
              )}

              <div className="relative">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight">{p.price}</span>
                  <span className="text-sm text-muted-foreground">{p.period}</span>
                </div>

                <Button
                  asChild
                  className={cn(
                    "mt-6 w-full",
                    p.highlighted
                      ? "bg-gradient-primary text-primary-foreground shadow-glow hover:scale-[1.02]"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                  )}
                >
                  <a href="#contato">
                    {p.name === "Enterprise" ? "Falar com vendas" : "Começar agora"}
                  </a>
                </Button>

                <ul className="mt-7 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          p.highlighted ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      <span className="text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
