import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Package2,
  Users2,
  Wallet,
  Percent,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type ViewRow = Database["public"]["Views"]["view_vendas_vs_compras"]["Row"];

export function DashboardPreview() {
  const [data, setData] = useState<ViewRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: results, error } = await supabase
        .from("view_vendas_vs_compras")
        .select("*")
        .order("data", { ascending: false })
        .limit(12);

      if (!error && results) {
        setData(results.reverse());
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const totalVendas = data.reduce((acc, curr) => acc + (curr.total_vendas || 0), 0);
  const totalCompras = data.reduce((acc, curr) => acc + (curr.total_compras || 0), 0);
  const lucro = totalVendas - totalCompras;

  const kpis = [
    { label: "Receita", value: `R$ ${totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, trend: "+18,4%", up: true, icon: DollarSign },
    { label: "Custo de Compras", value: `R$ ${totalCompras.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, trend: "+6,2%", up: false, icon: Package2 },
    { label: "Lucro Líquido", value: `R$ ${lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, trend: "+9,1%", up: true, icon: Wallet },
  ];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section id="dashboard" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-accent/5 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            Visão Executiva
          </div>
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            O pulso da sua empresa em <span className="text-gradient">tempo real</span>
          </h2>
        </div>

        <div className="relative mt-16">
          <div className="relative rounded-3xl border border-white/5 bg-card/10 p-4 shadow-2xl backdrop-blur-3xl sm:p-8 lg:p-10">
            <div className="grid gap-4 sm:grid-cols-3">
              {kpis.map((k) => {
                const Icon = k.icon;
                const Trend = k.up ? ArrowUpRight : ArrowDownRight;
                return (
                  <div key={k.label} className="group relative rounded-2xl border border-white/5 bg-background/20 p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="flex items-center text-[10px] font-bold text-success">
                        <Trend className="mr-0.5 h-3 w-3" />
                        {k.trend}
                      </span>
                    </div>
                    <div className="mt-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      {k.label}
                    </div>
                    <div className="mt-1 text-xl font-bold tracking-tight">{k.value}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 rounded-2xl border border-white/5 bg-background/20 p-6">
              <h4 className="text-sm font-bold uppercase tracking-widest mb-8">Performance Consolidada</h4>
              <div className="flex h-52 items-end gap-3">
                {data.map((d, i) => (
                  <div key={i} className="group relative flex flex-1 items-end gap-1">
                    <div className="flex-1 rounded-t-sm bg-primary transition-all" style={{ height: `${Math.min((d.total_vendas || 0) / (totalVendas / 100), 100)}%` }} />
                    <div className="flex-1 rounded-t-sm bg-accent transition-all" style={{ height: `${Math.min((d.total_compras || 0) / (totalCompras / 100), 100)}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
