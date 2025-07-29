import { CategoryType } from "@/types";

export const transactionsKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionsKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...transactionsKeys.lists(), { filters }] as const,
  details: () => [...transactionsKeys.all, "detail"] as const,
  detail: (id: number) => [...transactionsKeys.details(), id] as const,
};

export const invoicesKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoicesKeys.all, 'list'] as const,
  list: (creditCardId: number, params?: any) => [...invoicesKeys.lists(), { creditCardId }] as const,
  details: () => [...invoicesKeys.all, 'detail'] as const,
  detail: (id: number) => [...invoicesKeys.details(), id] as const,
};

export const bankAccountsKeys = {
  all: ['bank-accounts'] as const,
  lists: () => [...bankAccountsKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...bankAccountsKeys.lists(), { filters }] as const,
  details: () => [...bankAccountsKeys.all, 'detail'] as const,
  detail: (id: number) => [...bankAccountsKeys.details(), id] as const,
};

export const creditCardsKeys = {
  all: ['credit-cards'] as const,
  lists: () => [...creditCardsKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...creditCardsKeys.lists(), { filters }] as const,
  details: () => [...creditCardsKeys.all, 'detail'] as const,
  detail: (id: number) => [...creditCardsKeys.details(), id] as const,
};

export const budgetsKeys = {
  all: ['budgets'] as const,
  lists: () => [...budgetsKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...budgetsKeys.lists(), { filters }] as const,
  details: () => [...budgetsKeys.all, 'detail'] as const,
  detail: (id: number) => [...budgetsKeys.details(), id] as const,
};

export const categoriesKeys = {
  all: ['categories'] as const,
  lists: () => [...categoriesKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...categoriesKeys.lists(), { filters }] as const,
  details: () => [...categoriesKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoriesKeys.details(), id] as const,
  byType: (type: CategoryType) => [...categoriesKeys.all, 'byType', type] as const,
};