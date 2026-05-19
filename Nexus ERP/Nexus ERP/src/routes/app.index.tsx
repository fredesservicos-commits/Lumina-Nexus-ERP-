import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/hooks/useDashboard";
import type { DashboardSummary } from "@/lib/types";

export const Route = createFileRoute("/app/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { summary } = useDashboard();
  const [data, setData] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    summary().then(setData).catch(console.error);
  }, [summary]);

  const cards = [
    {
      label: "Total Vendas",
      value: data?.total_sales ?? 0,
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Total Compras",
      value: data?.total_purchases ?? 0,
      icon: TrendingDown,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
    },
    {
      label: "Lucro Líquido",
      value: data?.net_profit ?? 0,
      icon: DollarSign,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Margem",
      value:
        data && data.total_sales > 0
          ? ((data.net_profit / data.total_sales) * 100)
          : 0,
      icon: Activity,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      suffix: "%",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visão geral da rentabilidade do negócio
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all hover:border-white/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </span>
                <div className={cn("rounded-lg p-2", card.bg)}>
                  <Icon className={cn("h-4 w-4", card.color)} />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(card.value)}
                {card.suffix}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
