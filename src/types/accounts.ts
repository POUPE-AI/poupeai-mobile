export interface Account {
  id: string;
  name: string;
  description: string;
  initialBalance: number;
  currentBalance: number;
  isDefault: boolean;
  institutionId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBankAccountRequest {
  name: string;
  description: string;
  initialBalance: number;
  isDefault: boolean;
  institutionId: number;
}
