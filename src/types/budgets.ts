export interface Budget {
  id: string;
  category: string; // ID da categoria
  profile: string; // ID do usuário
  name: string;
  amount: number; // Valor limite do orçamento
  actual_amount: number; // Valor atual gasto
  created_at: string;
  updated_at: string;
}

export interface BudgetProgress {
  percentage: number;
  status: 'safe' | 'warning' | 'danger'; // Para definir cores visuais
  remaining: number; // Valor restante
}
