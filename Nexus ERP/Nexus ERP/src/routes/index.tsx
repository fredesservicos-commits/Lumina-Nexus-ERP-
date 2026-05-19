import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Modules } from "@/components/landing/Modules";
import { Differentials } from "@/components/landing/Differentials";
import { Phases } from "@/components/landing/Phases";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { ContactForm } from "@/components/landing/ContactForm";
import { Footer } from "@/components/landing/Footer";

const TITLE = "Nexus ERP — Gestão empresarial com rigor contábil e IA";
const DESCRIPTION =
  "ERP brasileiro estilo SAP: Financeiro, Compras, Vendas, RH e Estoque integrados ao ledger contábil, com IA para leitura automática de NF-e. Multi-empresa nativo.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Modules />
        <Differentials />
        <Phases />
        <DashboardPreview />
        <Pricing />
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
