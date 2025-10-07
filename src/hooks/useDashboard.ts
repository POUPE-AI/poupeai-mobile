import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard";
import { dashboardKeys } from "@/constants/queryKeys";
import { useAuth } from "@/contexts/AuthContext";

export function useDashboard(params?: {
  start_date?: string;
  end_date?: string;
}) {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: dashboardKeys.data(params),
    queryFn: () => dashboardService.getDashboard(params),
    enabled: isAuthenticated && !!user, // Só executa se o usuário estiver autenticado
    refetchInterval: 60 * 1000, // atualiza a cada 1 minuto (ajuste conforme necessário)
    refetchOnWindowFocus: true,
  });
}
