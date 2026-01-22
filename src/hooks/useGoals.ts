import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { goalsService } from "../services/goals";
import {
  CreateGoalRequest,
  UpdateGoalRequest,
  CreateGoalDepositRequest,
} from "../types/goals";
import {
  dashboardKeys,
  transactionsKeys,
  bankAccountsKeys,
} from "@/constants/queryKeys";
import { useAuth } from "@/contexts/AuthContext";

export const goalsKeys = {
  all: ["goals"] as const,
  lists: () => [...goalsKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...goalsKeys.lists(), { filters }] as const,
  details: () => [...goalsKeys.all, "detail"] as const,
  detail: (id: string) => [...goalsKeys.details(), id] as const,
};

export function useGoals() {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: goalsKeys.list({}),
    queryFn: () => goalsService.getGoals(),
    enabled: isAuthenticated && !!user, // Só executa se o usuário estiver autenticado
  });
}

export function useGoal(id: string, enabled = true) {
  return useQuery({
    queryKey: goalsKeys.detail(id),
    queryFn: () => goalsService.getGoalById(id),
    enabled: enabled && !!id,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGoalRequest) => goalsService.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsKeys.lists() });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateGoalRequest) => goalsService.updateGoal(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: goalsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: goalsKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => goalsService.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsKeys.lists() });
    },
  });
}

export function useCreateGoalDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      goalId,
      ...data
    }: CreateGoalDepositRequest & { goalId: string }) =>
      goalsService.createDeposit(goalId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: goalsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: goalsKeys.detail(variables.goalId),
      });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionsKeys.all });
      queryClient.invalidateQueries({ queryKey: bankAccountsKeys.all });
    },
  });
}
