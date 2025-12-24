
import { Sale, Expense } from './types';

const KEYS = {
  SALES: 'cb_controle_sales',
  EXPENSES: 'cb_controle_expenses'
};

export const saveSales = (sales: Sale[]) => {
  localStorage.setItem(KEYS.SALES, JSON.stringify(sales));
};

export const getSales = (): Sale[] => {
  const data = localStorage.getItem(KEYS.SALES);
  return data ? JSON.parse(data) : [];
};

export const saveExpenses = (expenses: Expense[]) => {
  localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
};

export const getExpenses = (): Expense[] => {
  const data = localStorage.getItem(KEYS.EXPENSES);
  return data ? JSON.parse(data) : [];
};
