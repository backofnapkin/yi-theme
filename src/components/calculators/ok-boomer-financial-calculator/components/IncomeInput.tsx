import React from 'react';
import { DollarSign } from 'lucide-react';
import InfoButton from './InfoButton';

interface IncomeInputProps {
  incomeType: 'annual' | 'hourly';
  annualSalary: number;
  hourlyWage: number;
  onIncomeTypeChange: (type: 'annual' | 'hourly') => void;
  onAnnualSalaryChange: (value: number) => void;
  onHourlyWageChange: (value: number) => void;
}

const IncomeInput: React.FC<IncomeInputProps> = ({
  incomeType,
  annualSalary,
  hourlyWage,
  onIncomeTypeChange,
  onAnnualSalaryChange,
  onHourlyWageChange
}) => {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-green-600" />
        Current Income
        <InfoButton
          content="Enter your current income to see how your purchasing power compares to different periods in the Boomer generation. We'll adjust for inflation and show you what your income would be worth in each era."
        />
      </h2>
      <p className="text-sm text-gray-600 -mt-2">Enter your current income to see how it compares to different Boomer eras</p>
      <div className="flex items-center gap-4 mb-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio text-blue-600"
            checked={incomeType === 'annual'}
            onChange={() => onIncomeTypeChange('annual')}
          />
          <span className="ml-2">Annual Salary</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio text-blue-600"
            checked={incomeType === 'hourly'}
            onChange={() => onIncomeTypeChange('hourly')}
          />
          <span className="ml-2">Hourly Wage</span>
        </label>
      </div>
      {incomeType === 'annual' ? (
        <div className="space-y-1">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={annualSalary}
              onChange={(e) => onAnnualSalaryChange(Math.min(999999, Math.max(0, Number(e.target.value))))}
              placeholder="Enter your yearly salary before taxes"
            />
          </div>
          <p className="text-xs text-gray-500">Your total yearly income before taxes and deductions</p>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={hourlyWage}
              onChange={(e) => onHourlyWageChange(Math.min(999, Math.max(7.25, Number(e.target.value))))}
              placeholder="Enter your hourly rate"
              step="0.01"
            />
          </div>
          <p className="text-xs text-gray-500">Your base hourly rate before overtime or bonuses</p>
        </div>
      )}
    </section>
  );
};

export default IncomeInput;