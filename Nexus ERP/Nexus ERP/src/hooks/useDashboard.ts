import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { DashboardSummary } from "@/lib/types";

export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: ["dashboard", "summary"],
    queryFn: () => api.get<DashboardSummary>("/dashboard/summary"),
  });
}

export function useRecentTransactions(limit = 10) {
  return useQuery({
    queryKey: ["dashboard", "recent", limit],
    queryFn: () =>
      api.get<
        { id: string; type: string; description: string; total: number; created_at: string }[]
      >(`/dashboard/recent?limit=${limit}`),
  });
}
