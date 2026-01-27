import { api } from "./api";
import {
  Goal,
  CreateGoalRequest,
  UpdateGoalRequest,
  CreateGoalDepositRequest,
  GoalDeposit,
} from "../types/goals";

export class GoalsService {
  private baseUrl = "core/api/v1/goals";

  async getGoals(): Promise<Goal[]> {
    const response = await api.get(this.baseUrl);
    return response.data;
  }

  async getGoalById(id: string): Promise<Goal> {
    const response = await api.get<Goal>(`${this.baseUrl}${id}/`);
    return response.data;
  }

  async createGoal(data: CreateGoalRequest): Promise<Goal> {
    const response = await api.post<Goal>(this.baseUrl, data);
    return response.data;
  }

  async updateGoal(data: UpdateGoalRequest): Promise<Goal> {
    const { id, ...updateData } = data;
    const response = await api.patch<Goal>(`${this.baseUrl}/${id}`, updateData);
    return response.data;
  }

  async deleteGoal(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async createDeposit(
    goalId: string,
    data: CreateGoalDepositRequest,
  ): Promise<GoalDeposit> {
    const response = await api.post<GoalDeposit>(
      `${this.baseUrl}/${goalId}/deposits`,
      data,
    );
    return response.data;
  }
}

// Exportar instância única do serviço
export const goalsService = new GoalsService();
