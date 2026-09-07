import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { useTransactions } from '../hooks/useTransactions';
import { useCurrency } from '../store/CurrencyContext';
import { MdTrendingUp, MdTrendingDown, MdAccountBalanceWallet } from 'react-icons/md';

const Dashboard = () => {
  const { transactions } = useTransactions();
  const { currencySymbol } = useCurrency();
  const [filterType, setFilterType] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const matchType = filterType === 'All' || t.type === filterType;
        const matchCategory = filterCategory === 'All' || t.category === filterCategory;
        return matchType && matchCategory;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterType, filterCategory]);

  const balance = useMemo(() => {
    return transactions.reduce((acc, t) => {
      return t.type === 'Income' ? acc + t.amount : acc - t.amount;
    }, 0);
  }, [transactions]);

  const totalIncome = useMemo(() => {
    return transactions
      .filter(t => t.type === 'Income')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter(t => t.type === 'Expense')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const categories = useMemo(() => {
    return ['All', ...new Set(transactions.map(t => t.category))];
  }, [transactions]);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 mb-2">
            <MdAccountBalanceWallet size={24} />
            <span className="font-semibold uppercase text-xs tracking-wider">Total Balance</span>
          </div>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {currencySymbol}{balance.toFixed(2)}
          </p>
        </div>
        
        <div 
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 text-green-600 dark:text-green-400 mb-2">
            <MdTrendingUp size={24} />
            <span className="font-semibold uppercase text-xs tracking-wider">Total Income</span>
          </div>
          <p className="text-2xl font-bold">{currencySymbol}{totalIncome.toFixed(2)}</p>
        </div>
        
        <div 
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-2">
            <MdTrendingDown size={24} />
            <span className="font-semibold uppercase text-xs tracking-wider">Total Expenses</span>
          </div>
          <p className="text-2xl font-bold">{currencySymbol}{totalExpense.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div 
        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 items-center"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Type</label>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 border-none rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Category</label>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 border-none rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="font-semibold">Recent Transactions</h2>
          <span className="text-xs text-gray-500">{filteredTransactions.length} items</span>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((t) => (
              <Link 
                key={t.id} 
                to={`/transaction/${t.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{t.description}</p>
                  <div className="flex gap-2 items-center mt-1">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                      {t.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(t.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className={`font-bold ${t.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'Income' ? '+' : '-'}{currencySymbol}{t.amount.toFixed(2)}
                </p>
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No transactions found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
