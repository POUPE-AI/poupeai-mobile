export type CategoryType = "INCOME" | "EXPENSE";

export interface Category {
  id: string;
  name: string;
  colorHex: string;
  iconName: string;
  type: CategoryType;
  createdAt: string;
  updatedAt: string;
}
