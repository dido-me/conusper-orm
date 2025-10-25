import { create } from 'zustand';
import type { Transaction, TransactionType } from '../types/finance.types';

interface TransactionState {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  loading: boolean;
  error: string | null;
}

interface TransactionActions {
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;
  selectTransaction: (transaction: Transaction | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getTransactionsByEntity: (entityId: string) => Transaction[];
  getRecentTransactions: (limit?: number) => Transaction[];
  getStats: () => { totalIncome: number; totalExpenses: number; balance: number };
  clearTransactions: () => void;
}

type TransactionStore = TransactionState & TransactionActions;

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  // State
  transactions: [],
  selectedTransaction: null,
  loading: false,
  error: null,

  // Actions
  setTransactions: (transactions) => set({ transactions }),
  
  addTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions]
  })),
  
  updateTransaction: (id, updates) => set((state) => ({
    transactions: state.transactions.map(transaction =>
      transaction.id === id ? { ...transaction, ...updates } : transaction
    )
  })),
  
  removeTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter(transaction => transaction.id !== id),
    selectedTransaction: state.selectedTransaction?.id === id ? null : state.selectedTransaction
  })),
  
  selectTransaction: (transaction) => set({ selectedTransaction: transaction }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  getTransactionsByType: (type) => {
    const { transactions } = get();
    return transactions.filter(transaction => transaction.type === type);
  },
  
  getTransactionsByEntity: (entityId) => {
    const { transactions } = get();
    return transactions.filter(transaction => transaction.entity_id === entityId);
  },
  
  getRecentTransactions: (limit = 5) => {
    const { transactions } = get();
    return transactions.slice(0, limit);
  },
  
  getStats: () => {
    const { transactions } = get();
    const totalIncome = transactions
      .filter(t => t.type === 'Ingreso')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'Gasto')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpenses;
    
    return { totalIncome, totalExpenses, balance };
  },
  
  clearTransactions: () => set({
    transactions: [],
    selectedTransaction: null,
    error: null
  })
}));