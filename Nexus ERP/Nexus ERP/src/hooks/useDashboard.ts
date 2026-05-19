import { useCallback } from "react";
import { api } from "@/lib/api";
import type { DashboardSummary } from "@/lib/types";

export function useDashboard() {
  const summary = useCallback(async (): Promise<DashboardSummary> => {
    return api.get<DashboardSummary>("/dashboard/summary");
  }, []);

  return { summary };
}
