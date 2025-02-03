import React from 'react';
import { Info, Banknote } from 'lucide-react';
import { Tooltip } from '../../ui/Tooltip';
import { RangeInput } from '../../ui/RangeInput';
import { DecimalInput } from '../../ui/DecimalInput';

interface StartupInvestmentProps {
  formData: {
    initialInvestment: number;
    loanAmount: number;
    interestRate: number;
  };
  onChange: (field: 'initialInvestment' | 'loanAmount' | 'interestRate', value: number) => void;
}

export const StartupInvestment: React.FC<StartupInvestmentProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <Banknote className="w-5 h-5" />
        Basic Startup Investment Information
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <DecimalInput
              label={
                <div className="flex items-center gap-2">
                  <span>Initial Investment</span>
                  <Tooltip content="Total initial investment required to start the business">
                    <Info className="w-4 h-4 text-gray-400" />
                  </Tooltip>
                </div>
              }
              value={formData.initialInvestment}
              onChange={(value: number) => onChange('initialInvestment', value)}
              prefix="$"
              step={1000}
              min={0}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <DecimalInput
              label={
                <div className="flex items-center gap-2">
                  <span>Loan Amount</span>
                  <Tooltip content="Amount of money borrowed to finance the business">
                    <Info className="w-4 h-4 text-gray-400" />
                  </Tooltip>
                </div>
              }
              value={formData.loanAmount}
              onChange={(value: number) => onChange('loanAmount', value)}
              prefix="$"
              step={1000}
              min={0}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <label className="block text-sm font-medium text-gray-700">
                Interest Rate
              </label>
              <Tooltip content="Annual interest rate on the loan">
                <Info className="w-4 h-4 text-gray-400" />
              </Tooltip>
            </div>
            <span className="text-sm font-medium text-gray-900">{formData.interestRate}%</span>
          </div>
          <RangeInput
            value={formData.interestRate}
            onChange={(value: number) => onChange('interestRate', value)}
            min={1}
            max={30}
            step={0.1}
            suffix="%"
          />
        </div>
      </div>
    </div>
  );
};