import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  ShoppingCart,
  Package,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardSummary, useRecentTransactions } from "@/hooks/useDashboard";
import { Button } from "@/components/ui/button";

const typeLabel: Record<string, string> = {
  SALES_ORDER: "Venda",
  PURCHASE_INVOICE: "Compra",
};

const CACHE_KEY = "nexus_erp_dashboard_cache";

function loadCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCache<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

export const Route = createFileRoute("/app/")({
  component: DashboardPage,
});

function DashboardPage() {
  const [showError, setShowError] = useState(false);
  const { data, isLoading, isError, refetch, isRefetching, error } = useDashboardSummary();
  const { data: recent } = useRecentTransactions();

  const summaryCache = loadCache<typeof data>(CACHE_KEY);
  const showLoading = isLoading && !summaryCache;
  const showStale = isLoading && !!summaryCache;

  if (showLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (isError && !summaryCache && !showError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
        <AlertCircle className="h-12 w-12 text-rose-400" />
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar o Dashboard. Verifique sua conexão.
        </p>
        <Button onClick={() => refetch()} disabled={isRefetching}>
          <RefreshCw className={cn("mr-2 h-4 w-4", isRefetching && "animate-spin")} />
          Tentar novamente
        </Button>
      </div>
    );
  }

  const displayData = data || summaryCache;
  const isFromCache = !data && !!summaryCache;

  const cards = [
    {
      label: "Total Vendas",
      value: displayData?.total_sales ?? 0,
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Total Compras",
      value: displayData?.total_purchases ?? 0,
      icon: TrendingDown,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
    },
    {
      label: "Lucro Líquido",
      value: displayData?.net_profit ?? 0,
      icon: DollarSign,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Margem",
      value: displayData && displayData.total_sales > 0
        ? (displayData.net_profit / displayData.total_sales) * 100
        : 0,
      icon: Activity,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      suffix: "%",
    },
  ];

  if (data) {
    saveCache(CACHE_KEY, data);
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visão geral da rentabilidade do negócio
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isFromCache && (
            <span className="text-xs text-amber-400">Dados offline</span>
          )}
          {isRefetching && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          )}
          <Button size="sm" variant="ghost" onClick={() => refetch()} disabled={isRefetching}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={cn(
                "rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all hover:border-white/10",
                isFromCache && "opacity-70",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
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

      <div className="mt-8">
        <h2 className="mb-4 text-sm font-semibold">Transações Recentes</h2>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recent?.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                        item.type === "SALES_ORDER"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-rose-500/10 text-rose-400",
                      )}
                    >
                      {item.type === "SALES_ORDER" ? (
                        <ShoppingCart className="h-3 w-3" />
                      ) : (
                        <Package className="h-3 w-3" />
                      )}
                      {typeLabel[item.type] || item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{item.description}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                      item.total,
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
              {(!recent || recent.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    Nenhuma transação recente
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
