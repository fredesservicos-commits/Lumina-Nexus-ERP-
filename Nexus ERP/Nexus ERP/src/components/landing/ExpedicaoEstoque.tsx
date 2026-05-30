import { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock, AlertTriangle, ArrowDownLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type Pedido = Database["public"]["Tables"]["expedicao"]["Row"] & { vendas: { cliente_nome: string } };
type Produto = Database["public"]["Tables"]["produtos"]["Row"];

export default function ExpedicaoEstoque() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [alertas, setAlertas] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarDados = async () => {
    const [pedidosRes, produtosRes] = await Promise.all([
      supabase.from('expedicao').select('*, vendas(cliente_nome)').order('atualizado_em', { ascending: false }),
      supabase.from('produtos').select('*').filter('estoque_atual', 'lte', 'estoque_minimo')
    ]);

    if (pedidosRes.data) setPedidos(pedidosRes.data as Pedido[]);
    if (produtosRes.data) setAlertas(produtosRes.data);
    setLoading(false);
  };

  useEffect(() => {
    carregarDados();

    const canal = supabase
      .channel('mudancas_expedicao')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expedicao' }, carregarDados)
      .subscribe();

    return () => { supabase.removeChannel(canal); };
  }, []);

  const atualizarStatus = async (id: string, status: 'em_separacao' | 'enviado', extras = {}) => {
    await supabase.from('expedicao').update({ status, atualizado_em: new Date().toISOString(), ...extras }).eq('id', id);
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pendente: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      em_separacao: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      enviado: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      entregue: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    };
    return <Badge className={styles[status] || "bg-slate-500/10"}>{status.replace('_', ' ').toUpperCase()}</Badge>;
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 bg-slate-950 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Estoque & Expedição</h1>
        <p className="text-sm text-slate-400 mt-1">Gerenciamento logístico em tempo real.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-400">Aguardando Separação</CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{pedidos.filter(p => p.status === 'pendente').length}</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="expedicao" className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800">
          <TabsTrigger value="expedicao">Fila de Envios</TabsTrigger>
          <TabsTrigger value="alertas">Alertas de Reposição</TabsTrigger>
        </TabsList>

        <TabsContent value="expedicao" className="mt-4">
          <Card className="bg-slate-900/40 border-slate-800">
            <CardContent className="pt-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800">
                    <th className="pb-3 text-left">Código</th>
                    <th className="pb-3 text-left">Cliente</th>
                    <th className="pb-3 text-left">Status</th>
                    <th className="pb-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {pedidos.map(p => (
                    <tr key={p.id}>
                      <td className="py-4 font-mono">{p.id.slice(0,8)}</td>
                      <td className="py-4">{p.vendas?.cliente_nome}</td>
                      <td className="py-4">{getStatusBadge(p.status || '')}</td>
                      <td className="py-4 text-right">
                        {p.status === 'pendente' && <Button size="sm" onClick={() => atualizarStatus(p.id, 'em_separacao')}>Separar</Button>}
                        {p.status === 'em_separacao' && <Button size="sm" onClick={() => atualizarStatus(p.id, 'enviado')}>Despachar</Button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertas" className="mt-4">
          <Card className="bg-slate-900/40 border-slate-800">
            <CardContent className="pt-6 space-y-3">
              {alertas.map(a => (
                <div key={a.id} className="flex items-center justify-between p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div>
                    <h4 className="font-semibold">{a.nome}</h4>
                    <p className="text-xs text-slate-500">SKU: {a.sku}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-rose-400 font-bold">{a.estoque_atual} un</span>
                    <Button size="sm" variant="outline"><ArrowDownLeft className="w-3 h-3 mr-1"/> Repor</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}