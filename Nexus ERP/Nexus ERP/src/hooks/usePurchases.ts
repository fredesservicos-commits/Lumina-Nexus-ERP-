import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Purchase } from "@/lib/types";

export function usePurchasesList() {
  return useQuery<Purchase[]>({
    queryKey: ["purchases"],
    queryFn: () => api.get<Purchase[]>("/purchases/list"),
  });
}

export function usePurchasesSearch(q: string) {
  return useQuery<Purchase[]>({
    queryKey: ["purchases", "search", q],
    queryFn: () => api.get<Purchase[]>(`/purchases/search?q=${encodeURIComponent(q)}`),
    enabled: q.length > 0,
  });
}

export function useCreatePurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { item_name: string; total: number }) =>
      api.post<Purchase>("/purchases/new", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["purchases"] }),
  });
}

export function useUpdatePurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; item_name?: string; total?: number }) =>
      api.put<Purchase>(`/purchases/${data.id}`, { item_name: data.item_name, total: data.total }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["purchases"] }),
  });
}

export function useDeletePurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/purchases/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["purchases"] }),
  });
}
