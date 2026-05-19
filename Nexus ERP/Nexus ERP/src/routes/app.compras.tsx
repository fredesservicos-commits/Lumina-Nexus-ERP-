import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePurchases } from "@/hooks/usePurchases";
import type { Purchase } from "@/lib/types";

export const Route = createFileRoute("/app/compras")({
  component: ComprasPage,
});

function ComprasPage() {
  const { list, create } = usePurchases();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [item, setItem] = useState("");
  const [value, setValue] = useState("");

  const loadPurchases = async () => {
    const data = await list();
    setPurchases(data);
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  const handleSubmit = async () => {
    if (!item || !value) return;
    await create(item, parseFloat(value));
    setItem("");
    setValue("");
    loadPurchases();
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Compras</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registre e acompanhe suas compras
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-sm font-semibold">Nova Compra</h2>
        <div className="flex gap-3">
          <Input
            placeholder="Item / Fornecedor"
            value={item}
            onChange={(e) => setItem(e.target.value)}
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

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Item
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
            {purchases.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-sm">{p.item_name}</td>
                <td className="px-6 py-4 text-sm font-medium">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(p.total)}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(p.created_at).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
            {purchases.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-12 text-center text-sm text-muted-foreground"
                >
                  Nenhuma compra registrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
