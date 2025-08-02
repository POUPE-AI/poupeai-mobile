export interface ReportHeader {
  status: number;
  message: string | null;
}

export interface ReportCategory {
  name: string;
  balance: number;
}

export interface ReportTransaction {
  description: string;
  categoryName: string;
  date: string;
  amount: number;
}

export interface OverviewReport {
  header: ReportHeader;
  content: {
    balance: number;
    totalIncome: number;
    totalExpense: number;
    categories: ReportCategory[];
    hash: string;
    accountId: string;
    startDate: string;
    endDate: string;
    textAnalysis: string;
    suggestion: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ExpenseReport {
  header: ReportHeader;
  content: {
    totalExpense: number;
    categories: ReportCategory[];
    mainExpenses: ReportTransaction[];
    hash: string;
    accountId: string;
    startDate: string;
    endDate: string;
    textAnalysis: string;
    suggestion: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface IncomeReport {
  header: ReportHeader;
  content: {
    totalIncome: number;
    categories: ReportCategory[];
    mainIncomes: ReportTransaction[];
    hash: string;
    accountId: string;
    startDate: string;
    endDate: string;
    textAnalysis: string;
    suggestion: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CategoryReport {
  header: ReportHeader;
  content: {
    category: string;
    total: number;
    average: number;
    trend: string;
    peakDays: string[];
    transactions: ReportTransaction[];
    hash: string;
    accountId: string;
    startDate: string;
    endDate: string;
    textAnalysis: string;
    suggestion: string;
    createdAt: string;
    updatedAt: string;
  };
}

export type ReportType = "overview" | "expense" | "income" | "category";
