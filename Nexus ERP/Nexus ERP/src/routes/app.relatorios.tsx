import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useDashboard } from "@/hooks/useDashboard";
import { useSales } from "@/hooks/useSales";
import { usePurchases } from "@/hooks/usePurchases";
import type { Sale, Purchase } from "@/lib/types";

export const Route = createFileRoute("/app/relatorios")({
  component: RelatoriosPage,
});

function RelatoriosPage() {
  const { summary } = useDashboard();
  const { list: listSales } = useSales();
  const { list: listPurchases } = usePurchases();
  const [data, setData] = useState<{ name: string; valor: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([summary(), listSales(), listPurchases()])
      .then(([sum]) => {
        setData([
          { name: "Vendas", valor: sum.total_sales },
          { name: "Compras", valor: sum.total_purchases },
          { name: "Lucro", valor: sum.net_profit },
        ]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [summary, listSales, listPurchases]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        <p className="mt-1 text-sm text-muted-foreground">Análise financeira do período</p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
        <h2 className="mb-6 text-sm font-semibold">Comparativo Vendas vs Compras</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="valor" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
