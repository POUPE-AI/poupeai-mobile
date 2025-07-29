export type TransactionSourceType = 'BANK_ACCOUNT' | 'CREDIT_CARD';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  issue_date: string;
  source_type: TransactionSourceType;
  category: number;
  status: 'OVERDUE' | 'PAID' | 'PENDING';
  is_installment?: boolean;
  bank_account?: number;
  credit_card?: number;
}

export interface TransactionSection {
  title: string;
  date: string;
  data: Transaction[];
}

export interface TransactionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Transaction[];
}

export interface CreateTransactionRequest {
  description: string;
  amount: number;
  issue_date: string;
  source_type: TransactionSourceType;
  category: number;
  bank_account?: number;
  credit_card?: number;
  is_installment?: boolean;
  total_installments?: number;
}

export interface UpdateTransactionRequest extends Partial<CreateTransactionRequest> {
  id: number;
}


