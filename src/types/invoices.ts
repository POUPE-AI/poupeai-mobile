export interface Invoice {
  id: number;
  credit_card: number;
  month: number;
  year: number;
  due_date: string;
  payment_date: string | null;
  bank_account: number | null;
  is_paid: boolean;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface InvoicesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Invoice[];
}

export interface UpdateInvoiceRequest {
  payment_date?: string | null;
  bank_account?: number | null;
  is_paid?: boolean;
}
