import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSales } from "@/hooks/useSales";
import type { Sale } from "@/lib/types";

export const Route = createFileRoute("/app/vendas")({
  component: VendasPage,
});

function VendasPage() {
  const { list, search, create } = useSales();
  const [sales, setSales] = useState<Sale[]>([]);
  const [query, setQuery] = useState("");
  const [customer, setCustomer] = useState("");
  const [value, setValue] = useState("");

  const loadSales = async () => {
    const data = query ? await search(query) : await list();
    setSales(data);
  };

  useEffect(() => {
    loadSales();
  }, []);

  const handleSubmit = async () => {
    if (!customer || !value) return;
    await create(customer, parseFloat(value));
    setCustomer("");
    setValue("");
    loadSales();
  };

  const handleSearch = () => {
    loadSales();
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Vendas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registre e consulte suas vendas
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-sm font-semibold">Nova Venda</h2>
        <div className="flex gap-3">
          <Input
            placeholder="Nome do cliente"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Valor (R$)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button onClick={handleSubmit}>
            <Plus className="mr-2 h-4 w-4" />
            Registrar
          </Button>
        </div>
      </div>

      <div className="mb-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="secondary" onClick={handleSearch}>
          Buscar
        </Button>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Data
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-sm">{sale.customer}</td>
                <td className="px-6 py-4 text-sm font-medium">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(sale.total)}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(sale.created_at).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-12 text-center text-sm text-muted-foreground"
                >
                  Nenhuma venda registrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
