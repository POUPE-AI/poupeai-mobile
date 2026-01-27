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