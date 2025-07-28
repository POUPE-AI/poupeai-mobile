import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetsService } from '../services/budgets';
import { Budget, CreateBudgetRequest } from '../types/budgets';

export const budgetsKeys = {
  all: ['budgets'] as const,
  lists: () => [...budgetsKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...budgetsKeys.lists(), { filters }] as const,
  details: () => [...budgetsKeys.all, 'detail'] as const,
  detail: (id: number) => [...budgetsKeys.details(), id] as const,
};

export function useBudgets(params?: {
  category?: number;
  search?: string;
  page?: number;
  page_size?: number;
}) {
  return useQuery({
    queryKey: budgetsKeys.list(params || {}),
    queryFn: () => budgetsService.getBudgets(params),
    enabled: true,
  });
}

export function useBudget(id: number, enabled = true) {
  return useQuery({
    queryKey: budgetsKeys.detail(id),
    queryFn: () => budgetsService.getBudgetById(id),
    enabled: enabled && !!id,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBudgetRequest) => budgetsService.createBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetsKeys.lists() });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateBudgetRequest> }) =>
      budgetsService.updateBudget(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: budgetsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: budgetsKeys.detail(id) });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => budgetsService.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetsKeys.lists() });
    },
  });
}