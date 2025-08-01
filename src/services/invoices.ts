import { api } from "./api";
import { Invoice, InvoicesResponse } from "@/types/invoices";

export class InvoicesService {
  private static baseUrl = "finances/api/v1/credit-cards/";

  static async getInvoicesByCreditCard(
    creditCardId: number,
    params?: {
      page?: number;
      page_size?: number;
    }
  ): Promise<InvoicesResponse> {
    const response = await api.get<InvoicesResponse>(
      `${this.baseUrl}${creditCardId}/invoices/?ordering=+due_date`,
      params
    );
    return response.data;
  }

  static async getInvoicesByCreditCardAndId(
    creditCardId: number,
    invoiceId: number
  ): Promise<Invoice> {
    const response = await api.get<Invoice>(
      `${this.baseUrl}${creditCardId}/invoices/${invoiceId}/`
    );
    return response.data;
  }

  static async payInvoice(
    creditCardId: number,
    invoiceId: number,
    paymentData: { payment_date: string; bank_account_id: number }
  ): Promise<Invoice> {
    const response = await api.post<Invoice>(
      `${this.baseUrl}${creditCardId}/invoices/${invoiceId}/payment/`,
      paymentData
    );
    return response.data;
  }
}
