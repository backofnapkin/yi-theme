import React from 'react';
import { Plus, Trash2, Receipt, HelpCircle } from 'lucide-react';
import type { TowTruckBusinessData } from '../types';
import { Tooltip } from '../../../ui/Tooltip';

interface ExpensesStepProps {
  data: TowTruckBusinessData;
  onInputChange: (field: keyof TowTruckBusinessData, value: any) => void;
  onAddCustomExpense: () => void;
  onRemoveCustomExpense: (index: number) => void;
  onUpdateCustomExpense: (index: number, field: 'name' | 'amount', value: string | number) => void;
}

export function ExpensesStep({
  data,
  onInputChange,
  onAddCustomExpense,
  onRemoveCustomExpense,
  onUpdateCustomExpense
}: ExpensesStepProps) {
  const inputClasses = `
    w-full px-4 py-2 text-sm
    border rounded-lg
    border-gray-300 focus:ring-emerald-500 focus:border-emerald-500
    hover:border-emerald-200
    transition-shadow duration-200
    focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:border-2
    disabled:bg-gray-100 disabled:cursor-not-allowed
  `;

  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Receipt className="h-8 w-8 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900">Monthly Expenses</h2>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Enter your fixed monthly expenses and any additional costs.
        </p>
      </div>

      <div className="relative bg-gray-50 rounded-lg overflow-visible p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Fixed Monthly Expenses</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <label className={labelClasses}>
                  Insurance Costs
                  <span className="text-gray-500 ml-1">($)</span>
                </label>
                <Tooltip content="Monthly cost of commercial auto insurance for your tow trucks. This typically includes liability, physical damage, and on-hook coverage.">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                </Tooltip>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={data.monthlyInsurance || ''}
                  onChange={e => {
                    const value = e.target.value.replace(/[^\d.]/g, '');
                    if (/^\d*\.?\d*$/.test(value)) {
                      onInputChange('monthlyInsurance', parseFloat(value) || 0);
                    }
                  }}
                  onWheel={e => e.currentTarget.blur()}
                  className={`${inputClasses} pl-7`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <label className={labelClasses}>
                  Maintenance and Repair
                  <span className="text-gray-500 ml-1">($)</span>
                </label>
                <Tooltip content="Average monthly cost for routine maintenance, repairs, and parts replacement. This typically ranges from $300-$800 per truck depending on age and usage.">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                </Tooltip>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={data.monthlyMaintenance || ''}
                  onChange={e => {
                    const value = e.target.value.replace(/[^\d.]/g, '');
                    if (/^\d*\.?\d*$/.test(value)) {
                      onInputChange('monthlyMaintenance', parseFloat(value) || 0);
                    }
                  }}
                  onWheel={e => e.currentTarget.blur()}
                  className={`${inputClasses} pl-7`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <label className={labelClasses}>
                  Broker Fees
                  <span className="text-gray-500 ml-1">($)</span>
                </label>
                <Tooltip content="Monthly fees paid to dispatch services or towing networks that refer business to you. Typically a percentage of revenue or flat monthly fee.">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                </Tooltip>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={data.monthlyBrokerFees || ''}
                  onChange={e => {
                    const value = e.target.value.replace(/[^\d.]/g, '');
                    if (/^\d*\.?\d*$/.test(value)) {
                      onInputChange('monthlyBrokerFees', parseFloat(value) || 0);
                    }
                  }}
                  onWheel={e => e.currentTarget.blur()}
                  className={`${inputClasses} pl-7`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <label className={labelClasses}>
                  Labor Costs
                  <span className="text-gray-500 ml-1">($)</span>
                </label>
                <Tooltip content="Monthly wages, benefits, and payroll taxes for drivers and staff. For owner-operators, this may be zero if you're not paying yourself a formal salary.">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                </Tooltip>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={data.monthlyLaborCosts || ''}
                  onChange={e => {
                    const value = e.target.value.replace(/[^\d.]/g, '');
                    if (/^\d*\.?\d*$/.test(value)) {
                      onInputChange('monthlyLaborCosts', parseFloat(value) || 0);
                    }
                  }}
                  onWheel={e => e.currentTarget.blur()}
                  className={`${inputClasses} pl-7`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-gray-50 rounded-lg overflow-visible p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-gray-900">Additional Expenses</h3>
            <Tooltip content="Add any other recurring monthly expenses specific to your business, such as yard rent, office expenses, permits, or marketing costs.">
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
            </Tooltip>
          </div>
          <button
            onClick={onAddCustomExpense}
            className="inline-flex items-center px-3 py-2 border border-emerald-300 text-sm font-medium rounded-md text-emerald-600 bg-white hover:bg-emerald-50 hover:border-emerald-400 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </button>
        </div>
        <div className="space-y-4">
          {data.customExpenses.map((expense, index) => (
            <div key={index} className="flex gap-4 items-start bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex-1">
                <label className={labelClasses}>Expense Name</label>
                <input
                  type="text"
                  value={expense.name}
                  onChange={e => onUpdateCustomExpense(index, 'name', e.target.value)}
                  placeholder="e.g., Office Rent, Permits"
                  className={inputClasses}
                />
              </div>
              <div className="flex-1">
                <label className={labelClasses}>
                  Amount
                  <span className="text-gray-500 ml-1">($)</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={expense.amount || ''}
                    onChange={e => {
                      const value = e.target.value.replace(/[^\d.]/g, '');
                      if (/^\d*\.?\d*$/.test(value)) {
                        onUpdateCustomExpense(index, 'amount', parseFloat(value) || 0);
                      }
                    }}
                    onWheel={e => e.currentTarget.blur()}
                    className={`${inputClasses} pl-7`}
                  />
                </div>
              </div>
              <div className="pt-7">
                <button
                  onClick={() => onRemoveCustomExpense(index)}
                  className="p-1.5 bg-red-600 border border-solid border-red-700 hover:bg-red-700 hover:border-red-800 text-white rounded-full shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {data.customExpenses.length === 0 && (
            <div className="text-center py-6 text-gray-500 italic">
              No additional expenses added yet
            </div>
          )}

          {data.customExpenses.length > 0 && data.customExpenses.length < 5 && (
            <button
              onClick={onAddCustomExpense}
              className="w-full py-3 border-2 border-dashed border-emerald-300 rounded-lg text-emerald-600 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <Plus className="h-5 w-5" />
              Add Another Expense
            </button>
          )}
        </div>
      </div>
    </div>
  );
}