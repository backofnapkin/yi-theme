import React from 'react';
import type { CalculatorState } from './types';
import { InfoTooltip } from './InfoTooltip';
import { formatMoney } from './utils';
import { RangeInput } from './RangeInput';
import { NumberInput } from './NumberInput';
import { generateChartData, calculateCoastFireNumber, calculateFullFireNumber, calculateYearsToCoastFire } from './utils';

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
    a.download = `coast-fire-results-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateResultsText = (state: CalculatorState): string => {
    const chartData = generateChartData(state);
    const coastFireNumber = calculateCoastFireNumber(state);
    const fullFireNumber = calculateFullFireNumber(state);
    const yearsToCoastFire = calculateYearsToCoastFire(state);
    const projectedNetWorth = chartData.find(data => data.age === state.targetRetirementAge)?.currentPathNetWorth || 0;

    let results = `Coast FIRE Calculator Results
=================================
Generated on: ${new Date().toLocaleDateString()}

Current Status
-------------
Age: ${state.currentAge}
Current Invested Assets: ${formatMoney(state.currentInvestedAssets)}
Monthly Contributions: ${formatMoney(state.monthlyContributions)}

Retirement Goals
--------------
Target Retirement Age: ${state.targetRetirementAge}
Annual Spending in Retirement: ${formatMoney(state.retirementAnnualSpending)}
Safe Withdrawal Rate: ${state.safeWithdrawalRate}%

Investment Assumptions
--------------------
Investment Growth Rate: ${state.investmentGrowthRate}%
Inflation Rate: ${state.inflationRate}%
Real Rate of Return: ${((1 + state.investmentGrowthRate / 100) / (1 + state.inflationRate / 100) - 1) * 100}%

Key Numbers (in Today's Dollars)
------------------------------
Coast FIRE Number Needed: ${formatMoney(coastFireNumber)}
Full FIRE Number: ${formatMoney(fullFireNumber)}
Projected Net Worth at ${state.targetRetirementAge}: ${formatMoney(projectedNetWorth)}
Additional Amount Needed for Coast FIRE: ${formatMoney(Math.max(0, coastFireNumber - state.currentInvestedAssets))}

Coast FIRE Timeline
-----------------
${yearsToCoastFire === null
  ? "You will not reach Coast FIRE with current contributions."
  : yearsToCoastFire === 0
    ? "You have already reached Coast FIRE!"
    : `Years until Coast FIRE: ${yearsToCoastFire}
Expected Age at Coast FIRE: ${state.currentAge + yearsToCoastFire}`
}

${state.showAdvancedFields ? `
Social Security Details
--------------------
Monthly Social Security Benefit: ${formatMoney(state.monthlySocialSecurity)}
Benefit Start Age: ${state.socialSecurityAge}
` : ''}

Yearly Projections
-----------------
Age | Coast FIRE Target | With Contributions | No Contributions After Coast | Full FIRE Number${state.showAdvancedFields ? ' | With Social Security' : ''}
${'-'.repeat(100)}
${chartData.map(data => 
  `${data.age} | ${formatMoney(data.coastFireNetWorth)} | ${formatMoney(data.currentPathNetWorth)} | ${formatMoney(data.noContributionsAfterCoastNetWorth)} | ${formatMoney(data.fullFireNumber)}${state.showAdvancedFields ? ` | ${data.socialSecurityImpact ? formatMoney(data.socialSecurityImpact) : 'N/A'}` : ''}`
).join('\n')}

Notes
-----
- All monetary values are shown in today's dollars (adjusted for inflation)
- The Coast FIRE number represents the amount needed today to reach your retirement goal
- "With Contributions" shows your projected net worth if you continue monthly contributions
- "No Contributions After Coast" shows your projected net worth if you stop contributing after reaching Coast FIRE
- The Full FIRE number represents the amount needed to retire completely
${state.showAdvancedFields ? '- Social Security impact is shown from your selected start age onwards' : ''}
- Investment returns assume ${state.investmentGrowthRate}% nominal growth with ${state.inflationRate}% inflation
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
        <h2 className="text-xl font-semibold text-gray-800">Age / Investment Inputs</h2>
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
          tooltip="The age until which you want to plan your retirement. Must be higher than your current age and target retirement age."
        />

        {/* Assets and Retirement Age */}
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
          label="Monthly Contributions"
          value={state.monthlyContributions}
          onChange={handleNumberChange('monthlyContributions')}
          min={0}
          prefix="$"
          formatCommas={true}
          tooltip="How much you plan to invest each month. This helps project your future portfolio value."
        />

        <NumberInput
          label="Target Retirement Age"
          value={state.targetRetirementAge}
          onChange={handleNumberChange('targetRetirementAge')}
          min={45}
          max={99}
          tooltip="The age at which you plan to retire. Your investments need to grow to support this."
        />

        {/* Retirement Spending */}
        <NumberInput
          label="Annual Spending in Retirement"
          value={state.retirementAnnualSpending}
          onChange={handleNumberChange('retirementAnnualSpending')}
          min={0}
          prefix="$"
          formatCommas={true}
          tooltip="Your expected annual expenses during retirement."
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
              step={0.1}
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
              step={0.1}
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
            className="form-checkbox h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-600 cursor-pointer"
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
              min={0}
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