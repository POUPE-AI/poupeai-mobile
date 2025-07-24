export type CategoryType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  color_hex: string;
  type: CategoryType;
  profile: string;
  created_at: string;
  updated_at: string;
}
