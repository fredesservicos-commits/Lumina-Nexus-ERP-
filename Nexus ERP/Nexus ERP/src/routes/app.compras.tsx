import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  usePurchasesList,
  useCreatePurchase,
  useUpdatePurchase,
  useDeletePurchase,
} from "@/hooks/usePurchases";

export const Route = createFileRoute("/app/compras")({
  component: ComprasPage,
});

function ComprasPage() {
  const { data: purchases, isLoading } = usePurchasesList();
  const createPurchase = useCreatePurchase();
  const updatePurchase = useUpdatePurchase();
  const deletePurchase = useDeletePurchase();

  const [query, setQuery] = useState("");
  const [item, setItem] = useState("");
  const [value, setValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState("");
  const [editValue, setEditValue] = useState("");

  const handleSubmit = async () => {
    if (!item || !value) return;
    await createPurchase.mutateAsync({ item_name: item, total: parseFloat(value) });
    setItem("");
    setValue("");
  };

  const startEdit = (p: { id: string; item_name: string; total: number }) => {
    setEditingId(p.id);
    setEditItem(p.item_name);
    setEditValue(p.total.toString());
  };

  const saveEdit = async (id: string) => {
    await updatePurchase.mutateAsync({ id, item_name: editItem, total: parseFloat(editValue) });
    setEditingId(null);
  };

  const filtered = query
    ? purchases?.filter((p) => p.item_name.toLowerCase().includes(query.toLowerCase()))
    : purchases;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Compras</h1>
        <p className="mt-1 text-sm text-muted-foreground">Registre e acompanhe suas compras</p>
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
          <Button onClick={handleSubmit} disabled={createPurchase.isPending}>
            <Plus className="mr-2 h-4 w-4" />
            Registrar
          </Button>
        </div>
      </div>

      <div className="mb-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar item..."
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
                  Item
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
              {filtered?.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  {editingId === p.id ? (
                    <>
                      <td className="px-6 py-4">
                        <Input
                          value={editItem}
                          onChange={(e) => setEditItem(e.target.value)}
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
                        {new Date(p.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => saveEdit(p.id)}
                            disabled={updatePurchase.isPending}
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
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => startEdit(p)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-rose-400 hover:text-rose-300"
                            onClick={() => deletePurchase.mutate(p.id)}
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
                    Nenhuma compra registrada
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
