export interface Card {
  id: string;
  name: string;
  creditLimit: number;

  used_credit_limit: number;
  available_credit_limit: number;

  closingDay: number;
  dueDay: number;
  institutionId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CardProgress {
  used_amount: number;
  available_amount: number;
  percentage: number;
}

export interface CreateCreditCardRequest {
  name: string;
  creditLimit: number;
  closingDay: number;
  dueDay: number;
  institutionId: number;
}

export interface UpdateCreditCardRequest extends Partial<CreateCreditCardRequest> {
  id: string;
}
