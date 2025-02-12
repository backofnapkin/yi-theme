import React, { useState } from 'react';
import { Info, Download, Calculator, LineChart } from 'lucide-react';
import 'remixicon/fonts/remixicon.css';
import { CoastFireChart } from './CoastFireChart';
import { NumberInput } from './NumberInput';
import { calculateCoastFire, formatCurrency, formatPercentage } from './utils';
import { Tooltip } from '../../ui/Tooltip';
import type { CoastFireInputs, CoastFireResults } from './types';

const defaultInputs: CoastFireInputs = {
  currentAge: 35,
  retirementAge: 65,
  annualSpending: 40000,
  currentInvestedAssets: 100000,
  monthlyContributions: 400,
  investmentGrowthRate: 10,
  inflationRate: 3,
  safeWithdrawalRate: 4,
  advancedOptions: {
    monthlySocialSecurity: 2000,
    socialSecurityStartAge: 67
  }
};

export const CoastFireCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CoastFireInputs>(defaultInputs);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSocialSecurity, setShowSocialSecurity] = useState(false);

  const results = calculateCoastFire(inputs);

  const handleInputChange = (
    field: keyof CoastFireInputs | keyof Required<CoastFireInputs>['advancedOptions'],
    value: number,
    isAdvanced = false
  ) => {
    if (isAdvanced) {
      setInputs(prev => ({
        ...prev,
        advancedOptions: {
          ...prev.advancedOptions!,
          [field]: value
        }
      }));
    } else {
      setInputs(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const downloadResults = () => {
    const content = `Coast FIRE Calculator Results\n
Current Age: ${inputs.currentAge}
Retirement Age: ${inputs.retirementAge}
Annual Spending in Retirement: ${formatCurrency(inputs.annualSpending)}
Current Invested Assets: ${formatCurrency(inputs.currentInvestedAssets)}
Monthly Contributions: ${formatCurrency(inputs.monthlyContributions)}
Investment Growth Rate: ${formatPercentage(inputs.investmentGrowthRate)}
Inflation Rate: ${formatPercentage(inputs.inflationRate)}
Safe Withdrawal Rate: ${formatPercentage(inputs.safeWithdrawalRate)}

Results:
Target FIRE Number: ${formatCurrency(results.targetFireNumber)}
Future Value of Current Investments: ${formatCurrency(results.futureValueCurrentInvestments)}
Coast FIRE Number: ${formatCurrency(results.coastFireNumber)}
Additional Amount Needed: ${formatCurrency(results.additionalNeeded)}
Progress to Coast FIRE: ${results.progressPercentage.toFixed(1)}%

${showAdvanced ? `
Advanced Options:
Monthly Social Security: ${formatCurrency(inputs.advancedOptions!.monthlySocialSecurity)}
Social Security Start Age: ${inputs.advancedOptions!.socialSecurityStartAge}
` : ''}

Projections created by BackofNapkin.co as part of a collaboration with coastficouple.com.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coast-fire-results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
    <Tooltip content={text}>
      <Info className="w-4 h-4 text-gray-500 inline-block ml-2" />
    </Tooltip>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <style>
        {`
          input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            background: transparent;
            width: 100%;
            margin: 4px 0;
          }
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: rgb(5, 150, 105);
            cursor: pointer;
            margin-top: -4px;
          }
          input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border: none;
            border-radius: 50%;
            background: rgb(5, 150, 105);
            cursor: pointer;
          }
          input[type="range"]::-webkit-slider-runnable-track {
            width: 100%;
            height: 8px;
            background: rgb(229, 231, 235);
            border-radius: 4px;
          }
          input[type="range"]::-moz-range-track {
            width: 100%;
            height: 8px;
            background: rgb(229, 231, 235);
            border-radius: 4px;
          }
          input[type="range"]:focus {
            outline: none;
          }
          input[type="checkbox"] {
            accent-color: rgb(5, 150, 105);
            cursor: pointer;
          }
          input[type="checkbox"]:focus {
            outline: 2px solid rgb(5, 150, 105);
            outline-offset: 2px;
          }
        `}
      </style>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Calculator className="mr-2" />
          Coast FIRE Calculator
        </h1>
        <button
          onClick={downloadResults}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Save Results
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <NumberInput
            label="Current Age"
            value={inputs.currentAge}
            onChange={(value) => handleInputChange('currentAge', value)}
            min={15}
            max={99}
            tooltip="Your current age (15-99 years)"
          />

          <NumberInput
            label="Retirement Age"
            value={inputs.retirementAge}
            onChange={(value) => handleInputChange('retirementAge', value)}
            min={inputs.currentAge + 1}
            max={99}
            tooltip="Your target retirement age (must be greater than current age)"
          />

          <NumberInput
            label="Annual Spending in Retirement"
            value={inputs.annualSpending}
            onChange={(value) => handleInputChange('annualSpending', value)}
            min={1000}
            max={999999}
            prefix="$"
            tooltip="Expected annual spending in retirement ($1,000 - $999,999)"
          />

          <NumberInput
            label="Current Invested Assets"
            value={inputs.currentInvestedAssets}
            onChange={(value) => handleInputChange('currentInvestedAssets', value)}
            min={0}
            max={99999999}
            prefix="$"
            tooltip="Your current investment portfolio value ($0 - $99,999,999)"
          />

          <NumberInput
            label="Monthly Contributions"
            value={inputs.monthlyContributions}
            onChange={(value) => handleInputChange('monthlyContributions', value)}
            min={0}
            max={99999}
            prefix="$"
            tooltip="Monthly investment contributions ($0 - $99,999)"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Investment Growth Rate (Annual %)
              <InfoTooltip text="Expected annual investment return (0-20%)" />
            </label>
            <input
              type="range"
              min="0"
              max="20"
              step="0.1"
              value={inputs.investmentGrowthRate}
              onChange={(e) => handleInputChange('investmentGrowthRate', Number(e.target.value))}
              className="mt-1 block w-full"
            />
            <span className="text-sm text-gray-500">{formatPercentage(inputs.investmentGrowthRate)}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Inflation Rate (Annual %)
              <InfoTooltip text="Expected annual inflation rate (0-10%)" />
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={inputs.inflationRate}
              onChange={(e) => handleInputChange('inflationRate', Number(e.target.value))}
              className="mt-1 block w-full"
            />
            <span className="text-sm text-gray-500">{formatPercentage(inputs.inflationRate)}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Safe Withdrawal Rate (Annual %)
              <InfoTooltip text="Annual withdrawal rate in retirement (1-9%)" />
            </label>
            <input
              type="range"
              min="1"
              max="9"
              step="0.1"
              value={inputs.safeWithdrawalRate}
              onChange={(e) => handleInputChange('safeWithdrawalRate', Number(e.target.value))}
              className="mt-1 block w-full"
            />
            <span className="text-sm text-gray-500">{formatPercentage(inputs.safeWithdrawalRate)}</span>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {showAdvanced ? '- Hide Advanced Options' : '+ Show Advanced Options'}
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4">
                <NumberInput
                  label="Monthly Social Security in Retirement"
                  value={inputs.advancedOptions!.monthlySocialSecurity}
                  onChange={(value) => handleInputChange('monthlySocialSecurity', value, true)}
                  min={100}
                  max={10000}
                  prefix="$"
                  tooltip="Expected monthly Social Security benefit ($100 - $10,000)"
                />

                <NumberInput
                  label="Social Security Start Age"
                  value={inputs.advancedOptions!.socialSecurityStartAge}
                  onChange={(value) => handleInputChange('socialSecurityStartAge', value, true)}
                  min={62}
                  max={70}
                  tooltip="Age to begin receiving Social Security (62-70)"
                />

                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={showSocialSecurity}
                      onChange={(e) => setShowSocialSecurity(e.target.checked)}
                      className="rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Show Social Security Impact</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="ri-line-chart-line mr-2 text-emerald-600 text-xl"></i>
          Your Coast FIRE Projections
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-sm text-gray-600">
              Target FIRE Number
              <InfoTooltip text="The total amount you need to save for retirement. Calculated as your annual spending divided by your safe withdrawal rate." />
            </div>
            <div className="text-lg font-semibold">{formatCurrency(results.targetFireNumber)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">
              Future Value of Current Investments
              <InfoTooltip text="The projected value of your current investments at retirement age, assuming no additional contributions and your specified investment growth rate." />
            </div>
            <div className="text-lg font-semibold">{formatCurrency(results.futureValueCurrentInvestments)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">
              Coast FIRE Number
              <InfoTooltip text="The amount you need to have invested today so that investment returns alone will grow your portfolio to your target retirement number, without any additional contributions." />
            </div>
            <div className="text-lg font-semibold text-skin-emerald-text">{formatCurrency(results.coastFireNumber)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">
              Additional Amount Needed
              <InfoTooltip text="The extra amount you need to invest to reach your Coast FIRE number. Once you reach this number, you can theoretically stop contributing and still reach your retirement goal." />
            </div>
            <div className="text-lg font-semibold text-skin-red-text">{formatCurrency(results.additionalNeeded)}</div>
          </div>
        </div>

        <CoastFireChart
          data={results.timelineData}
          showSocialSecurity={showAdvanced && showSocialSecurity}
          showTaxImpact={false}
          inflationRate={inputs.inflationRate}
          currentAge={inputs.currentAge}
        />
      </div>
    </div>
  );
};