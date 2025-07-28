export interface Goal {
  id: number;
  name: string;
  description: string;
  color_hex: string;
  initial_balance: string;
  goal_amount: string;
  current_balance: number;
  percentage_completed: number;
  target_at: string;
  is_completed: boolean;
  completed_at: string | null;
}

export interface GoalsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Goal[];
}

export interface CreateGoalRequest {
  name: string;
  description?: string;
  color_hex: string;
  initial_balance: string;
  goal_amount: string;
  target_at: string;
}

export interface UpdateGoalRequest extends Partial<CreateGoalRequest> {
  id: number;
}

export interface GoalDeposit {
  id: number;
  deposit_amount: string;
  deposit_at: string;
  note?: string;
  created_at: string;
}

export interface CreateGoalDepositRequest {
  deposit_amount: string;
  deposit_at: string;
  note?: string;
}