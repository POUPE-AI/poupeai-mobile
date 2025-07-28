import { api } from './api';
import { Account, BankAccountsResponse, CreateBankAccountRequest } from '../types/accounts';

export interface UpdateBankAccountRequest extends Partial<CreateBankAccountRequest> {
  id: number;
}

export class BankAccountsService {
  private baseUrl = 'finances/api/v1/bank-accounts/';

  async getBankAccounts(params?: {
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<BankAccountsResponse> {
    const response = await api.get(this.baseUrl, { params });
    return response.data;
  }

  async getBankAccountById(id: number): Promise<Account> {
    const response = await api.get<Account>(`${this.baseUrl}${id}/`);
    return response.data;
  }

  async createBankAccount(data: CreateBankAccountRequest): Promise<Account> {
    const response = await api.post<Account>(this.baseUrl, data);
    return response.data;
  }

  async updateBankAccount(data: UpdateBankAccountRequest): Promise<Account> {
    const { id, ...updateData } = data;
    const response = await api.patch<Account>(`${this.baseUrl}${id}/`, updateData);
    return response.data;
  }

  async deleteBankAccount(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}${id}/`);
  }
}

export const bankAccountsService = new BankAccountsService();
