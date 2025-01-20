import React from 'react';
import { Settings } from 'lucide-react';
import { type CalculatorInputs } from './calculations';
import { DecimalInput } from '../../ui/DecimalInput';
import { RangeInput } from '../../ui/RangeInput';
import { Tooltip } from '../../ui/Tooltip';

interface InputSectionProps {
  inputs: CalculatorInputs;
  setInputs: React.Dispatch<React.SetStateAction<CalculatorInputs>>;
}

export default function InputSection({ inputs, setInputs }: InputSectionProps) {
  const handleInputChange = (field: keyof CalculatorInputs, value: string | boolean) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'boolean' ? value : Number(value),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="h-6 w-6 text-emerald-600" />
          Investment Details
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <DecimalInput
              label={
                <span className="flex items-center">
                  Initial Investment
                  <Tooltip content="The amount you plan to invest initially">
                    <span className="ml-1 cursor-help">ⓘ</span>
                  </Tooltip>
                </span>
              }
              value={inputs.initialInvestment}
              onChange={(value) => handleInputChange('initialInvestment', value.toString())}
              prefix="$"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Projected Annual Return
              <Tooltip content="Expected yearly return on investment">
                <span className="ml-1 cursor-help">ⓘ</span>
              </Tooltip>
            </label>
            <RangeInput
              value={inputs.projectedReturn}
              onChange={(value) => handleInputChange('projectedReturn', value)}
              min={0}
              max={30}
              step={0.1}
              suffix="%"
              showTooltip
            />
          </div>

          <div>
            <DecimalInput
              label={
                <span className="flex items-center">
                  Years
                  <Tooltip content="Investment time horizon in years">
                    <span className="ml-1 cursor-help">ⓘ</span>
                  </Tooltip>
                </span>
              }
              value={inputs.years}
              onChange={(value) => handleInputChange('years', value.toString())}
              min={0}
              step={1}
            />
          </div>

          <div>
            <DecimalInput
              label={
                <span className="flex items-center">
                  Months
                  <Tooltip content="Additional months beyond full years">
                    <span className="ml-1 cursor-help">ⓘ</span>
                  </Tooltip>
                </span>
              }
              value={inputs.months}
              onChange={(value) => handleInputChange('months', value.toString())}
              min={0}
              max={11}
              step={1}
            />
          </div>

          <div>
            <DecimalInput
              label={
                <span className="flex items-center">
                  Tax Rate
                  <Tooltip content="Your marginal tax rate">
                    <span className="ml-1 cursor-help">ⓘ</span>
                  </Tooltip>
                </span>
              }
              value={inputs.taxRate}
              onChange={(value) => handleInputChange('taxRate', value.toString())}
              suffix="%"
              min={0}
              max={100}
              step={0.1}
            />
          </div>

          <div>
            <DecimalInput
              label={
                <span className="flex items-center">
                  Annual Inflation Rate
                  <Tooltip content="Expected rate of inflation">
                    <span className="ml-1 cursor-help">ⓘ</span>
                  </Tooltip>
                </span>
              }
              value={inputs.inflationRate}
              onChange={(value) => handleInputChange('inflationRate', value.toString())}
              suffix="%"
              min={0}
              step={0.1}
            />
          </div>

          <div>
            <DecimalInput
              label={
                <span className="flex items-center">
                  Goal Amount (Optional)
                  <Tooltip content="Target amount you want to reach">
                    <span className="ml-1 cursor-help">ⓘ</span>
                  </Tooltip>
                </span>
              }
              value={inputs.goalAmount}
              onChange={(value) => handleInputChange('goalAmount', value.toString())}
              prefix="$"
              placeholder="Enter target amount"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={inputs.debtServiceEnabled}
              onChange={(e) => handleInputChange('debtServiceEnabled', e.target.checked)}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Include Debt Service Comparison
              <Tooltip content="Compare investment returns to debt payoff savings">
                <span className="ml-1 cursor-help">ⓘ</span>
              </Tooltip>
            </label>
          </div>

          {inputs.debtServiceEnabled && (
            <div>
              <DecimalInput
                label={
                  <span className="flex items-center">
                    Debt Interest Rate
                    <Tooltip content="Annual interest rate on your debt">
                      <span className="ml-1 cursor-help">ⓘ</span>
                    </Tooltip>
                  </span>
                }
                value={inputs.debtInterestRate}
                onChange={(value) => handleInputChange('debtInterestRate', value.toString())}
                suffix="%"
                min={0}
                step={0.1}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}