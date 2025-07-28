import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService, CreateCategoryRequest, UpdateCategoryRequest } from '../services/categories';
import { Category, CategoryType } from '../types/categories';

// Query Keys - seguindo padrão de nomenclatura hierárquica
export const categoriesKeys = {
  all: ['categories'] as const,
  lists: () => [...categoriesKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...categoriesKeys.lists(), { filters }] as const,
  details: () => [...categoriesKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoriesKeys.details(), id] as const,
  byType: (type: CategoryType) => [...categoriesKeys.all, 'byType', type] as const,
};

// Hook para buscar todas as categorias
export function useCategories(params?: {
  search?: string;
  page?: number;
  page_size?: number;
}) {
  return useQuery({
    queryKey: categoriesKeys.list(params || {}),
    queryFn: () => categoriesService.getCategories(params),
    enabled: true,
  });
}

export function useCategory(id: string, enabled = true) {
  return useQuery({
    queryKey: categoriesKeys.detail(id),
    queryFn: () => categoriesService.getCategoryById(id),
    enabled: enabled && !!id,
  });
}

// Hook para buscar categorias por tipo (mais específico e otimizado)
export function useCategoriesByType(type: CategoryType) {
  return useQuery({
    queryKey: categoriesKeys.byType(type),
    queryFn: () => categoriesService.getCategoriesByType(type),
    staleTime: 10 * 60 * 1000, // 10 minutos - categorias não mudam com frequência
  });
}

// Hook para criar categoria
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoriesService.createCategory(data),
    onSuccess: (newCategory) => {
      // Invalidar todas as listas de categorias
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
      
      // Adicionar a nova categoria ao cache específico por tipo
      queryClient.setQueryData(
        categoriesKeys.byType(newCategory.type),
        (oldData: Category[] | undefined) => {
          if (!oldData) return [newCategory];
          return [...oldData, newCategory];
        }
      );
    },
    onError: (error) => {
      console.error('Erro ao criar categoria:', error);
    },
  });
}

// Hook para atualizar categoria
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) => categoriesService.updateCategory(data),
    onSuccess: (updatedCategory, variables) => {
      // Atualizar o cache da categoria específica
      queryClient.setQueryData(
        categoriesKeys.detail(variables.id),
        updatedCategory
      );

      // Invalidar listas para garantir consistência
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoriesKeys.byType(updatedCategory.type) });
    },
    onError: (error) => {
      console.error('Erro ao atualizar categoria:', error);
    },
  });
}

// Hook para deletar categoria
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.deleteCategory(id),
    onSuccess: (_, deletedId) => {
      // Remover categoria do cache
      queryClient.removeQueries({ queryKey: categoriesKeys.detail(deletedId) });
      
      // Invalidar todas as listas
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
    },
    onError: (error) => {
      console.error('Erro ao deletar categoria:', error);
    },
  });
}

// Hook para categorias de receita (shortcut)
export function useIncomeCategories() {
  return useCategoriesByType('income');
}

// Hook para categorias de despesa (shortcut)
export function useExpenseCategories() {
  return useCategoriesByType('expense');
}
