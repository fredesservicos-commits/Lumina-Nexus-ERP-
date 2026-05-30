import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function usePurchasesList() {
  return useQuery({
    queryKey: ["purchases"],
    queryFn: async () => {
      const { data, error } = await supabase.from("compras").select("*");
      if (error) throw error;
      return data;
    },
  });
}

export function usePurchasesSearch(q: string) {
  return useQuery({
    queryKey: ["purchases", "search", q],
    queryFn: async () => {
      const { data, error } = await supabase.from("compras").select("*").ilike("item_fornecedor", `%${q}%`);
      if (error) throw error;
      return data;
    },
    enabled: q.length > 0,
  });
}

export function useCreatePurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { item_fornecedor: string; valor: number }) => {
      const { data: result, error } = await supabase.from("compras").insert(data).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["purchases"] }),
  });
}

export function useUpdatePurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string; item_fornecedor?: string; valor?: number }) => {
      const { id, ...updateData } = data;
      const { data: result, error } = await supabase.from("compras").update(updateData).eq("id", id).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["purchases"] }),
  });
}

export function useDeletePurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("compras").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["purchases"] }),
  });
}
