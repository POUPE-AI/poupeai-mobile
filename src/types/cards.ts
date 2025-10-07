export interface Card {
  id: number;
  name: string;
  credit_limit: string; // Vem como string do backend
  used_credit_limit: number;
  available_credit_limit: number;
  additional_info: string | null;
  closing_day: number;
  due_day: number;
  brand: string;
  brand_display: string;
  created_at: string;
  updated_at: string;
}

export interface CardProgress {
  used_amount: number;
  available_amount: number;
  percentage: number;
}

export interface CreditCardsResponse {
  results: Card[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface CreateCreditCardRequest {
  name: string;
  credit_limit: number; // Enviado como número para o backend
  additional_info?: string;
  closing_day: number;
  due_day: number;
  brand: string;
}

export interface UpdateCreditCardRequest extends Partial<CreateCreditCardRequest> {
  id: number;
}
