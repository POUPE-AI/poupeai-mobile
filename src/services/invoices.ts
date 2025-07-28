import { api } from './api';
import { Invoice, InvoicesResponse } from '@/types/invoices';

export class InvoicesService {
  static async getInvoicesByCreditCard(creditCardId: number): Promise<InvoicesResponse> {
    const response = await api.get<InvoicesResponse>(`/finances/api/v1/credit-cards/${creditCardId}/invoices/`);
    return response.data;
  }

  static async payInvoice(creditCardId: number, invoiceId: number, paymentData: { payment_date: string; bank_account_id: number }): Promise<Invoice> {
    const response = await api.post<Invoice>(`/finances/api/v1/credit-cards/${creditCardId}/invoices/${invoiceId}/payment/`, paymentData);
    return response.data;
  }
}
