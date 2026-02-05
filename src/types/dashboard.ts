export interface BalanceChartPoint {
  date: string;
  balance: number;
}

export interface TotalsChartPoint {
  date: string;
  total: number;
}

export interface Section<T> {
  currentTotal: number;
  difference: number;
  chartData: T[];
}

export interface CreditCardInvoice {
  creditCardName: string;
  month: string;
  totalAmount: number;
  paid: boolean;
  dueDate: string;
}

export interface EstimatedSavingSection {
  estimatedSavings: number;
  savingsPercentage: number;
  message: string;
  comparisonPeriod?: string;
}

export interface DashboardResponse {
  message: string;
  startDate: string;
  endDate: string;
  balance: Section<BalanceChartPoint>;
  incomes: Section<TotalsChartPoint>;
  expenses: Section<TotalsChartPoint>;
  invoices: Section<CreditCardInvoice>;
  estimatedSaving: EstimatedSavingSection;
} 
