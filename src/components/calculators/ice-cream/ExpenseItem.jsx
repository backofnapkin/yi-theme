import React from 'react';

const ExpenseItem = ({ expense, updateExpense, removeExpense, isRemovable }) => {
  // Improved input handling to allow deletion and better user experience
  const handleChange = (field, value) => {
    if (field === 'amount') {
      // Allow empty string for better UX when clearing fields
      if (value === '') {
        updateExpense(expense.id, field, '');
        return;
      }
      
      // Convert to number if it's a valid number
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        updateExpense(expense.id, field, numValue);
      }
    } else {
      updateExpense(expense.id, field, value);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">Expense</h4>
        {isRemovable && (
          <button 
            type="button" 
            onClick={() => removeExpense(expense.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Remove expense"
          >
            <i className="ri-delete-bin-line"></i>
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor={`expense-name-${expense.id}`} className="block text-sm font-medium text-gray-700 mb-1">
            Expense Name
          </label>
          <input 
            type="text" 
            id={`expense-name-${expense.id}`} 
            value={expense.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor={`expense-amount-${expense.id}`} className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Amount ($)
          </label>
          <input 
            type="number" 
            id={`expense-amount-${expense.id}`} 
            value={expense.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            min="0" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            required
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;