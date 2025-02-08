import React from 'react';
import { Info, Wallet } from 'lucide-react';
import type { IncomeRange } from './types';
import { Tooltip } from './Tooltip';

interface IncomeSelectorProps {
  selectedIncome: IncomeRange | null;
  onSelectIncome: (income: IncomeRange) => void;
}

const incomeRanges: IncomeRange[] = [
  'Under $30,000',
  '$30,000-$59,999',
  '$60,000-$99,999',
  '$100,000-$149,999',
  '$150,000+'
];

export const IncomeSelector: React.FC<IncomeSelectorProps> = ({
  selectedIncome,
  onSelectIncome,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Wallet className="w-8 h-8 text-skin-active" />
        <h2 className="text-2xl font-semibold text-skin-base">Select Your Annual Income</h2>
        <Tooltip content="Income ranges are based on 2024 Federal Tax Brackets">
          <Info className="w-5 h-5 text-skin-base opacity-70 cursor-help" />
        </Tooltip>
      </div>
      <div className="space-y-3">
        {incomeRanges.map((income) => (
          <label
            key={income}
            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${
                selectedIncome === income
                  ? 'border-skin-base bg-skin-fill'
                  : 'border-skin-base border-opacity-20 hover:border-opacity-100 hover:bg-[rgb(var(--color-border-active))] hover:bg-opacity-10'
              }`}
          >
            <input
              type="radio"
              name="income"
              value={income}
              checked={selectedIncome === income}
              onChange={() => onSelectIncome(income)}
              className="w-4 h-4 text-skin-active focus:ring-skin-active"
            />
            <span className="ml-3 text-skin-base">{income}</span>
          </label>
        ))}
      </div>
      <p className="text-sm text-skin-base opacity-70 mt-4 italic">
        Note: Income ranges are based on 2024 Federal Tax Brackets
      </p>
    </div>
  );
};