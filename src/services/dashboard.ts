import { api } from "./api";
import { DashboardResponse } from "@/types/dashboard";

export class DashboardService {
  private baseUrl = "core/api/v1/dashboard";

  async getDashboard(params?: { period?: string }): Promise<DashboardResponse> {
    const response = await api.get<DashboardResponse>(this.baseUrl, { params });
    return response.data;
  }
}

export const dashboardService = new DashboardService();
