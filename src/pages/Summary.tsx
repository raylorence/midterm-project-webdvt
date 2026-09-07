import { useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useTheme } from '../store/ThemeContext';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

const Summary = () => {
  const { transactions } = useTransactions();
  const { theme, toggleTheme } = useTheme();

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'Expense')
      .forEach(t => {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
      });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return categoryTotals.reduce((acc, [_, val]) => acc + val, 0);
  }, [categoryTotals]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Spending Summary</h1>
        <div 
          className="flex items-center gap-4 bg-white dark:bg-gray-800 p-2 px-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <span className="text-sm font-medium">Theme: {theme === 'light' ? 'Light' : 'Dark'}</span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                       dark:hover:bg-gray-600 transition-colors"
          >
            {theme === 'light' ? <MdDarkMode /> : <MdLightMode />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div 
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-xl font-bold mb-6">Expenses by Category</h2>
          {categoryTotals.length > 0 ? (
            <div className="space-y-4">
              {categoryTotals.map(([category, amount]) => {
                const percentage = ((amount / totalExpenses) * 100).toFixed(1);
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{category}</span>
                      <span className="text-gray-500">${amount.toFixed(2)} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-6 flex justify-between items-center">
                <span className="font-bold">Total Expenses</span>
                <span className="text-xl font-bold text-red-600">${totalExpenses.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-gray-500">
              No expense data available to show.
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="space-y-6">
          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold mb-2">Budgeting Tip</h3>
            <p className="text-blue-100 text-sm">
              Try to keep your essential expenses under 50% of your total income to ensure a healthy financial future.
            </p>
          </div>
          
          <div 
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <h3 className="font-bold mb-4">Storage Info</h3>
            <p className="text-sm text-gray-500">
              Your data is stored locally in your browser. Clearing your browser cache may remove your transaction history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
