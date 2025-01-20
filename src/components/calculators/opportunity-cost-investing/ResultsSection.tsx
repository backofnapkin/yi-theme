import React from 'react';
import { TrendingUp, Thermometer, Target } from 'lucide-react';
import { type CalculatorInputs, type CalculatorResults } from './calculations';

interface ResultsSectionProps {
  results: CalculatorResults;
  inputs: CalculatorInputs;
}

export default function ResultsSection({ results, inputs }: ResultsSectionProps) {
  const totalGain = Math.round(results.futureValue - inputs.initialInvestment);
  const timeString = inputs.months > 0 ? 
    `${inputs.years} years and ${inputs.months} months` : 
    `${inputs.years} years`;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Opportunity Cost Results</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Future Value
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Based on the inputs, your investment will generate ${totalGain.toLocaleString()} in {timeString}.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Total Value: <span className="font-semibold text-skin-emerald-text">${Math.round(results.futureValue).toLocaleString()}</span>
              </p>
              <p className="text-sm text-gray-600">
                After Tax: <span className="font-semibold text-gray-900">${Math.round(results.afterTaxValue).toLocaleString()}</span>
              </p>
              <p className="text-sm text-gray-600">
                Real Value (Inflation Adjusted): <span className="font-semibold text-gray-900">${Math.round(results.realValue).toLocaleString()}</span>
              </p>
            </div>
          </div>

          {inputs.debtServiceEnabled && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Debt Service Comparison</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Interest Saved: <span className="font-semibold text-gray-900">${Math.round(results.debtServiceSavings).toLocaleString()}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Net Difference: <span className={`font-semibold ${results.netOpportunityCost >= 0 ? 'text-green-600' : 'text-skin-red-text'}`}>
                    ${Math.abs(Math.round(results.netOpportunityCost)).toLocaleString()}
                  </span>
                </p>
                <p className="text-sm font-medium">
                  {results.netOpportunityCost >= 0 ? 
                    'Investing provides better returns' : 
                    'Paying down debt provides better returns'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-2 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-orange-600" />
            Inflation Impact
          </h3>
          <p className="text-sm text-gray-600">
            Your ${Math.round(results.futureValue).toLocaleString()} in {inputs.years} years will have the same purchasing power as ${Math.round(results.realValue).toLocaleString()} today
          </p>
        </div>

        {inputs.goalAmount > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Target className="h-5 w-5 text-skin-red-text" />
              Goal Progress
            </h3>
            <p className="text-sm text-gray-600">
              {results.futureValue >= inputs.goalAmount ? (
                <span className="text-green-600">
                  Congratulations! You will exceed your ${inputs.goalAmount.toLocaleString()} goal by ${Math.round(results.futureValue - inputs.goalAmount).toLocaleString()}
                </span>
              ) : (
                <span className="text-skin-red-text">
                  You will fall short of your ${inputs.goalAmount.toLocaleString()} goal by ${Math.round(inputs.goalAmount - results.futureValue).toLocaleString()}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}