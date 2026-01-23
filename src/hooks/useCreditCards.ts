import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  creditCardsService,
  UpdateCreditCardRequest,
} from "@/services/creditCards";
import { CreateCreditCardRequest } from "@/types/cards";
import {
  creditCardsKeys,
  dashboardKeys,
  transactionsKeys,
  invoicesKeys,
} from "@/constants/queryKeys";
import { useAuth } from "@/contexts/AuthContext";

export function useCreditCards() {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: creditCardsKeys.list({}),
    queryFn: () => creditCardsService.getCreditCards(),
    enabled: isAuthenticated && !!user, // Só executa se o usuário estiver autenticado
  });
}

export function useCreditCard(id: string, enabled = true) {
  if (id === "") {
    return {
      data: null,
      isLoading: false,
      error: { message: "Invalid credit card ID" },
    };
  }
  return useQuery({
    queryKey: creditCardsKeys.detail(id),
    queryFn: () => creditCardsService.getCreditCardById(id),
    enabled: enabled && !!id,
  });
}

export function useCreateCreditCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCreditCardRequest) =>
      creditCardsService.createCreditCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: creditCardsKeys.lists(),
      });
    },
  });
}

export function useUpdateCreditCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCreditCardRequest) =>
      creditCardsService.updateCreditCard(data),
    onSuccess: (updatedCard) => {
      queryClient.invalidateQueries({
        queryKey: creditCardsKeys.lists(),
      });
      queryClient.setQueryData(
        creditCardsKeys.detail(updatedCard.id),
        updatedCard,
      );
    },
  });
}

export function useDeleteCreditCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => creditCardsService.deleteCreditCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: creditCardsKeys.lists(),
      });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionsKeys.all });
      queryClient.invalidateQueries({ queryKey: invoicesKeys.all });
    },
  });
}
