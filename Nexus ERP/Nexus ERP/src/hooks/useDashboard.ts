import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: async () => {
      const { data, error } = await supabase.from("view_vendas_vs_compras").select("*");
      if (error) throw error;
      
      // Mapeamento simples para manter a estrutura que o frontend espera
      const totalVendas = data.reduce((acc, curr) => acc + (curr.total_vendas || 0), 0);
      const totalCompras = data.reduce((acc, curr) => acc + (curr.total_compras || 0), 0);
      
      return {
        revenue: totalVendas,
        expenses: totalCompras,
        profit: totalVendas - totalCompras
      };
    },
  });
}

export function useRecentTransactions(limit = 10) {
  return useQuery({
    queryKey: ["dashboard", "recent", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financeiro_lancamentos")
        .select("id, descricao, valor, tipo, data_lancamento")
        .order("data_lancamento", { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      return data.map(item => ({
        id: item.id,
        type: item.tipo,
        description: item.descricao,
        total: item.valor,
        created_at: item.data_lancamento
      }));
    },
  });
}
