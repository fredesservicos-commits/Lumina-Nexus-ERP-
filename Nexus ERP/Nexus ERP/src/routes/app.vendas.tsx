import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSalesList, useCreateSale, useUpdateSale, useDeleteSale } from "@/hooks/useSales";

export const Route = createFileRoute("/app/vendas")({
  component: VendasPage,
});

function VendasPage() {
  const { data: sales, isLoading } = useSalesList();
  const createSale = useCreateSale();
  const updateSale = useUpdateSale();
  const deleteSale = useDeleteSale();

  const [query, setQuery] = useState("");
  const [customer, setCustomer] = useState("");
  const [value, setValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCustomer, setEditCustomer] = useState("");
  const [editValue, setEditValue] = useState("");

  const handleSubmit = async () => {
    if (!customer || !value) return;
    try {
      await createSale.mutateAsync({ customer, total: parseFloat(value) });
      setCustomer("");
      setValue("");
    } catch {
      /* erro tratado pelo mutateAsync internamente */
    }
  };

  const startEdit = (sale: { id: string; customer: string; total: number }) => {
    setEditingId(sale.id);
    setEditCustomer(sale.customer);
    setEditValue(sale.total.toString());
  };

  const saveEdit = async (id: string) => {
    try {
      await updateSale.mutateAsync({ id, customer: editCustomer, total: parseFloat(editValue) });
      setEditingId(null);
    } catch {
      /* erro tratado pelo mutateAsync internamente */
    }
  };

  const filtered = query
    ? sales?.filter((s) => s.customer.toLowerCase().includes(query.toLowerCase()))
    : sales;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Vendas</h1>
        <p className="mt-1 text-sm text-muted-foreground">Registre e consulte suas vendas</p>
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
          <Button onClick={handleSubmit} disabled={createSale.isPending}>
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
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
        </div>
      ) : (
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
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered?.map((sale) => (
                <tr key={sale.id} className="hover:bg-white/5 transition-colors">
                  {editingId === sale.id ? (
                    <>
                      <td className="px-6 py-4">
                        <Input
                          value={editCustomer}
                          onChange={(e) => setEditCustomer(e.target.value)}
                          className="h-8"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-8 w-32"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(sale.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => saveEdit(sale.id)}
                            disabled={updateSale.isPending}
                          >
                            Salvar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                            Cancelar
                          </Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
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
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => startEdit(sale)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-rose-400 hover:text-rose-300"
                            onClick={() => deleteSale.mutate(sale.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {(!filtered || filtered.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    Nenhuma venda registrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
