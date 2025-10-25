export const TransactionType = {
  INCOME: 'Ingreso',
  EXPENSE: 'Gasto',
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export type IncomeCategory = 'Efectivo' | 'Transferencia' | 'Depósitos Bancarios' | 'Yape' | 'Préstamo';
export type ExpenseCategory = 'Depósito en Banco' | 'Transferencia' | 'Yape' | 'Plin' | 'Efectivo' | 'Pagos Varios';

export type Category = IncomeCategory | ExpenseCategory;

export interface Entity {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: Category;
  amount: number;
  description: string;
  date: string; // ISO string format
  entity_id: string;
  entity?: Entity; // For joined queries
  created_at?: string;
  updated_at?: string;
}

// Database types for Supabase
export interface DatabaseTransaction {
  id: string;
  type: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  entity_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseEntity {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

// For forms and API calls
export type TransactionInput = Omit<Transaction, 'id' | 'created_at' | 'updated_at' | 'entity'>;
export type EntityInput = Omit<Entity, 'id' | 'created_at' | 'updated_at'>;

// View filters
export type View = 'transactions' | 'reports';
export type TransactionViewFilter = 'all' | 'income' | 'expense';