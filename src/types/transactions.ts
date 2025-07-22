export interface Transaction {
  id: string;
  title: string;
  category: {
    name: string;
    color: string;
  };
  amount: number;
  date: string;
  type: 'income' | 'expense';
  icon: string;
}

export interface TransactionSection {
  title: string;
  date: string;
  data: Transaction[];
}
