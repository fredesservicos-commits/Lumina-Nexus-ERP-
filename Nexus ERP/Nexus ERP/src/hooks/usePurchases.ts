import { useCallback } from "react";
import { api } from "@/lib/api";
import type { Purchase } from "@/lib/types";

export function usePurchases() {
  const list = useCallback(async (): Promise<Purchase[]> => {
    return api.get<Purchase[]>("/purchases/list");
  }, []);

  const search = useCallback(async (q: string): Promise<Purchase[]> => {
    return api.get<Purchase[]>(`/purchases/search?q=${encodeURIComponent(q)}`);
  }, []);

  const create = useCallback(async (item_name: string, total: number): Promise<Purchase> => {
    return api.post<Purchase>("/purchases/new", { item_name, total });
  }, []);

  return { list, search, create };
}
