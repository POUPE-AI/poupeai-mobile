import { api } from './api';
import { 
  Goal, 
  GoalsResponse, 
  CreateGoalRequest, 
  UpdateGoalRequest,
  CreateGoalDepositRequest,
  GoalDeposit
} from '../types/goals';

export class GoalsService {
  private baseUrl = 'finances/api/v1/goals/';

  async getGoals(params?: {
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<GoalsResponse> {
    const response = await api.get(this.baseUrl, { params });
    return response.data;
  }

  async getGoalById(id: number): Promise<Goal> {
    const response = await api.get<Goal>(`${this.baseUrl}${id}/`);
    return response.data;
  }

  async createGoal(data: CreateGoalRequest): Promise<Goal> {
    const response = await api.post<Goal>(this.baseUrl, data);
    return response.data;
  }

  async updateGoal(data: UpdateGoalRequest): Promise<Goal> {
    const { id, ...updateData } = data;
    const response = await api.patch<Goal>(`${this.baseUrl}${id}/`, updateData);
    return response.data;
  }

  async deleteGoal(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}${id}/`);
  }

  async createDeposit(goalId: number, data: CreateGoalDepositRequest): Promise<GoalDeposit> {
    const response = await api.post<GoalDeposit>(`${this.baseUrl}${goalId}/deposits/`, data);
    return response.data;
  }
}

// Exportar instância única do serviço
export const goalsService = new GoalsService();
