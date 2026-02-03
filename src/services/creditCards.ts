import { api } from "./api";
import { Card, CreateCreditCardRequest } from "../types/cards";

export interface UpdateCreditCardRequest extends Partial<CreateCreditCardRequest> {
  id: string;
}

export class CreditCardsService {
  private baseUrl = "core/api/v1/credit-cards";

  async getCreditCards(): Promise<Card[]> {
    const response = await api.get(this.baseUrl);
    return response.data;
  }

  async getCreditCardById(id: string): Promise<Card> {
    const response = await api.get<Card>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createCreditCard(data: CreateCreditCardRequest): Promise<Card> {
    const response = await api.post<Card>(this.baseUrl, data);
    return response.data;
  }

  async updateCreditCard(data: UpdateCreditCardRequest): Promise<Card> {
    const { id, ...updateData } = data;
    const response = await api.patch<Card>(`${this.baseUrl}/${id}`, updateData);
    return response.data;
  }

  async deleteCreditCard(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }
}

export const creditCardsService = new CreditCardsService();
