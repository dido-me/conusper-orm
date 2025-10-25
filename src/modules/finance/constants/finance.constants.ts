import type { IncomeCategory, ExpenseCategory } from '../types/finance.types';

export const INCOME_CATEGORIES: IncomeCategory[] = [
  'Efectivo', 
  'Transferencia', 
  'Depósitos Bancarios', 
  'Yape', 
  'Préstamo'
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Depósito en Banco', 
  'Transferencia', 
  'Yape', 
  'Plin', 
  'Efectivo', 
  'Pagos Varios'
];

export const VIEW_LABELS = {
  transactions: 'Transacciones',
  reports: 'Reportes'
} as const;

export const FILTER_LABELS = {
  all: 'Todos',
  income: 'Ingresos',
  expense: 'Egresos'
} as const;