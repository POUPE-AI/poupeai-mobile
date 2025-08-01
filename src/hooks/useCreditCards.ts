import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  creditCardsService,
  UpdateCreditCardRequest,
} from "@/services/creditCards";
import { CreateCreditCardRequest } from "@/types/cards";
import { creditCardsKeys } from "@/constants/queryKeys";

export function useCreditCards(params?: {
  search?: string;
  page?: number;
  page_size?: number;
}) {
  return useQuery({
    queryKey: creditCardsKeys.list(params || {}),
    queryFn: () => creditCardsService.getCreditCards(params),
    enabled: true,
  });
}

export function useCreditCard(id: number, enabled = true) {
  if (id <= 0) {
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
        updatedCard
      );
    },
  });
}

export function useDeleteCreditCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => creditCardsService.deleteCreditCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: creditCardsKeys.lists(),
      });
    },
  });
}
