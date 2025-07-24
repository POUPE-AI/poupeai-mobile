export interface Account {
  id: string;
  name: string;
  description: string;
  initial_balance: number;
  current_balance?: number; // Opcional, será calculado se não vier da API
  is_default: boolean;
  profile: string;
  created_at: string;
  updated_at: string;
}
