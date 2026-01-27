import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from "@/types/transactions";
import { transactionsService } from "@/services/transactions";
import {
  bankAccountsKeys,
  budgetsKeys,
  creditCardsKeys,
  dashboardKeys,
  invoicesKeys,
  transactionsKeys,
} from "@/constants/queryKeys";
import { useAuth } from "@/contexts/AuthContext";

export function useTransactions(params?: {
  search?: string;
  page?: number;
  size?: number;
  type?: "INCOME" | "EXPENSE";
  categoryId?: string;
  purchaseGroupUuid?: string;
  sortDirection?: "ASC" | "DESC";
  sortBy?: string;
}) {
  const { isAuthenticated, user } = useAuth();

  return useInfiniteQuery({
    queryKey: transactionsKeys.list(params || {}),
    queryFn: ({ pageParam = params?.page ?? 0 }) =>
      transactionsService.getTransactions({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const next = lastPage.page + 1;
      return next < lastPage.totalPages ? next : undefined;
    },
    initialPageParam: params?.page ?? 0,
    enabled: isAuthenticated && !!user,
  });
}

export function useTransaction(transactionId: string) {
  if (!transactionId) {
    return {
      data: null,
      isLoading: false,
      error: {
        message: "Invalid transaction ID",
      },
    };
  }
  return useQuery({
    queryKey: transactionsKeys.detail(transactionId),
    queryFn: () => transactionsService.getTransaction(transactionId),
    enabled: !!transactionId,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTransactionRequest) =>
      transactionsService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bankAccountsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bankAccountsKeys.all });
      queryClient.invalidateQueries({ queryKey: creditCardsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: creditCardsKeys.all });
      queryClient.invalidateQueries({ queryKey: budgetsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: budgetsKeys.all });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateTransactionRequest) =>
      transactionsService.updateTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionsKeys.details() });
      queryClient.invalidateQueries({ queryKey: bankAccountsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bankAccountsKeys.all });
      queryClient.invalidateQueries({ queryKey: creditCardsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: creditCardsKeys.all });
      queryClient.invalidateQueries({ queryKey: budgetsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: budgetsKeys.all });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transactionsService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionsKeys.details() });
      queryClient.invalidateQueries({ queryKey: bankAccountsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bankAccountsKeys.all });
      queryClient.invalidateQueries({ queryKey: creditCardsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: creditCardsKeys.all });
      queryClient.invalidateQueries({ queryKey: budgetsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: budgetsKeys.all });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}
