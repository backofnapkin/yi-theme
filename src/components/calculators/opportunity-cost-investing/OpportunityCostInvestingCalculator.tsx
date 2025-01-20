import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import InputSection from './InputSection';
import ResultsSection from './ResultsSection';
import GoalTracker from './GoalTracker';
import WhatIfScenarios from './WhatIfScenarios';
import { InputButton } from '../../ui/InputButton';
import { ResetButton } from '../../ui/ResetButton';
import { calculateResults, type CalculatorInputs, type CalculatorResults } from './calculations';

const defaultInputs: CalculatorInputs = {
  initialInvestment: 20000,
  projectedReturn: 3,
  debtServiceEnabled: false,
  debtInterestRate: 20,
  years: 5,
  months: 0,
  taxRate: 15,
  inflationRate: 4.1,
  goalAmount: 50000,
};

export default function OpportunityCostInvestingCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const [results, setResults] = useState<CalculatorResults | null>(null);

  const handleCalculate = () => {
    const calculatedResults = calculateResults(inputs);
    setResults(calculatedResults);
  };

  const handleReset = () => {
    setInputs(defaultInputs);
    setResults(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-2 space-y-2">
      <div className="text-center mb-2">
        <p className="text-gray-600">Compare investment returns, debt savings, and inflation impact in just a few clicks. This tool even runs “what-if” scenarios against the historical performance of stocks, real estate, or bonds to compare common investment choices side by side.</p>
      </div>

      <div className="space-y-8">
        <div className="border border-gray-200 rounded-xl shadow-sm p-6">
          <InputSection 
            inputs={inputs} 
            setInputs={setInputs} 
          />
          
          <div className="flex space-x-4 mt-6">
            <InputButton onClick={handleCalculate}>
              Calculate
            </InputButton>
            <ResetButton onClick={handleReset} />
          </div>
        </div>

        {results && (
          <div className="space-y-8">
            <div className="border border-gray-200 rounded-xl shadow-sm p-6">
              <ResultsSection results={results} inputs={inputs} />
            </div>
            
            <div className="border border-gray-200 rounded-xl shadow-sm p-6">
              <GoalTracker results={results} inputs={inputs} />
            </div>
            
            <div className="border border-gray-200 rounded-xl shadow-sm p-6">
              <WhatIfScenarios inputs={inputs} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}