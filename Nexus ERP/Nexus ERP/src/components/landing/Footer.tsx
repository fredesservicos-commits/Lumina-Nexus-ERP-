import { Sparkles, Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <a href="#top" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-base font-bold">Nexus ERP</span>
            </a>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              ERP brasileiro com rigor contábil estilo SAP e inteligência operacional
              por IA. Construído para gestores que exigem precisão.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[Linkedin, Twitter, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  aria-label="Rede social"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Produto"
            links={[
              { l: "Módulos", h: "#modulos" },
              { l: "Dashboard", h: "#dashboard" },
              { l: "Planos", h: "#planos" },
              { l: "FAQ", h: "#faq" },
            ]}
          />
          <FooterCol
            title="Empresa"
            links={[
              { l: "Sobre", h: "#" },
              { l: "Blog", h: "#" },
              { l: "Carreiras", h: "#" },
              { l: "Contato", h: "#contato" },
            ]}
          />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Nexus ERP. Todos os direitos reservados.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">
              Privacidade (LGPD)
            </a>
            <a href="#" className="hover:text-foreground">
              Termos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { l: string; h: string }[];
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.l}>
            <a
              href={l.h}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
