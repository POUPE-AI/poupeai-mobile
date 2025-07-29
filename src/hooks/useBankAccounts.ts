import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bankAccountsService, UpdateBankAccountRequest } from '@/services/bankAccounts';
import { CreateBankAccountRequest } from '@/types/accounts';
import { bankAccountsKeys } from '@/constants/queryKeys';

export function useBankAccounts(params?: {
  search?: string;
  page?: number;
  page_size?: number;
}) {
  return useQuery({
    queryKey: bankAccountsKeys.list(params || {}),
    queryFn: () => bankAccountsService.getBankAccounts(params),
    enabled: true,
  });
}

export function useBankAccount(id: number, enabled = true) {
  return useQuery({
    queryKey: bankAccountsKeys.detail(id),
    queryFn: () => bankAccountsService.getBankAccountById(id),
    enabled: enabled && !!id,
  });
}

export function useCreateBankAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBankAccountRequest) => bankAccountsService.createBankAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bankAccountsKeys.lists(),
      });
    },
  });
}

export function useUpdateBankAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBankAccountRequest) => bankAccountsService.updateBankAccount(data),
    onSuccess: (updatedAccount) => {
      queryClient.invalidateQueries({
        queryKey: bankAccountsKeys.lists(),
      });
      queryClient.setQueryData(
        bankAccountsKeys.detail(updatedAccount.id),
        updatedAccount
      );
    },
  });
}

export function useDeleteBankAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bankAccountsService.deleteBankAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bankAccountsKeys.lists(),
      });
    },
  });
}
