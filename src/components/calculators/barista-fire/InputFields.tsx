import React from 'react';
import type { CalculatorState } from './types';
import { InfoTooltip } from './InfoTooltip';
import { formatMoney } from './utils';
import { RangeInput } from './RangeInput';
import { NumberInput } from './NumberInput';
import { generateChartData } from './utils';

interface InputFieldsProps {
  state: CalculatorState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputFields: React.FC<InputFieldsProps> = ({ state, onChange }) => {
  const handleSaveResults = () => {
    const results = generateResultsText(state);
    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'barista-fire-results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateResultsText = (state: CalculatorState): string => {
    const chartData = generateChartData(state);
    const baristaFireNumber = (state.retirementAnnualSpending - (state.monthlyBaristaIncome * 12)) * 100 / state.safeWithdrawalRate;
    const fullFireNumber = state.retirementAnnualSpending * 100 / state.safeWithdrawalRate;

    let results = `Barista FIRE Calculator Results
=================================
Generated on: ${new Date().toLocaleDateString()}

Basic Information
----------------
Current Age: ${state.currentAge}
End Age: ${state.endAge}
Annual Income After Tax: ${formatMoney(state.annualIncomeAfterTax)}
Current Annual Spending: ${formatMoney(state.currentAnnualSpending)}
Current Invested Assets: ${formatMoney(state.currentInvestedAssets)}
Desired Barista FIRE Age: ${state.baristaFireAge}
Annual Spending in Retirement: ${formatMoney(state.retirementAnnualSpending)}
Monthly Income During Barista FIRE: ${formatMoney(state.monthlyBaristaIncome)}

Rate Adjustments
---------------
Investment Growth Rate: ${state.investmentGrowthRate}%
Inflation Rate: ${state.inflationRate}%
Safe Withdrawal Rate: ${state.safeWithdrawalRate}%

${state.showAdvancedFields ? `
Advanced Options
---------------
Monthly Social Security in Retirement: ${formatMoney(state.monthlySocialSecurity)}
Social Security Payment Start Age: ${state.socialSecurityAge}
` : ''}

Key Numbers
----------
Barista FIRE Number: ${formatMoney(baristaFireNumber)}
Full FIRE Number: ${formatMoney(fullFireNumber)}

Yearly Projections
-----------------
Age | Barista FIRE Net Worth | Current Job Net Worth | Full FIRE Number${state.showAdvancedFields ? ' | With Social Security' : ''}
${'-'.repeat(85)}
${chartData.map(data => 
  `${data.age} | ${formatMoney(data.baristaFireNetWorth)} | ${formatMoney(data.currentJobNetWorth)} | ${formatMoney(data.fullFireNumber)}${state.showAdvancedFields ? ` | ${data.socialSecurityImpact ? formatMoney(data.socialSecurityImpact) : 'N/A'}` : ''}`
).join('\n')}

Notes
-----
- All monetary values are shown in today's dollars (adjusted for inflation)
- Social Security impact is shown from age ${state.socialSecurityAge} onwards
- Barista FIRE assumes part-time work income of ${formatMoney(state.monthlyBaristaIncome)} per month
- Investment returns assume ${state.investmentGrowthRate}% growth rate with ${state.inflationRate}% inflation
`;

    return results;
  };

  const handleRangeChange = (name: string) => (value: string) => {
    onChange({
      target: {
        name,
        value,
        type: 'range'
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleNumberChange = (name: string) => (value: number) => {
    onChange({
      target: {
        name,
        value: value.toString(),
        type: 'number'
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Age / Income Goals</h2>
        <button
          onClick={handleSaveResults}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors border-2 border-emerald-500 hover:border-emerald-600 shadow-sm hover:shadow-md flex items-center space-x-2"
        >
          <span>Save Results</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Age Inputs */}
        <NumberInput
          label="Current Age"
          value={state.currentAge}
          onChange={handleNumberChange('currentAge')}
          min={15}
          max={99}
          tooltip="Your current age. This is the starting point for all calculations."
        />

        <NumberInput
          label="End Age"
          value={state.endAge}
          onChange={handleNumberChange('endAge')}
          min={65}
          max={100}
          tooltip="The age until which you want to plan your retirement. Must be higher than your current age and Barista FIRE age."
        />

        {/* Income and Spending */}
        <NumberInput
          label="Annual Income After Tax"
          value={state.annualIncomeAfterTax}
          onChange={handleNumberChange('annualIncomeAfterTax')}
          min={0}
          prefix="$"
          formatCommas={true}
          tooltip="Your current annual income after taxes. This helps calculate your savings potential."
        />

        <NumberInput
          label="Current Annual Spending"
          value={state.currentAnnualSpending}
          onChange={handleNumberChange('currentAnnualSpending')}
          min={0}
          prefix="$"
          formatCommas={true}
          tooltip="Your current annual expenses. This helps establish your lifestyle costs."
        />

        {/* Assets and FIRE Age */}
        <NumberInput
          label="Current Invested Assets"
          value={state.currentInvestedAssets}
          onChange={handleNumberChange('currentInvestedAssets')}
          min={0}
          prefix="$"
          formatCommas={true}
          tooltip="The current value of your investment portfolio."
        />

        <NumberInput
          label="Desired Barista FIRE Age"
          value={state.baristaFireAge}
          onChange={handleNumberChange('baristaFireAge')}
          min={45}
          max={99}
          tooltip="The age at which you plan to transition to part-time work. Must be higher than your current age."
        />

        {/* Retirement Spending and Income */}
        <NumberInput
          label="Annual Spending in Retirement"
          value={state.retirementAnnualSpending}
          onChange={handleNumberChange('retirementAnnualSpending')}
          min={0}
          prefix="$"
          formatCommas={true}
          tooltip="Your expected annual expenses during retirement."
        />

        <NumberInput
          label="Monthly Income During Barista FIRE"
          value={state.monthlyBaristaIncome}
          onChange={handleNumberChange('monthlyBaristaIncome')}
          min={0}
          prefix="$"
          formatCommas={true}
          tooltip="Expected monthly income from part-time work during Barista FIRE."
        />
      </div>

      {/* Rate Sliders */}
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-medium text-gray-800">Rate Adjustments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              Investment Growth Rate (%)
              <InfoTooltip text="Expected annual return on investments before inflation." />
            </label>
            <RangeInput
              value={state.investmentGrowthRate}
              onChange={handleRangeChange('investmentGrowthRate')}
              min={0}
              max={20}
              step={0.5}
              suffix="%"
              showTooltip
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              Inflation Rate (%)
              <InfoTooltip text="Expected annual inflation rate." />
            </label>
            <RangeInput
              value={state.inflationRate}
              onChange={handleRangeChange('inflationRate')}
              min={0}
              max={10}
              step={0.5}
              suffix="%"
              showTooltip
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              Safe Withdrawal Rate (%)
              <InfoTooltip text="The percentage of your portfolio you plan to withdraw annually in retirement." />
            </label>
            <RangeInput
              value={state.safeWithdrawalRate}
              onChange={handleRangeChange('safeWithdrawalRate')}
              min={1}
              max={9}
              step={0.1}
              suffix="%"
              showTooltip
            />
          </div>
        </div>
      </div>

      {/* Advanced Fields Toggle */}
      <div className="mt-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="showAdvancedFields"
            checked={state.showAdvancedFields}
            onChange={onChange}
            className="form-checkbox h-4 w-4 text-[#2563eb] border-gray-300 rounded focus:ring-[#2563eb] cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-700">Show Advanced Options</span>
        </label>
      </div>

      {/* Advanced Fields */}
      {state.showAdvancedFields && (
        <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800">Advanced Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumberInput
              label="Monthly Social Security in Retirement"
              value={state.monthlySocialSecurity}
              onChange={handleNumberChange('monthlySocialSecurity')}
              min={100}
              max={10000}
              prefix="$"
              formatCommas={true}
              tooltip="Expected monthly Social Security benefits in retirement."
            />

            <NumberInput
              label="Social Security Payment Start Age"
              value={state.socialSecurityAge}
              onChange={handleNumberChange('socialSecurityAge')}
              min={62}
              max={70}
              tooltip="Age at which you plan to start receiving Social Security benefits."
            />
          </div>
        </div>
      )}
    </div>
  );
};