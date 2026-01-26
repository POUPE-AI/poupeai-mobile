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

export const useInvoices = (creditCardId: string) => {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: invoicesKeys.list(creditCardId),
    queryFn: () => InvoicesService.getInvoicesByCreditCard(creditCardId),
    enabled: isAuthenticated && !!user && !!creditCardId,
  });
};
export const useInvoice = (creaditCardID: string, invoiceId: string) => {
  return useQuery({
    queryKey: invoicesKeys.detail(invoiceId),
    queryFn: () =>
      InvoicesService.getInvoicesByCreditCardAndId(creaditCardID, invoiceId),
    enabled: !!creaditCardID && !!invoiceId,
  });
};

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
      paymentData: { bankAccountId: string; amount: number };
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
