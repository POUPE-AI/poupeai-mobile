import { CategoryType } from "@/types";

export const transactionsKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionsKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...transactionsKeys.lists(), { filters }] as const,
  details: () => [...transactionsKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionsKeys.details(), id] as const,
};

export const invoicesKeys = {
  all: ["invoices"] as const,
  lists: () => [...invoicesKeys.all, "list"] as const,
  list: (creditCardId: string, params?: any) =>
    [...invoicesKeys.lists(), { creditCardId, params }] as const,
  details: () => [...invoicesKeys.all, "detail"] as const,
  detail: (id: string) => [...invoicesKeys.details(), id] as const,
};

export const bankAccountsKeys = {
  all: ["bank-accounts"] as const,
  lists: () => [...bankAccountsKeys.all, "list"] as const,
  list: () => [...bankAccountsKeys.lists()] as const,
  details: () => [...bankAccountsKeys.all, "detail"] as const,
  detail: (id: string) => [...bankAccountsKeys.details(), id] as const,
};

export const creditCardsKeys = {
  all: ["credit-cards"] as const,
  lists: () => [...creditCardsKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...creditCardsKeys.lists(), { filters }] as const,
  details: () => [...creditCardsKeys.all, "detail"] as const,
  detail: (id: string) => [...creditCardsKeys.details(), id] as const,
};

export const institutionsKeys = {
  all: ["institutions"] as const,
  lists: () => [...institutionsKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...institutionsKeys.lists(), { filters }] as const,
};

export const budgetsKeys = {
  all: ["budgets"] as const,
  lists: () => [...budgetsKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...budgetsKeys.lists(), { filters }] as const,
  details: () => [...budgetsKeys.all, "detail"] as const,
  detail: (id: number) => [...budgetsKeys.details(), id] as const,
};

export const categoriesKeys = {
  all: ["categories"] as const,
  lists: () => [...categoriesKeys.all, "list"] as const,
  list: (filters: Record<number, any>) =>
    [...categoriesKeys.lists(), { filters }] as const,
  details: () => [...categoriesKeys.all, "detail"] as const,
  detail: (id: string) => [...categoriesKeys.details(), id] as const,
  byType: (type: CategoryType) =>
    [...categoriesKeys.all, "byType", type] as const,
};

export const dashboardKeys = {
  all: ["dashboard"] as const,
  data: (params?: Record<string, any>) =>
    [...dashboardKeys.all, params] as const,
};

export const reportsKeys = {
  all: ["reports"] as const,
  overview: (params?: Record<string, any>) =>
    [...reportsKeys.all, "overview", params] as const,
  expense: (params?: Record<string, any>) =>
    [...reportsKeys.all, "expense", params] as const,
  income: (params?: Record<string, any>) =>
    [...reportsKeys.all, "income", params] as const,
  category: (params?: Record<string, any>) =>
    [...reportsKeys.all, "category", params] as const,
};

export const profileKeys = {
  all: ["profile"] as const,
  detail: () => [...profileKeys.all, "detail"] as const,
};
