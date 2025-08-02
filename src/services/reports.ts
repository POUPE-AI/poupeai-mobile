import { api } from "./api";
import {
  OverviewReport,
  ExpenseReport,
  IncomeReport,
  CategoryReport,
} from "../types/reports";

export class ReportsService {
  private baseUrl = "reports/api/v1/reports/";

  async getOverviewReport(params?: {
    startDate?: string;
    endDate?: string;
    model?: string;
  }): Promise<OverviewReport> {
    const response = await api.get<OverviewReport>(`${this.baseUrl}overview`, {
      params,
    });
    return response.data;
  }

  async getExpenseReport(params?: {
    startDate?: string;
    endDate?: string;
    model?: string;
  }): Promise<ExpenseReport> {
    const response = await api.get<ExpenseReport>(`${this.baseUrl}expense`, {
      params,
    });
    return response.data;
  }

  async getIncomeReport(params?: {
    startDate?: string;
    endDate?: string;
    model?: string;
  }): Promise<IncomeReport> {
    const response = await api.get<IncomeReport>(`${this.baseUrl}income`, {
      params,
    });
    return response.data;
  }

  async getCategoryReport(params?: {
    startDate?: string;
    endDate?: string;
    model?: string;
  }): Promise<CategoryReport> {
    const response = await api.get<CategoryReport>(`${this.baseUrl}category`, {
      params,
    });
    return response.data;
  }
}

export const reportsService = new ReportsService();
