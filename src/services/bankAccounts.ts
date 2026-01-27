import { api } from './api';
import { Account, CreateBankAccountRequest } from '@/types/accounts';

export interface UpdateBankAccountRequest extends Partial<CreateBankAccountRequest> {
  id: string;
}

export class BankAccountsService {
  private baseUrl = 'core/api/v1/bank-accounts';

  async getBankAccounts(): Promise<Account[]> {
    const response = await api.get(this.baseUrl);
    return response.data;
  }

  async getBankAccountById(id: string): Promise<Account> {
    const response = await api.get<Account>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createBankAccount(data: CreateBankAccountRequest): Promise<Account> {
    const response = await api.post<Account>(this.baseUrl, data);
    return response.data;
  }

  async updateBankAccount(data: UpdateBankAccountRequest): Promise<Account> {
    const { id, ...updateData } = data;
    const response = await api.patch<Account>(`${this.baseUrl}/${id}`, updateData);
    return response.data;
  }

  async deleteBankAccount(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }
}

export const bankAccountsService = new BankAccountsService();
