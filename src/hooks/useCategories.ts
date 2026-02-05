import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  categoriesService,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/services/categories";
import { Category, CategoryType } from "@/types/categories";
import {
  bankAccountsKeys,
  budgetsKeys,
  categoriesKeys,
  creditCardsKeys,
  dashboardKeys,
  transactionsKeys,
} from "@/constants/queryKeys";
import { useAuth } from "@/contexts/AuthContext";

export function useCategories(params?: {
  search?: string;
  page_size?: number;
}) {
  const { isAuthenticated, user } = useAuth();

  return useInfiniteQuery({
    queryKey: categoriesKeys.list(params || {}),
    queryFn: ({ pageParam = 0 }) =>
      categoriesService.getCategories({ ...params, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
    initialPageParam: 0,
    enabled: isAuthenticated && !!user,
  });
}

export function useCategory(id: string, enabled = true) {
  if (id === "") {
    return {
      data: null,
      isLoading: false,
      error: { message: "Invalid category ID" },
    };
  }

  return useQuery({
    queryKey: categoriesKeys.detail(id),
    queryFn: () => categoriesService.getCategoryById(id),
    enabled: enabled && !!id,
  });
}

export function useCategoriesByType(type: CategoryType) {
  return useQuery({
    queryKey: categoriesKeys.byType(type),
    queryFn: () => categoriesService.getCategoriesByType(type),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) =>
      categoriesService.createCategory(data),
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
      queryClient.setQueryData(
        categoriesKeys.byType(newCategory.type),
        (oldData: Category[] | undefined) => {
          if (!oldData) return [newCategory];
          return [...oldData, newCategory];
        },
      );
    },
    onError: (error) => {
      console.error("Erro ao criar categoria:", error);
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) =>
      categoriesService.updateCategory(data),
    onSuccess: (updatedCategory, variables) => {
      queryClient.setQueryData(
        categoriesKeys.detail(variables.id),
        updatedCategory,
      );
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: categoriesKeys.byType(updatedCategory.type),
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar categoria:", error);
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.deleteCategory(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: categoriesKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      queryClient.invalidateQueries({ queryKey: budgetsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: budgetsKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionsKeys.all });
      queryClient.invalidateQueries({ queryKey: bankAccountsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bankAccountsKeys.all });
      queryClient.invalidateQueries({ queryKey: creditCardsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: creditCardsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (error) => {
      console.error("Erro ao deletar categoria:", error);
    },
  });
}

export function useIncomeCategories() {
  return useCategoriesByType("INCOME");
}

export function useExpenseCategories() {
  return useCategoriesByType("EXPENSE");
}
