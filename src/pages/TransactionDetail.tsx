import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTransactions } from '../hooks/useTransactions';
import { useForm } from 'react-hook-form';
import type { Transaction } from '../types';
import { MdDelete, MdEdit, MdSave, MdCancel, MdArrowBack } from 'react-icons/md';

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transactions, updateTransaction, deleteTransaction } = useTransactions();
  const [isEditing, setIsEditing] = useState(false);
  
  const transaction = transactions.find((t) => t.id === id);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Transaction>();

  useEffect(() => {
    if (transaction) {
      reset(transaction);
    }
  }, [transaction, reset]);

  if (!transaction) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Transaction not found</h2>
        <button onClick={() => navigate('/')} className="text-blue-600 hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const onSave = (data: Transaction) => {
    updateTransaction({ ...data, amount: Number(data.amount) });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(transaction.id);
      navigate('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 
                     dark:hover:text-gray-300 transition-colors"
        >
          <MdArrowBack /> Back to Dashboard
        </button>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 
                           dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <MdEdit /> Edit
              </button>
              <button 
                onClick={handleDelete}
                className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-600 
                           dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
              >
                <MdDelete /> Delete
              </button>
            </>
          ) : (
             <>
              <button 
                onClick={handleSubmit(onSave)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 
                           rounded-lg hover:bg-green-700 transition-colors"
              >
                <MdSave /> Save
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-4 py-2 
                           rounded-lg hover:bg-gray-300 transition-colors"
              >
                <MdCancel /> Cancel
              </button>
             </>
          )}
        </div>
      </div>

      <div 
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
      >
        {isEditing ? (
          <form className="space-y-4">
             <div>
              <label className="block text-sm font-semibold mb-1">Description</label>
              <input
                {...register('description', { required: 'Description is required' })}
                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 
                           focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('amount', { required: 'Amount is required' })}
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 
                             focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Type</label>
                <select
                  {...register('type')}
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 
                             focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Category</label>
                <input
                  {...register('category', { required: 'Category is required' })}
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 
                             focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Date</label>
                <input
                  type="date"
                  {...register('date', { required: 'Date is required' })}
                  className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 
                             focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{transaction.description}</h2>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                  {transaction.category}
                </span>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'Income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </p>
                <p className="text-gray-500 text-sm mt-1">{new Date(transaction.date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Details</h3>
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-xs text-gray-500">Transaction ID</p>
                  <p className="text-sm font-mono mt-1">{transaction.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Transaction Type</p>
                  <p className="text-sm mt-1">{transaction.type}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionDetail;
