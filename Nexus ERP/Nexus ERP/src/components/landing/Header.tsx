import { useEffect, useState } from "react";
import { Menu, X, Sparkles, BookOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#modulos", label: "Módulos" },
  { href: "#fases", label: "Fases" },
  { href: "#dashboard", label: "Dashboard" },
  { href: "#planos", label: "Planos" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "border-b border-white/5 bg-background/60 backdrop-blur-2xl py-3"
          : "border-b border-transparent bg-transparent py-5",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow transition-transform group-hover:scale-110">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black leading-none tracking-tighter uppercase italic">
              Nexus ERP
            </span>
            <span className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase opacity-80">
              Lumina Enterprise
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground transition-all hover:text-primary hover:tracking-[0.15em]"
            >
              {l.label}
            </a>
          ))}
          <div className="h-4 w-px bg-white/10" />
          <Link
            to="/documentacao"
            className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest text-muted-foreground transition-all hover:text-primary"
          >
            <BookOpen className="h-4 w-4 text-primary" />
            Docs
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground transition-all hover:text-primary"
          >
            Entrar
          </Link>
          <Button
            asChild
            className="h-10 rounded-xl bg-gradient-primary px-6 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-glow transition-all hover:scale-105 hover:brightness-110 active:scale-95"
          >
            <a href="#contato">Solicitar Demo</a>
          </Button>
        </div>

        <button
          className="relative rounded-xl border border-white/5 bg-white/5 p-2.5 transition-colors hover:bg-white/10 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="animate-in fade-in slide-in-from-top-4 border-t border-white/5 bg-background/95 p-6 backdrop-blur-3xl md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-lg font-bold tracking-tight text-muted-foreground transition-colors hover:text-primary"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/documentacao"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 text-lg font-bold tracking-tight text-muted-foreground transition-colors hover:text-primary"
            >
              <BookOpen className="h-5 w-5" />
              Documentação
            </Link>
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 text-lg font-bold tracking-tight text-muted-foreground transition-colors hover:text-primary"
            >
              Entrar
            </Link>
            <Button
              asChild
              className="mt-4 h-12 w-full rounded-xl bg-gradient-primary text-sm font-bold uppercase tracking-widest shadow-glow"
            >
              <a href="#contato" onClick={() => setOpen(false)}>
                Solicitar Demo
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
