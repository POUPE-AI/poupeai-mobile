import { CategoryType } from "./categories";

export type TransactionSourceType = "BANK_ACCOUNT" | "CREDIT_CARD";
export type TransactionStatus = "OVERDUE" | "PAID" | "PENDING";

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  issue_date: string;
  source_type: TransactionSourceType;
  category: number;
  status: TransactionStatus;
  is_installment?: boolean;
  bank_account?: number;
  credit_card?: number;
}

export interface TransactionDetail extends Transaction {
  profile: string;
  type: CategoryType;
  installment_number?: number;
  total_installments?: number;
  purchase_group_uuid?: string;
  original_purchase_description?: string;
  invoice?: number;
  original_transaction_id?: number | null;
  original_statement_description?: string | null;
  attachment?: string | null;
  created_at: string;
  updated_at: string;
  category_type: CategoryType;
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
  installment_number?: number;
  total_installments?: number;
}

export interface UpdateTransactionRequest
  extends Partial<CreateTransactionRequest> {
  id: number;
}
