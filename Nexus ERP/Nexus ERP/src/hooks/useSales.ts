import { useCallback } from "react";
import { api } from "@/lib/api";
import type { Sale } from "@/lib/types";

export function useSales() {
  const list = useCallback(async (): Promise<Sale[]> => {
    return api.get<Sale[]>("/sales/list");
  }, []);

  const search = useCallback(async (q: string): Promise<Sale[]> => {
    return api.get<Sale[]>(`/sales/search?q=${encodeURIComponent(q)}`);
  }, []);

  const create = useCallback(
    async (customer: string, total: number): Promise<Sale> => {
      return api.post<Sale>("/sales/new", { customer, total });
    },
    []
  );

  return { list, search, create };
}
