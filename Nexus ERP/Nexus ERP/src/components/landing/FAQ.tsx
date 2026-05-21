import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "O que é o Nexus ERP?",
    a: "É um sistema de gestão empresarial (ERP) brasileiro com estrutura contábil estilo SAP — partidas dobradas obrigatórias e ledger imutável — combinado com IA para automatizar lançamentos. Cobre Financeiro, Compras, Vendas, RH e Estoque.",
  },
  {
    q: "O Nexus suporta SPED e obrigações fiscais brasileiras?",
    a: "Sim. O plano de contas é estruturado para SPED Contábil e o ledger preserva todos os atributos exigidos. Estamos preparados para gerar arquivos SPED Fiscal, SPED Contribuições e ECD/ECF.",
  },
  {
    q: "Como funciona a integração com NF-e?",
    a: "Você importa o XML da nota (entrada ou saída) e a IA classifica contabilmente, sugerindo a contrapartida correta (Estoque ↔ Contas a Pagar, por exemplo). Você revisa e aprova — ou ativa o auto-posting para fornecedores recorrentes.",
  },
  {
    q: "Posso gerenciar várias empresas no mesmo sistema?",
    a: "Sim, multi-empresa é nativo. Cada usuário pode ter acesso a uma ou várias empresas com isolamento total via Row-Level Security. Consolidação de demonstrativos disponível no plano Business e Enterprise.",
  },
  {
    q: "Como é calculado o custo real de RH?",
    a: "Aplicamos a regra brasileira completa: salário base + encargos (INSS patronal, FGTS, terceiros) + provisões mensais de 13º salário (1/12) e férias (1/12 + 1/3 constitucional). O custo aparece no DRE no mês de competência.",
  },
  {
    q: "Os dados da minha empresa estão seguros?",
    a: "Criptografia em trânsito e em repouso, RLS por empresa, autenticação multifator opcional, logs de auditoria por usuário e backups diários. Conformidade com LGPD desde o desenho.",
  },
  {
    q: "Quanto tempo leva a implantação?",
    a: "Plano Starter: setup em horas (configuração assistida). Business: 1 a 2 semanas com importação de plano de contas, parceiros e saldos iniciais. Enterprise: cronograma personalizado com onboarding dedicado.",
  },
  {
    q: "Posso testar antes de contratar?",
    a: "Sim. Solicite uma demonstração e oferecemos um período de avaliação com seus próprios dados de teste, acompanhado por um especialista.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">FAQ</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Perguntas <span className="text-gradient">frequentes</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-12 w-full">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-border data-[state=open]:bg-card/40 rounded-xl border-b last:border-b"
            >
              <AccordionTrigger className="px-2 text-left text-base font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="px-2 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
