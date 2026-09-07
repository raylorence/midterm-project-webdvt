import { useState, useEffect, useCallback } from 'react';
import type { Transaction } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...transaction, user_id: user.id }])
      .select();

    if (error) {
      console.error('Error adding transaction:', error);
      throw error;
    } else if (data) {
      setTransactions((prev) => [data[0], ...prev]);
    }
  };

  const updateTransaction = async (updatedTransaction: Transaction) => {
    if (!user) return;
    
    // Create a copy without read-only or metadata fields that shouldn't be manually updated
    const { id, user_id, created_at, ...updateData } = updatedTransaction;
    
    const { error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating transaction:', error);
      throw error;
    } else {
      setTransactions((prev) =>
        prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
      );
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    } else {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const getTransactionById = useCallback((id: string) => {
    return transactions.find((t) => t.id === id);
  }, [transactions]);

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
    refreshTransactions: fetchTransactions,
  };
};
