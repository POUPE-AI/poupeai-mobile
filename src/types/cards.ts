export interface Card {
  id: string;
  name: string;
  creditLimit: number;

  usedCreditLimit: number;

  closingDay: number;
  dueDay: number;
  institution: CardInstitution;
  createdAt: string;
  updatedAt: string;
}

export interface CardInstitution {
  id: number;
  name: string;
  mainColorHex?: string;
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
