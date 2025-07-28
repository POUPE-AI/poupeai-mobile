import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsService } from '../services/goals';
import { Goal, CreateGoalRequest, UpdateGoalRequest, CreateGoalDepositRequest } from '../types/goals';

export const goalsKeys = {
  all: ['goals'] as const,
  lists: () => [...goalsKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...goalsKeys.lists(), { filters }] as const,
  details: () => [...goalsKeys.all, 'detail'] as const,
  detail: (id: number) => [...goalsKeys.details(), id] as const,
};

export function useGoals(params?: {
  search?: string;
  page?: number;
  page_size?: number;
}) {
  return useQuery({
    queryKey: goalsKeys.list(params || {}),
    queryFn: () => goalsService.getGoals(params),
    enabled: true,
  });
}

export function useGoal(id: number, enabled = true) {
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
      queryClient.invalidateQueries({ queryKey: goalsKeys.detail(variables.id) });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => goalsService.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsKeys.lists() });
    },
  });
}

export function useCreateGoalDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, ...data }: CreateGoalDepositRequest & { goalId: number }) =>
      goalsService.createDeposit(goalId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: goalsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: goalsKeys.detail(variables.goalId) });
    },
  });
}
