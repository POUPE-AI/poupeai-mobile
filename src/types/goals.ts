export interface Goal {
  id: string;
  name: string;
  description: string;
  colorHex: string;
  initialBalance: number;
  goalAmount: number;
  currentBalance: number;
  percentageCompleted: number;
  targetDate: string;
  completedAt: string | null;
}

export interface CreateGoalRequest {
  name: string;
  description?: string;
  colorHex: string;
  initialBalance: string;
  goalAmount: string;
  targetDate: string;
}

export interface UpdateGoalRequest extends Partial<CreateGoalRequest> {
  id: string;
}

export interface GoalDeposit {
  id: string;
  depositAmount: number;
  depositDate: string;
  goalId: string;
  createdAt: string;
}

export interface CreateGoalDepositRequest {
  depositAmount: number;
  depositDate: string;
}
