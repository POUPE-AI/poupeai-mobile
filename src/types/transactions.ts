import { CategoryType } from "./categories";

export type TransactionSourceType = "BANK_ACCOUNT" | "CREDIT_CARD";
export type TransactionStatus = "OVERDUE" | "PAID" | "PENDING";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: CategoryType;
  transactionDate: string;
  bankAccountId: string;
  creditCardId: string;
  categoryId: string;
  invoiceId: string;
  attachmentKey: string;
  isInstallment: boolean;
  installmentNumber: number;
  totalInstallments: number;
  purchaseGroupUuid: string;
  originalStatementId: string;
  originalStatementDescription: string;
  createdAt: string;
  updatedAt: string;

  sourceType: TransactionSourceType;
  status: TransactionStatus;
}

export interface TransactionSection {
  title: string;
  date: string;
  data: Transaction[];
}

export interface TransactionsResponse {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: Transaction[];
}

export interface CreateTransactionRequest {
  description: string;
  amount: number;
  transactionDate: string; // backend required format 'YYYY-MM-DD'
  bankAccountId?: string;
  creditCardId?: string;
  categoryId?: string;
  attachmentKey?: string;
  isInstallment?: boolean;
  totalInstallments?: number;
  originalStatementId?: string;
  originalStatementDescription?: string;
} 

export interface UpdateTransactionRequest
  extends Partial<CreateTransactionRequest> {
  id: number | string;
}
