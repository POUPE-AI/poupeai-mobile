import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "@/services/transactions";
import { transactionsKeys, bankAccountsKeys, invoicesKeys, dashboardKeys } from "@/constants/queryKeys";

export function useUploadReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId, form, debug, debugInfo }: { transactionId: string; form: FormData; debug?: boolean; debugInfo?: Record<string, any> }) => {
      return transactionsService.uploadReceipt(transactionId, form, { debug, debugInfo });
    },
    onSuccess: (_res, { transactionId }) => {
      queryClient.invalidateQueries({ queryKey: transactionsKeys.detail(transactionId) });
      queryClient.invalidateQueries({ queryKey: transactionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bankAccountsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function useDeleteReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId }: { transactionId: string }) => {
      return transactionsService.deleteReceipt(transactionId);
    },
    onSuccess: (_, { transactionId }) => {
      queryClient.invalidateQueries({ queryKey: transactionsKeys.detail(transactionId) });
      queryClient.invalidateQueries({ queryKey: transactionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bankAccountsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}
