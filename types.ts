
export type PaymentMethod = 'Pix' | 'Dinheiro';

export interface Drinks {
  suco: number;
  latinha: number;
  refri1l: number;
  refri2l: number;
}

export interface Sale {
  id: string;
  timestamp: number;
  date: string; // ISO string for sorting/filtering
  skewers: number;
  isComplete: boolean;
  drinks: Drinks;
  total: number;
  paymentMethod: PaymentMethod;
}

export enum ExpenseType {
  CAPITAL = 'Capital Inicial',
  GASTO = 'Gasto Extra'
}

export interface Expense {
  id: string;
  timestamp: number;
  date: string;
  description: string;
  amount: number;
  type: ExpenseType;
}

export type AppTab = 'dashboard' | 'vendas' | 'gastos' | 'historico' | 'relatorios';
