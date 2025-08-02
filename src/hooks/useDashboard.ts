import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard";
import { dashboardKeys } from "@/constants/queryKeys";

export function useDashboard(params?: {
  start_date?: string;
  end_date?: string;
}) {
  return useQuery({
    queryKey: dashboardKeys.data(params),
    queryFn: () => dashboardService.getDashboard(params),
    refetchInterval: 60 * 1000, // atualiza a cada 1 minuto (ajuste conforme necessário)
    refetchOnWindowFocus: true,
  });
}
