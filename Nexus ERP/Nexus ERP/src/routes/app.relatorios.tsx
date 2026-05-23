import { createFileRoute } from "@tanstack/react-router";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useDashboardSummary } from "@/hooks/useDashboard";

export const Route = createFileRoute("/app/relatorios")({
  component: RelatoriosPage,
});

function RelatoriosPage() {
  const { data, isLoading } = useDashboardSummary();

  const chartData = data
    ? [
        { name: "Vendas", valor: data.total_sales },
        { name: "Compras", valor: data.total_purchases },
        { name: "Lucro", valor: data.net_profit },
      ]
    : [];

  if (isLoading) {
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
            <BarChart data={chartData}>
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
