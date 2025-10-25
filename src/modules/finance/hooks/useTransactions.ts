import { useState, useEffect } from 'react';
import { supabase } from '../../../supabase/client';
import type { Transaction, TransactionInput, TransactionType } from '../types/finance.types';
import toast from 'react-hot-toast';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar transacciones con entidades
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          entity:entities(*)
        `)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTransactions = data?.map(transaction => ({
        ...transaction,
        type: transaction.type as TransactionType,
        entity: transaction.entity ? {
          id: transaction.entity.id,
          name: transaction.entity.name,
          created_at: transaction.entity.created_at,
          updated_at: transaction.entity.updated_at,
        } : undefined,
      })) || [];

      setTransactions(formattedTransactions);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error(`Error al cargar transacciones: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva transacción
  const createTransaction = async (transactionInput: TransactionInput): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionInput])
        .select(`
          *,
          entity:entities(*)
        `)
        .single();

      if (error) throw error;

      const newTransaction: Transaction = {
        ...data,
        type: data.type as TransactionType,
        entity: data.entity ? {
          id: data.entity.id,
          name: data.entity.name,
          created_at: data.entity.created_at,
          updated_at: data.entity.updated_at,
        } : undefined,
      };

      setTransactions(prev => [newTransaction, ...prev]);
      toast.success('Transacción creada exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast.error(`Error al crear transacción: ${errorMessage}`);
      return false;
    }
  };

  // Actualizar transacción
  const updateTransaction = async (
    id: string, 
    updates: Partial<TransactionInput>
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          entity:entities(*)
        `)
        .single();

      if (error) throw error;

      const updatedTransaction: Transaction = {
        ...data,
        type: data.type as TransactionType,
        entity: data.entity ? {
          id: data.entity.id,
          name: data.entity.name,
          created_at: data.entity.created_at,
          updated_at: data.entity.updated_at,
        } : undefined,
      };

      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === id ? updatedTransaction : transaction
        )
      );
      toast.success('Transacción actualizada exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast.error(`Error al actualizar transacción: ${errorMessage}`);
      return false;
    }
  };

  // Eliminar transacción
  const deleteTransaction = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      toast.success('Transacción eliminada exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast.error(`Error al eliminar transacción: ${errorMessage}`);
      return false;
    }
  };

  // Obtener estadísticas
  const getStats = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'Ingreso')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'Gasto')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, balance };
  };

  // Filtrar transacciones por tipo
  const getTransactionsByType = (type: TransactionType) => {
    return transactions.filter(t => t.type === type);
  };

  // Filtrar transacciones por rango de fechas
  const getTransactionsByDateRange = (startDate: string, endDate: string) => {
    return transactions.filter(t => t.date >= startDate && t.date <= endDate);
  };

  // Obtener transacciones recientes
  const getRecentTransactions = (limit: number = 5) => {
    return transactions.slice(0, limit);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getStats,
    getTransactionsByType,
    getTransactionsByDateRange,
    getRecentTransactions,
  };
}