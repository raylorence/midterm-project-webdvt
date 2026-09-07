export interface Transaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  category: string;
  type: 'Income' | 'Expense';
  date: string;
  created_at?: string;
}
