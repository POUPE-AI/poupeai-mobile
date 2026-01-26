import { api } from "./api";
import { Invoice } from "@/types/invoices";

export class InvoicesService {
  private static baseUrl = "core/api/v1/invoices";

  static async getInvoicesByCreditCard(
    creditCardId: string,
  ): Promise<Invoice[]> {
    const response = await api.get<Invoice[]>(
      `${this.baseUrl}${creditCardId}/invoices/?ordering=+due_date`,
    );
    return response.data;
  }

  static async getInvoicesByCreditCardAndId(
    creditCardId: string,
    invoiceId: string,
  ): Promise<Invoice> {
    const response = await api.get<Invoice>(`${this.baseUrl}/${invoiceId}`);
    return response.data;
  }

  static async payInvoice(
    invoiceId: string,
    paymentData: { bankAccountId: string; amount: number },
  ): Promise<Invoice> {
    const response = await api.post<Invoice>(
      `${this.baseUrl}/${invoiceId}/payments`,
      paymentData,
    );
    return response.data;
  }
}
