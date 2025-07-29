import { api } from "./api";
import {
  Transaction,
  TransactionsResponse,
  CreateTransactionRequest,
} from "../types/transactions";
import { UpdateGoalRequest } from "@/types";

export class TransactionsService {
  private baseUrl = "finances/api/v1/transactions/";

  async getTransactions(params?: {
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<TransactionsResponse> {
    const response = await api.get(this.baseUrl, { ...params });
    return response.data;
  }

  async createTransaction(
    data: CreateTransactionRequest
  ): Promise<Transaction> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  async updateTransaction(data: UpdateGoalRequest): Promise<Transaction> {
    const { id, ...updateData } = data;
    const response = await api.patch<Transaction>(
      `${this.baseUrl}${id}/`,
      updateData
    );
    return response.data;
  }

  async deleteTransaction(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}${id}/`);
  }
}

// Exportar instância única do serviço
export const transactionsService = new TransactionsService();
