import React from 'react';
import { Trash2 } from 'lucide-react';
import type { CustomExpense } from './types';

interface CustomExpenseInputProps {
  expense: CustomExpense;
  onUpdate: (id: string, field: 'name' | 'amount', value: string | number) => void;
  onDelete: (id: string) => void;
}

export function CustomExpenseInput({ expense, onUpdate, onDelete }: CustomExpenseInputProps) {
  return (
    <div className="flex gap-4 items-end">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">
          Expense Name
        </label>
        <input
          type="text"
          value={expense.name}
          onChange={(e) => onUpdate(expense.id, 'name', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          placeholder="Enter expense name"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">
          Amount ($)
        </label>
        <input
          type="number"
          value={expense.amount}
          onChange={(e) => onUpdate(expense.id, 'amount', Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          placeholder="0"
        />
      </div>
      <button
        onClick={() => onDelete(expense.id)}
        className="mb-[1px] p-2 text-red-600 hover:text-red-700 transition-colors"
        title="Delete expense"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}