export interface Invoice {
  id: string;
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

export interface UpdateInvoiceRequest {
  payment_date?: string | null;
  bank_account?: number | null;
  is_paid?: boolean;
}
