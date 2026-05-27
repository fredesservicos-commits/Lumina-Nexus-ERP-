import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Simula envio; se for substituído por chamada real, await a promise aqui
      await new Promise((resolve) => setTimeout(resolve, 700));
      toast.success("Solicitação enviada!", {
        description: "Nosso time entrará em contato em até 1 dia útil.",
        icon: <CheckCircle2 className="h-4 w-4 text-success" />,
      });
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      toast.error("Erro ao enviar solicitação. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contato"
      className="relative overflow-hidden border-t border-border py-24 sm:py-32"
    >
      <div
        className="absolute inset-0 opacity-50"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />
      <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Demonstração
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Veja o Nexus <span className="text-gradient">funcionando</span> com seus dados
            </h2>
            <p className="mt-4 text-muted-foreground">
              Agende uma conversa de 30 minutos com um especialista. Mostramos o dashboard, os
              módulos e como migrar do seu sistema atual.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                "Demo personalizada para o seu segmento",
                "Análise do seu plano de contas atual",
                "Estimativa de prazo de implantação",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card/70 p-6 shadow-elegant backdrop-blur-xl sm:p-8"
          >
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" name="nome" placeholder="Seu nome" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input id="empresa" name="empresa" placeholder="Sua empresa" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail corporativo</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="voce@empresa.com.br"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" name="telefone" placeholder="(11) 99999-0000" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mensagem">Mensagem</Label>
                <Textarea
                  id="mensagem"
                  name="mensagem"
                  rows={4}
                  placeholder="Conte um pouco sobre seu negócio..."
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-primary text-primary-foreground shadow-glow transition-transform hover:scale-[1.01]"
                size="lg"
              >
                {submitting ? "Enviando..." : "Solicitar Demonstração"}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </Button>
              <p className="text-center text-[11px] text-muted-foreground">
                Ao enviar, você concorda com nossa Política de Privacidade (LGPD).
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
