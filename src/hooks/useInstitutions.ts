import { institutionsKeys } from "@/constants/queryKeys";
import { useAuth } from "@/contexts/AuthContext";
import { institutionsService } from "@/services/institutions";
import { useQuery } from "@tanstack/react-query";

export function useInstitutions() {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: institutionsKeys.list({}),
    queryFn: () => institutionsService.getInstitutions(),
    enabled: isAuthenticated && !!user,
  });
}
