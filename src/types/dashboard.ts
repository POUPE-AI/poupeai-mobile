export interface DashboardChartData {
  date: string;
  balance?: number;
  total?: number;
}

export interface DashboardSection {
  current_total: number;
  difference: number;
  chart_data: DashboardChartData[];
}

export interface CreditCardInvoice {
  credit_card: string;
  total_amount: number;
  paid: boolean;
  month: string;
  due_date: string;
}

export interface CreditCardSection {
  current_total: number;
  difference: number;
  chart_data: CreditCardInvoice[];
}

export interface DashboardResponse {
  message: string;
  start_date: string;
  end_date: string;
  balance: DashboardSection;
  incomes: DashboardSection;
  expenses: DashboardSection;
  invoices: CreditCardSection;
  spending_by_category: Record<string, number>;
  estimated_saving: number;
}
