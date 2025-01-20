import React from 'react';
import { LineChart, Building2, Landmark } from 'lucide-react';
import { type CalculatorInputs } from './calculations';

const SCENARIO_RETURNS = {
  stocks: 12.8,
  realEstate: 4.2,
  bonds: 1.5
};

interface WhatIfScenariosProps {
  inputs: CalculatorInputs;
}

export default function WhatIfScenarios({ inputs }: WhatIfScenariosProps) {
  const calculateScenarioValue = (annualReturn: number) => {
    const totalMonths = inputs.years * 12 + inputs.months;
    return inputs.initialInvestment * Math.pow(1 + annualReturn / 100 / 12, totalMonths);
  };

  return (
    <div>
      <div className="!bg-gradient-to-br !from-orange-100 !to-amber-100 !border !border-amber-200 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">What If Scenarios?</h2>
        
        <div className="space-y-4 text-gray-700">
          <div className="flex items-start gap-3">
            <LineChart className="h-5 w-5 mt-1 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900">Stock Market Investment</h3>
              <p>
                With {SCENARIO_RETURNS.stocks}% annualized return, your investment could grow to{' '}
                <span className="font-semibold text-blue-600">
                  ${calculateScenarioValue(SCENARIO_RETURNS.stocks).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 mt-1 text-purple-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900">Real Estate Investment</h3>
              <p>
                With {SCENARIO_RETURNS.realEstate}% annualized return, your investment could grow to{' '}
                <span className="font-semibold text-purple-600">
                  ${calculateScenarioValue(SCENARIO_RETURNS.realEstate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Landmark className="h-5 w-5 mt-1 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900">Bond Investment</h3>
              <p>
                With {SCENARIO_RETURNS.bonds}% annualized return, your investment could grow to{' '}
                <span className="font-semibold text-green-600">
                  ${calculateScenarioValue(SCENARIO_RETURNS.bonds).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}