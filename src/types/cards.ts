export interface Card {
  id: string;
  name: string;
  credit_limit: number;
  additional_info: string;
  closing_day: number;
  due_day: number;
  brand: string;
  brand_display: string;
  profile: string; // ID do usuário
  created_at: string;
  updated_at: string;
}

export interface CardProgress {
  used_amount: number; // Valor usado (mock)
  available_amount: number; // Valor disponível
  percentage: number; // Percentual usado
}
