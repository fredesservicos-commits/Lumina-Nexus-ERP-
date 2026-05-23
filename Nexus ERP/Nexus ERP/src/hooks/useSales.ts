import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Sale } from "@/lib/types";

export function useSalesList() {
  return useQuery<Sale[]>({
    queryKey: ["sales"],
    queryFn: () => api.get<Sale[]>("/sales/list"),
  });
}

export function useSalesSearch(q: string) {
  return useQuery<Sale[]>({
    queryKey: ["sales", "search", q],
    queryFn: () => api.get<Sale[]>(`/sales/search?q=${encodeURIComponent(q)}`),
    enabled: q.length > 0,
  });
}

export function useCreateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { customer: string; total: number }) => api.post<Sale>("/sales/new", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sales"] }),
  });
}

export function useUpdateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; customer?: string; total?: number }) =>
      api.put<Sale>(`/sales/${data.id}`, { customer: data.customer, total: data.total }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sales"] }),
  });
}

export function useDeleteSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/sales/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sales"] }),
  });
}
