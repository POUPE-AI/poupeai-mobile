export type InvoiceStatus = "OPEN" | "CLOSED" | "PAID" | "PARTIALLY_PAID" | "OVERDUE";

export interface Invoice {
  id: string;
  creditCardId: string;
  month: number;
  year: number;
  closingDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount?: number;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateInvoiceRequest {
  paymentDate?: string | null;
  bankAccountId?: string | null;
  isPaid?: boolean;
}

export interface PayInvoiceRequest {
  bankAccountId: string;
  amount: number;
}
