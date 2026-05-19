import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Database, Plug, Container, Layout, RefreshCw, LayoutDashboard, Sparkles, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Fase1Content } from "@/components/docs/Fase1Content";
import { Fase2Content } from "@/components/docs/Fase2Content";
import { Fase3Content } from "@/components/docs/Fase3Content";
import { Fase4Content } from "@/components/docs/Fase4Content";
import { Fase5Content } from "@/components/docs/Fase5Content";
import { Fase6Content } from "@/components/docs/Fase6Content";

const TITLE = "Documentação Técnica — Nexus ERP";
const DESCRIPTION =
  "Documentação técnica do Nexus ERP organizada em fases: modelagem PostgreSQL, conexão FastAPI + SQLAlchemy, automação de ambiente com Docker e roadmap de IA.";

export const Route = createFileRoute("/documentacao")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
  component: DocumentacaoPage,
});

type Tab = "fase1" | "fase2" | "fase3" | "fase4" | "fase5" | "fase6";

const tabs: {
  id: Tab;
  n: string;
  title: string;
  subtitle: string;
  icon: typeof Database;
  available: boolean;
}[] = [
  {
    id: "fase1",
    n: "01",
    title: "Fundação",
    subtitle: "Modelagem PostgreSQL",
    icon: Database,
    available: true,
  },
  {
    id: "fase2",
    n: "02",
    title: "Backend",
    subtitle: "FastAPI + SQLAlchemy",
    icon: Plug,
    available: true,
  },
  {
    id: "fase3",
    n: "03",
    title: "Ambiente",
    subtitle: "Docker + automação",
    icon: Container,
    available: true,
  },
  {
    id: "fase4",
    n: "04",
    title: "Frontend",
    subtitle: "HTML + CORS + API",
    icon: Layout,
    available: true,
  },
  {
    id: "fase5",
    n: "05",
    title: "Reatividade",
    subtitle: "Listar e auto-atualizar",
    icon: RefreshCw,
    available: true,
  },
  {
    id: "fase6",
    n: "06",
    title: "Torre de Controle",
    subtitle: "Busca, Compras e Dashboard",
    icon: LayoutDashboard,
    available: true,
  },
];

function DocumentacaoPage() {
  const [active, setActive] = useState<Tab>("fase1");

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Top bar - Ultra thin and glassy */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/40 backdrop-blur-2xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-all hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Voltar
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Nexus Docs</span>
          </div>
        </div>
      </header>

      {/* Hero - More dramatic */}
      <section className="relative overflow-hidden border-b border-white/5 py-16 sm:py-24">
        <div className="bg-grid absolute inset-0 opacity-30" />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
            </span>
            Arquitetura Enterprise
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
            As <span className="text-gradient">6 Fases</span> de construção
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground/80 leading-relaxed">
            Do banco de dados à inteligência artificial — uma jornada técnica em camadas,
            aplicando o rigor do padrão SAP com tecnologias modernas.
          </p>
        </div>
      </section>

      {/* Layout */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
          {/* Sidebar - More sophisticated buttons */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="space-y-3">
              {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = active === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => t.available && setActive(t.id)}
                    disabled={!t.available}
                    className={cn(
                      "group relative flex w-full flex-col gap-1 rounded-xl border p-4 text-left transition-all duration-300",
                      isActive
                        ? "border-primary/40 bg-white/5 shadow-glow shadow-primary/5"
                        : "border-white/5 bg-transparent hover:border-white/20 hover:bg-white/5",
                      !t.available && "cursor-not-allowed opacity-30",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                          isActive
                            ? "bg-gradient-primary text-primary-foreground"
                            : "bg-white/5 text-muted-foreground group-hover:text-primary",
                        )}
                      >
                        {t.available ? <Icon className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      </div>
                      <span className="font-mono text-[9px] font-black text-primary/40 uppercase tracking-tighter">
                        PHASE {t.n}
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-[13px] font-bold uppercase tracking-wide">{t.title}</div>
                      <div className="mt-0.5 truncate text-[11px] text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                        {t.subtitle}
                      </div>
                    </div>

                    {isActive && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-full blur-[2px]" />
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content - Glassy container */}
          <main className="min-w-0">
            <article className="rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-md sm:p-12 lg:p-16 shadow-2xl">
              <header className="mb-10 border-b border-white/5 pb-10">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/20">
                    Fase {tabs.find((t) => t.id === active)?.n}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>
                <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  {tabs.find((t) => t.id === active)?.title} —{" "}
                  <span className="text-gradient">
                    {tabs.find((t) => t.id === active)?.subtitle}
                  </span>
                </h2>
              </header>

              <div className="prose prose-invert prose-primary max-w-none">
                {active === "fase1" && <Fase1Content />}
                {active === "fase2" && <Fase2Content />}
                {active === "fase3" && <Fase3Content />}
                {active === "fase4" && <Fase4Content />}
                {active === "fase5" && <Fase5Content />}
                {active === "fase6" && <Fase6Content />}
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
