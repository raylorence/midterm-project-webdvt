import { useState, useEffect, useCallback } from 'react';
import type { Transaction } from '../types';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Performance optimization: prevent recreating these functions on every render
  // though setTransactions is stable, it's good practice.
  
  useEffect(() => {
    const saved = localStorage.getItem('transactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions((prev) => {
      const updated = [...prev, transaction];
      localStorage.setItem('transactions', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateTransaction = useCallback((updatedTransaction: Transaction) => {
    setTransactions((prev) => {
      const updated = prev.map((t) => 
        t.id === updatedTransaction.id ? updatedTransaction : t
      );
      localStorage.setItem('transactions', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      localStorage.setItem('transactions', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getTransactionById = useCallback((id: string) => {
      // Since transactions state might not be loaded yet in some cases if called too early, 
      // we can also check localStorage directly or rely on the state if it's there.
      return transactions.find(t => t.id === id);
  }, [transactions]);

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById
  };
};
