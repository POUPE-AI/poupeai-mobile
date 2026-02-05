export interface Budget {
  id: number;
  category: string;
  profile: string;
  name: string;
  amount: number;
  actual_amount: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Budget[];
}

export interface CreateBudgetRequest {
  category: string;
  name: string;
  amount: string;
}

export interface BudgetProgress {
  percentage: number;
  status: 'safe' | 'warning' | 'danger';
  remaining: number;
}
