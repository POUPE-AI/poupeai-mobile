import { CategoryType } from "./categories";

interface TransactionCategory {
  id: string;
  name: string;
  colorHex?: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: CategoryType;
  transactionDate: string;
  bankAccountId?: string;
  creditCardId?: string;
  category: TransactionCategory;
  invoiceId: string;
  attachmentUrl?: string;
  isInstallment: boolean;
  installmentNumber: number;
  totalInstallments: number;
  purchaseGroupUuid: string;
  originalStatementId: string;
  originalStatementDescription: string;
  createdAt: string;
  updatedAt: string;
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
  transactionDate: string;
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
  id: string;
}
