import { api } from "./api";
import {
  Transaction,
  TransactionsResponse,
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from "../types/transactions";

export class TransactionsService {
  private baseUrl = "core/api/v1/transactions";

  async getTransactions(params?: {
    search?: string;
    page?: number;
    size?: number;
    type?: "INCOME" | "EXPENSE";
    categoryId?: string;
    purchaseGroupUuid?: string;
    sortDirection?: "ASC" | "DESC";
    sortBy?: string;
  }): Promise<TransactionsResponse> {
    const response = await api.get(this.baseUrl, { ...params });
    return response.data;
  }

  async getTransaction(id: string): Promise<Transaction> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async uploadReceipt(
    transactionId: string,
    formData: FormData,
    options?: { debug?: boolean; debugInfo?: Record<string, any> },
  ): Promise<Transaction> {
    const config: any = {};

    if (options?.debug) {
      const debugHeaders: Record<string, string> = {
        "X-Debug-Upload": "true",
      };
      if (options.debugInfo) {
        const { name, size, mimeType, uri, uploadPath, fallback } = options.debugInfo;
        if (name) debugHeaders["X-File-Name"] = String(name);
        if (size !== undefined) debugHeaders["X-File-Size"] = String(size);
        if (mimeType) debugHeaders["X-File-Mime"] = String(mimeType);
        if (uri) debugHeaders["X-File-Uri"] = String(uri);
        if (uploadPath) debugHeaders["X-File-Path"] = String(uploadPath);
        if (fallback) debugHeaders["X-File-Fallback"] = String(fallback);
      }
      config.headers = { ...(config.headers || {}), ...debugHeaders };
    }

    try {
      const response = await api.post(`${this.baseUrl}/${transactionId}/receipt`, formData, config);
      return response.data;
    } catch (err: any) {
      console.error("[transactionsService] Upload failed", {
        transactionId,
        message: err?.message,
        responseStatus: err?.response?.status,
        responseData: err?.response?.data,
      });
      throw err;
    }
  }

  async deleteReceipt(transactionId: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${transactionId}/receipt`);
  }

  async createTransaction(
    data: CreateTransactionRequest
  ): Promise<Transaction> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  async updateTransaction(
    data: UpdateTransactionRequest
  ): Promise<Transaction> {
    const { id, ...updateData } = data;
    const response = await api.patch(`${this.baseUrl}/${id}`, updateData);
    return response.data;
  }

  async deleteTransaction(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }
}

export const transactionsService = new TransactionsService();