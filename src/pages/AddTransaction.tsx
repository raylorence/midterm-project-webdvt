import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import type { Transaction } from '../types';

type FormData = Omit<Transaction, 'id' | 'user_id' | 'created_at'>;

const AddTransaction = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { addTransaction } = useTransactions();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      await addTransaction({
        ...data,
        amount: Number(data.amount),
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to add transaction');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-center">Add New Transaction</h1>
      
      <div 
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <input
              {...register('description', { required: 'Description is required' })}
              placeholder="e.g. Grocery shopping"
              className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 
                         focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                {...register('amount', { 
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' }
                })}
                placeholder="0.00"
                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 
                           focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Type</label>
              <select
                {...register('type', { required: 'Type is required' })}
                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 
                           focus:ring-2 focus:ring-blue-500 transition-shadow"
              >
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </select>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <input
                {...register('category', { required: 'Category is required' })}
                placeholder="e.g. Food, Rent, Salary"
                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 
                           focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Date</label>
              <input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                {...register('date', { required: 'Date is required' })}
                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl p-3 
                           focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 
                       rounded-xl shadow-lg hover:shadow-xl transform active:scale-95 
                       transition-all duration-150 mt-4"
          >
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
