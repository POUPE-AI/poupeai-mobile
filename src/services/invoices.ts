import { api } from "./api";
import { Invoice, PayInvoiceRequest } from "@/types/invoices";

export interface InvoicesResponse {
  content: Invoice[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export class InvoicesService {
  private static baseUrl = "core/api/v1/invoices";

  static async getInvoices(params?: {
    page?: number;
    size?: number;
    creditCardId?: string;
    status?: string;
    month?: number;
    year?: number;
    sortDirection?: "ASC" | "DESC";
    sortBy?: string;
  }): Promise<InvoicesResponse> {
    const response = await api.get<InvoicesResponse>(this.baseUrl, params);
    return response.data;
  }

  static async getInvoiceById(invoiceId: string): Promise<Invoice> {
    const response = await api.get<Invoice>(`${this.baseUrl}/${invoiceId}`);
    return response.data;
  }

  static async payInvoice(
    invoiceId: string,
    paymentData: PayInvoiceRequest,
  ): Promise<Invoice> {
    const response = await api.post<Invoice>(
      `${this.baseUrl}/${invoiceId}/payments`,
      paymentData,
    );
    return response.data;
  }
}
