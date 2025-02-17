import React, { useState } from 'react';
import { Coffee, LineChart } from 'lucide-react';
import type { CalculatorState } from './types';
import { InputFields } from './InputFields';
import { BaristaFireChart } from './BaristaFireChart';
import { ResultsPanel } from './ResultsPanel';
import { generateChartData, getFIREMessage } from './utils';

const defaultState: CalculatorState = {
  currentAge: 35,
  endAge: 80,
  annualIncomeAfterTax: 75000,
  currentAnnualSpending: 65000,
  currentInvestedAssets: 100000,
  baristaFireAge: 55,
  retirementAnnualSpending: 50000,
  monthlyBaristaIncome: 2000,
  investmentGrowthRate: 10,
  inflationRate: 3,
  safeWithdrawalRate: 4,
  showAdvancedFields: false,
  monthlySocialSecurity: 2000,
  socialSecurityAge: 67,
  showExtendedChart: false,
  selectedChartLines: ['baristaFire', 'currentJob', 'fullFire']
};

export const BaristaFireCalculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>(defaultState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : Number(value)
    }));
  };

  const handleLineToggle = (line: string) => {
    setState(prev => ({
      ...prev,
      selectedChartLines: prev.selectedChartLines.includes(line)
        ? prev.selectedChartLines.filter(l => l !== line)
        : [...prev.selectedChartLines, line]
    }));
  };

  const toggleExtendedChart = () => {
    setState(prev => ({
      ...prev,
      showExtendedChart: !prev.showExtendedChart
    }));
  };

  const chartData = generateChartData(state);
  const messages = getFIREMessage(state);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Coffee className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900">Barista FIRE Calculator</h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Input Fields */}
          <div>
            <InputFields state={state} onChange={handleInputChange} />
          </div>

          {/* Results Panel */}
          <div className="flex items-center space-x-2 mt-6 mb-2">
            <Coffee className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-900">Your Barista FIRE Projections</h2>
          </div>

          {/* Extended Chart Toggle */}
          <div className="flex justify-end">
            <button
              onClick={toggleExtendedChart}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
            >
              <LineChart className="w-4 h-4" />
              <span>{state.showExtendedChart ? "Show Standard Timeline" : "Show Extended Timeline"}</span>
            </button>
          </div>

          {/* Chart */}
          <BaristaFireChart
            data={chartData}
            selectedLines={state.selectedChartLines}
            onLineToggle={handleLineToggle}
          />

          {/* Messages */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm`}
                >
                  {message.message}
                </div>
              ))}
            </div>
          </div>

          {/* Key Numbers */}
          <ResultsPanel state={state} messages={[]} />
        </div>
      </div>
    </div>
  );
};

export default BaristaFireCalculator;