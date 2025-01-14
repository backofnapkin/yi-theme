import React from 'react';
import type { CalculatorInputs } from './types';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  inputs: CalculatorInputs;
  onChange: (inputs: Partial<CalculatorInputs>) => void;
  onCalculate: () => void;
  onReset: () => void;
}

export const CalculatorInputsForm: React.FC<Props> = ({
  inputs,
  onChange,
  onCalculate,
  onReset,
}) => {
  const handleIncomeTypeChange = (type: 'annual' | 'hourly') => {
    onChange({ 
      incomeType: type,
      incomeAmount: type === 'hourly' ? 17 : 75000
    });
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 5 && value <= 99) {
      onChange({ currentAge: value });
    }
  };

  const formatNumber = (value: number) => {
    return value ? value.toLocaleString('en-US') : '';
  };

  const parseNumber = (value: string) => {
    return Number(value.replace(/,/g, ''));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  const buttonClass = (active: boolean) => `
    px-4 py-2 rounded-lg font-semibold transition-colors
    ${active 
      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-emerald-100 shadow-sm'
      : 'border border-gray-300 text-gray-600 hover:bg-gray-50 active:bg-gray-100'
    }
  `;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Income Type
            <InfoTooltip text="Choose how you earn your income" />
          </label>
          <div className="mt-2 flex space-x-4">
            <button
              className={buttonClass(inputs.incomeType === 'annual')}
              onClick={() => handleIncomeTypeChange('annual')}
            >
              Annual Salary
            </button>
            <button
              className={buttonClass(inputs.incomeType === 'hourly')}
              onClick={() => handleIncomeTypeChange('hourly')}
            >
              Hourly Wage
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Income Amount
            <InfoTooltip text={
              inputs.incomeType === 'annual'
                ? "Enter your annual salary before taxes"
                : "Enter your hourly wage before taxes"
            } />
          </label>
          <div className="mt-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="text"
                value={inputs.incomeAmount ? formatNumber(inputs.incomeAmount) : ''}
                onChange={(e) => onChange({ incomeAmount: parseNumber(e.target.value) })}
                onFocus={handleFocus}
                onWheel={handleWheel}
                className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder={inputs.incomeType === 'annual' ? "75,000" : "17"}
              />
              {inputs.incomeType === 'hourly' && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">/hour</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tax Filing Status
            <InfoTooltip text="Select your tax filing status" />
          </label>
          <div className="mt-2 flex space-x-4">
            <button
              className={buttonClass(inputs.filingStatus === 'single')}
              onClick={() => onChange({ filingStatus: 'single' })}
            >
              Single
            </button>
            <button
              className={buttonClass(inputs.filingStatus === 'married')}
              onClick={() => onChange({ filingStatus: 'married' })}
            >
              Married
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Monthly Expenses
            <InfoTooltip text="Enter your total monthly expenses including rent, food, debt payments, etc." />
          </label>
          <div className="mt-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="text"
                value={inputs.monthlyExpenses ? formatNumber(inputs.monthlyExpenses) : ''}
                onChange={(e) => onChange({ monthlyExpenses: parseNumber(e.target.value) })}
                onFocus={handleFocus}
                onWheel={handleWheel}
                className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="4,641"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">/month</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Investment Returns
            <InfoTooltip text="Expected annual return on investments after taxes" />
          </label>
          <div className="mt-2">
            <input
              type="range"
              min="0"
              max="14"
              step="0.5"
              value={inputs.investmentReturns}
              onChange={(e) => onChange({ investmentReturns: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="text-center mt-1 text-sm text-gray-600">
              {inputs.investmentReturns}%
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current Age
            <InfoTooltip text="Enter your current age (5-99 years)" />
          </label>
          <div className="mt-2">
            <input
              type="text"
              min="5"
              max="99"
              value={inputs.currentAge || ''}
              onChange={handleAgeChange}
              onFocus={handleFocus}
              onWheel={handleWheel}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="35"
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onCalculate}
          className="px-6 py-2 bg-gradient-to-br from-green-50 to-emerald-50 text-gray-700 rounded-lg hover:from-green-100 hover:to-emerald-100 active:from-green-200 active:to-emerald-200 font-semibold transition-colors border border-emerald-100 shadow-sm"
        >
          Calculate
        </button>
        <button
          onClick={onReset}
          className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 active:bg-gray-100 font-semibold transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};