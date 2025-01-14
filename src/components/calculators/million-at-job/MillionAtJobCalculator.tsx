import React, { useState } from 'react';
import { Printer, AlertTriangle } from 'lucide-react';
import type { CalculatorInputs, CalculationResults } from './types';
import { CalculatorInputsForm } from './CalculatorInputs';
import { ResultsChart } from './ResultsChart';
import { calculateTaxRate, calculateTimeToMillion, formatYearsAndMonths, formatCurrency } from './utils';
import { Card } from './ui/Card';

const defaultInputs: CalculatorInputs = {
  incomeType: 'annual',
  incomeAmount: 75000,
  filingStatus: 'single',
  monthlyExpenses: 4641,
  investmentReturns: 7,
  currentAge: 35,
};

type ViewType = 'gross' | 'afterTax' | 'afterExpenses' | 'invested';

export const MillionAtJobCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [selectedView, setSelectedView] = useState<ViewType>('gross');

  const handlePrint = () => {
    window.print();
  };

  const calculateResults = () => {
    const annualIncome = inputs.incomeType === 'hourly' 
      ? inputs.incomeAmount * 40 * 52 
      : inputs.incomeAmount;

    const taxRate = calculateTaxRate(annualIncome, inputs.filingStatus);
    const { gross, afterTax, afterExpenses, invested } = calculateTimeToMillion(
      annualIncome,
      taxRate,
      inputs.monthlyExpenses,
      inputs.investmentReturns
    );

    const grossTime = formatYearsAndMonths(gross);
    const afterTaxTime = formatYearsAndMonths(afterTax);
    const afterExpensesTime = formatYearsAndMonths(afterExpenses);
    const investedTime = formatYearsAndMonths(invested);

    setResults({
      grossIncome: {
        ...grossTime,
        ageAtGoal: inputs.currentAge + grossTime.years,
      },
      afterTaxIncome: {
        ...afterTaxTime,
        ageAtGoal: inputs.currentAge + afterTaxTime.years,
      },
      afterTaxAndExpenses: {
        ...afterExpensesTime,
        ageAtGoal: inputs.currentAge + afterExpensesTime.years,
        impossible: afterExpenses === Infinity,
      },
      investedAmount: {
        ...investedTime,
        ageAtGoal: inputs.currentAge + investedTime.years,
        impossible: invested === Infinity,
      },
      annualSummary: {
        annualIncome,
        taxRate: taxRate * 100,
        afterTaxIncome: annualIncome * (1 - taxRate),
        investableAmount: annualIncome * (1 - taxRate) - (inputs.monthlyExpenses * 12),
        monthlyExpenses: inputs.monthlyExpenses,
        investmentReturns: inputs.investmentReturns
      },
    });

    if ((selectedView === 'afterExpenses' && afterExpenses === Infinity) ||
        (selectedView === 'invested' && invested === Infinity)) {
      setSelectedView('gross');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="border border-gray-200 rounded-xl shadow-sm p-8 bg-white">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">$1 Million Dollars from Work Calculator</h1>
              <p className="mt-2 text-gray-600">Calculate your path to $1 million based on your income and expenses</p>
            </div>

            <CalculatorInputsForm
              inputs={inputs}
              onChange={(newInputs) => setInputs({ ...inputs, ...newInputs })}
              onCalculate={calculateResults}
              onReset={() => {
                setInputs(defaultInputs);
                setResults(null);
              }}
            />

            {results && (
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-emerald-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Your Time to $1 Million Dollars</h2>
                    <button
                      onClick={handlePrint}
                      className="flex items-center px-4 py-2 bg-emerald-100 text-gray-700 rounded-lg hover:bg-emerald-200 active:bg-emerald-300 font-semibold transition-colors print:hidden"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print Results
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Gross Income Path</h3>
                      <p className="text-2xl font-bold text-gray-900">
                        {results.grossIncome.years}y {results.grossIncome.months}m
                      </p>
                      <p className="text-sm text-gray-600">
                        You'll reach your goal at age {results.grossIncome.ageAtGoal}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">After Tax Path</h3>
                      <p className="text-2xl font-bold text-gray-900">
                        {results.afterTaxIncome.years}y {results.afterTaxIncome.months}m
                      </p>
                      <p className="text-sm text-gray-600">
                        You'll reach your goal at age {results.afterTaxIncome.ageAtGoal}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">After Expenses Path</h3>
                      {results.afterTaxAndExpenses.impossible ? (
                        <div className="flex items-start space-x-2 text-amber-600">
                          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">Not possible with current expenses</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-2xl font-bold text-gray-900">
                            {results.afterTaxAndExpenses.years}y {results.afterTaxAndExpenses.months}m
                          </p>
                          <p className="text-sm text-gray-600">
                            You'll reach your goal at age {results.afterTaxAndExpenses.ageAtGoal}
                          </p>
                        </>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Investment Path</h3>
                      {results.investedAmount.impossible ? (
                        <div className="flex items-start space-x-2 text-amber-600">
                          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">Not possible with current plan</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-2xl font-bold text-emerald-600">
                            {results.investedAmount.years}y {results.investedAmount.months}m
                          </p>
                          <p className="text-sm text-gray-600">
                            You'll reach your goal at age {results.investedAmount.ageAtGoal}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Road to $1 Million Timeline</h3>
                  <ResultsChart 
                    results={results} 
                    selectedView={selectedView} 
                    onViewChange={setSelectedView}
                  />
                </div>

                <div className="bg-gradient-to-br from-orange-100 to-amber-100 border-amber-200">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Annual Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Annual Income</h3>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(results.annualSummary.annualIncome)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Tax Rate</h3>
                      <p className="text-xl font-bold text-gray-900">
                        {results.annualSummary.taxRate.toFixed(1)}%
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">After-Tax Income</h3>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(results.annualSummary.afterTaxIncome)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">Available to Invest</h3>
                      <p className="text-xl font-bold text-emerald-600">
                        {formatCurrency(results.annualSummary.investableAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MillionAtJobCalculator;