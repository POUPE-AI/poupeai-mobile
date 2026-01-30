import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { InvoicesService } from "@/services/invoices";
import {
  bankAccountsKeys,
  invoicesKeys,
  transactionsKeys,
  dashboardKeys,
} from "@/constants/queryKeys";
import { useAuth } from "@/contexts/AuthContext";

export const useInvoices = (creditCardId: string, params?: any) => {
  const { isAuthenticated, user } = useAuth();

  const mergedParams = { ...params, creditCardId };

  return useQuery({
    queryKey: invoicesKeys.list(creditCardId, params),
    queryFn: () => InvoicesService.getInvoices(mergedParams),
    enabled: isAuthenticated && !!user && !!creditCardId,
  });
};
export const useInvoice = (invoiceId: string) => {
  return useQuery({
    queryKey: invoicesKeys.detail(invoiceId),
    queryFn: () => InvoicesService.getInvoiceById(invoiceId),
    enabled: !!invoiceId,
  });
};

import type { PayInvoiceRequest } from "@/types/invoices";

export const usePayInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      creditCardId,
      invoiceId,
      paymentData,
    }: {
      creditCardId: string;
      invoiceId: string;
      paymentData: PayInvoiceRequest;
    }) => InvoicesService.payInvoice(invoiceId, paymentData),
    onSuccess: (_, { creditCardId }) => {
      queryClient.invalidateQueries({
        queryKey: invoicesKeys.list(creditCardId),
      });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionsKeys.all });
      queryClient.invalidateQueries({ queryKey: bankAccountsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bankAccountsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
};
