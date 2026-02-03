import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard";
import { dashboardKeys } from "@/constants/queryKeys";
import { useAuth } from "@/contexts/AuthContext";

export function useDashboard(params?: { period?: string }) {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: dashboardKeys.data(params),
    queryFn: () => dashboardService.getDashboard(params),
    enabled: isAuthenticated && !!user,
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
  });
} 
