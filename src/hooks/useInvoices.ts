import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InvoicesService } from '@/services/invoices';

// Query Keys
export const invoicesKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoicesKeys.all, 'list'] as const,
  list: (creditCardId: number) => [...invoicesKeys.lists(), { creditCardId }] as const,
  details: () => [...invoicesKeys.all, 'detail'] as const,
  detail: (id: number) => [...invoicesKeys.details(), id] as const,
};

// Hooks
export const useInvoices = (creditCardId: number) => {
  return useQuery({
    queryKey: invoicesKeys.list(creditCardId),
    queryFn: () => InvoicesService.getInvoicesByCreditCard(creditCardId),
    enabled: !!creditCardId,
  });
};

export const usePayInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ creditCardId, invoiceId, paymentData }: { 
      creditCardId: number; 
      invoiceId: number; 
      paymentData: { payment_date: string; bank_account_id: number } 
    }) =>
      InvoicesService.payInvoice(creditCardId, invoiceId, paymentData),
    onSuccess: (_, { creditCardId }) => {
      // Invalidate all invoice lists for this credit card
      queryClient.invalidateQueries({ queryKey: invoicesKeys.list(creditCardId) });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.lists() });
    },
  });
};
