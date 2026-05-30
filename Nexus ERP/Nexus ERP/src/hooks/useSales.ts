import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useSalesList() {
  return useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data, error } = await supabase.from("vendas").select("*");
      if (error) throw error;
      return data;
    },
  });
}

export function useSalesSearch(q: string) {
  return useQuery({
    queryKey: ["sales", "search", q],
    queryFn: async () => {
      const { data, error } = await supabase.from("vendas").select("*").ilike("cliente_nome", `%${q}%`);
      if (error) throw error;
      return data;
    },
    enabled: q.length > 0,
  });
}

export function useCreateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { cliente_nome: string; valor: number }) => {
      const { data: result, error } = await supabase.from("vendas").insert(data).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sales"] }),
  });
}

export function useUpdateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string; cliente_nome?: string; valor?: number }) => {
      const { id, ...updateData } = data;
      const { data: result, error } = await supabase.from("vendas").update(updateData).eq("id", id).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sales"] }),
  });
}

export function useDeleteSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("vendas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sales"] }),
  });
}
