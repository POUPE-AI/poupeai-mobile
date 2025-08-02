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
import tr from "zod/v4/locales/tr.cjs";

export function useTransactions(params?: {
  search?: string;
  page_size?: number;
  issue_date_end?: string;
  purchase_group_uuid?: string;
}) {
  return useInfiniteQuery({
    queryKey: transactionsKeys.list(params || {}),
    queryFn: ({ pageParam = 1 }) =>
      transactionsService.getTransactions({ ...params, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.count / (params?.page_size || 10));
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
}

export function useTransaction(transactionId: number) {
  if (transactionId <= 0) {
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
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => transactionsService.deleteTransaction(id),
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
    },
  });
}
