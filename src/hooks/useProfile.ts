import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profile";
import { profileKeys } from "@/constants/queryKeys";

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: () => profileService.getProfile(),
  });
}

export function useDeactivateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => profileService.deactivateProfile(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}

export function useReactivateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => profileService.reactivateProfile(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}
