export interface Account {
  id: number;
  name: string;
  description: string;
  initial_balance: string;
  current_balance: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface BankAccountsResponse {
  results: Account[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface CreateBankAccountRequest {
  name: string;
  description: string;
  initial_balance: number;
  is_default: boolean;
}
