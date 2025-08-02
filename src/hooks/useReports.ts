import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsService } from "@/services/reports";
import { reportsKeys } from "@/constants/queryKeys";
import {
  OverviewReport,
  ExpenseReport,
  IncomeReport,
  CategoryReport,
} from "@/types/reports";

export function useOverviewReport(params?: {
  startDate?: string;
  endDate?: string;
  model?: string;
}) {
  return useQuery({
    queryKey: reportsKeys.overview(params),
    queryFn: () => reportsService.getOverviewReport(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
}

export function useExpenseReport(params?: {
  startDate?: string;
  endDate?: string;
  model?: string;
}) {
  return useQuery({
    queryKey: reportsKeys.expense(params),
    queryFn: () => reportsService.getExpenseReport(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
}

export function useIncomeReport(params?: {
  startDate?: string;
  endDate?: string;
  model?: string;
}) {
  return useQuery({
    queryKey: reportsKeys.income(params),
    queryFn: () => reportsService.getIncomeReport(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
}

export function useCategoryReport(params?: {
  startDate?: string;
  endDate?: string;
  model?: string;
}) {
  return useQuery({
    queryKey: reportsKeys.category(params),
    queryFn: () => reportsService.getCategoryReport(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
}

// Hook para invalidar cache dos relatórios
export function useRefreshReports() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({ queryKey: reportsKeys.all });
    },
    onSuccess: () => {
      console.log("Cache dos relatórios invalidado com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao invalidar cache dos relatórios:", error);
    },
  });
}
