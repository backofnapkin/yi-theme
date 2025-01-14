import React from 'react';
import { Printer, AlertTriangle } from 'lucide-react';
import type { CalculationResults } from './types';
import { ResultsChart } from './ResultsChart';
import { Card } from './ui/Card';
import { formatCurrency, formatPercentage } from './utils';

type ViewType = 'gross' | 'afterTax' | 'afterExpenses' | 'invested';

interface Props {
  results: CalculationResults;
  selectedView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const CalculatorResults: React.FC<Props> = ({ 
  results, 
  selectedView,
  onViewChange 
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      <Card className="!bg-gradient-to-br !from-green-100 !to-emerald-100 !border !border-emerald-200">
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
      </Card>

      <div>
        <h3 className="text-xl font-bold mb-4 text-gray-900">Road to $1 Million Timeline</h3>
        <ResultsChart 
          results={results} 
          selectedView={selectedView}
          onViewChange={onViewChange}
        />
      </div>

      <Card className="!bg-gradient-to-br !from-orange-100 !to-amber-100 !border !border-amber-200">
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
              {formatPercentage(results.annualSummary.taxRate)}
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
      </Card>
    </div>
  );
};