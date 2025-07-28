import { api } from './api';
import { Budget, BudgetsResponse, CreateBudgetRequest } from '../types/budgets';

export class BudgetsService {
  private baseUrl = 'finances/api/v1/budgets/';

  async getBudgets(params?: {
    category?: number;
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<BudgetsResponse> {
    const response = await api.get(this.baseUrl, { params });
    return response.data;
  }

  async getBudgetById(id: number): Promise<Budget> {
    const response = await api.get<Budget>(`${this.baseUrl}${id}/`);
    return response.data;
  }

  async createBudget(data: CreateBudgetRequest): Promise<Budget> {
    const response = await api.post<Budget>(this.baseUrl, data);
    return response.data;
  }

  async updateBudget(id: number, data: Partial<CreateBudgetRequest>): Promise<Budget> {
    const response = await api.patch<Budget>(`${this.baseUrl}${id}/`, data);
    return response.data;
  }

  async deleteBudget(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}${id}/`);
  }
}

export const budgetsService = new BudgetsService();