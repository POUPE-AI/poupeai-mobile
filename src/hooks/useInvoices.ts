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

export const useInvoices = (
  creditCardId: number,
  params?: {
    page_size?: number;
  }
) => {
  const { isAuthenticated, user } = useAuth();

  return useInfiniteQuery({
    queryKey: invoicesKeys.list(creditCardId, params || {}),
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
      InvoicesService.getInvoicesByCreditCard(creditCardId, {
        ...params,
        page: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.count / (params?.page_size || 5));
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
    enabled: isAuthenticated && !!user && !!creditCardId, // Só executa se o usuário estiver autenticado e creditCardId for válido
  });
};

export const useInvoice = (creaditCardID: number, invoiceId: number) => {
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
      creditCardId: number;
      invoiceId: number;
      paymentData: { payment_date: string; bank_account_id: number };
    }) => InvoicesService.payInvoice(creditCardId, invoiceId, paymentData),
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
