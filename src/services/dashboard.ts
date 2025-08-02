import { api } from "./api";
import { DashboardResponse } from "@/types/dashboard";

export class DashboardService {
  private baseUrl = "finances/api/v1/dashboard/";

  async getDashboard(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<DashboardResponse> {
    const response = await api.get<DashboardResponse>(this.baseUrl, { params });
    return response.data;
  }
}

export const dashboardService = new DashboardService();
