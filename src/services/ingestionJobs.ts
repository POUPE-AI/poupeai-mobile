import { api } from "./api";
import {
  IngestionJob,
  ImportBankStatementRequest,
} from "@/types/ingestionJobs";

export class IngestionJobsService {
  private baseUrl = "core/api/v1/ingestion-jobs";

  async getIngestionJobs(): Promise<IngestionJob[]> {
    const response = await api.get<IngestionJob[]>(this.baseUrl);
    return response.data;
  }

  async importBankStatement(
    data: ImportBankStatementRequest,
  ): Promise<IngestionJob> {
    const formData = new FormData();

    formData.append("file", {
      uri: data.file.uri,
      name: data.file.name,
      type: data.file.type,
    } as any);

    const url = `${this.baseUrl}?bankAccountId=${data.bankAccountId}&fallbackIncomeCategoryId=${data.fallbackIncomeCategoryId}&fallbackExpenseCategoryId=${data.fallbackExpenseCategoryId}`;

    const response = await api.post<IngestionJob>(url, formData);
    return response.data;
  }
}

export const ingestionJobsService = new IngestionJobsService();
