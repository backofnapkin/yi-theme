import React, { useState } from 'react';
import { Download, ArrowLeft, ArrowRight } from 'lucide-react';
import type { TowTruckBusinessData, CalculationResults } from './types';
import { BusinessInfoStep } from './steps/BusinessInfoStep';
import { FinancialDetailsStep } from './steps/FinancialDetailsStep';
import { ExpensesStep } from './steps/ExpensesStep';
import { ResultsDashboard } from './steps/ResultsDashboard';
import { ProgressBar } from './components/ProgressBar';
import { calculateResults } from './calculations';
import { InputButton } from './components/InputButton';

const defaultData: TowTruckBusinessData = {
  companyName: "Tommie's Towing",
  numTrucks: 1,
  truckFinancing: [{
    truckPrice: 100000,
    downPayment: 20000,
    interestRate: 10,
    loanTerm: 5
  }],
  operatingDays: 25,
  towsPerDay: 7,
  feePerTow: 100,
  fuelCostPerGallon: 3.55,
  milesPerGallon: 10,
  monthlyInsurance: 428,
  monthlyMaintenance: 500,
  monthlyBrokerFees: 400,
  monthlyLaborCosts: 0,
  customExpenses: [],
  monthlyGrowthRate: 0.0 // Changed to 0.0% monthly growth by default
};

const steps = [
  { id: 1, name: 'Business Details' },
  { id: 2, name: 'Financial Details' },
  { id: 3, name: 'Expenses' },
  { id: 4, name: 'Results' }
];

export default function TowTruckBusinessCalculator() {
  const [data, setData] = useState<TowTruckBusinessData>(defaultData);
  const [currentStep, setCurrentStep] = useState(1);
  const results = calculateResults(data);

  const handleInputChange = (field: keyof TowTruckBusinessData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const addCustomExpense = () => {
    setData(prev => ({
      ...prev,
      customExpenses: [...prev.customExpenses, { name: '', amount: 0 }]
    }));
  };

  const removeCustomExpense = (index: number) => {
    setData(prev => ({
      ...prev,
      customExpenses: prev.customExpenses.filter((_, i) => i !== index)
    }));
  };

  const updateCustomExpense = (index: number, field: 'name' | 'amount', value: string | number) => {
    setData(prev => ({
      ...prev,
      customExpenses: prev.customExpenses.map((expense, i) => 
        i === index ? { ...expense, [field]: value } : expense
      )
    }));
  };

  const nextStep = () => {
    console.log("Next step clicked, current step:", currentStep);
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const previousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const downloadResults = () => {
    const content = generateReportContent(data, results);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.companyName.replace(/\s+/g, '_')}_business_projection.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessInfoStep
            data={data}
            onInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <FinancialDetailsStep
            data={data}
            onInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <ExpensesStep
            data={data}
            onInputChange={handleInputChange}
            onAddCustomExpense={addCustomExpense}
            onRemoveCustomExpense={removeCustomExpense}
            onUpdateCustomExpense={updateCustomExpense}
          />
        );
      case 4:
        return (
          <ResultsDashboard
            results={results}
            data={data}
            onDownload={downloadResults}
            onEdit={() => setCurrentStep(1)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-1">
          <p className="mt-1 text-xl text-gray-500">
            Calculate potential earnings, expenses, and net profits for a tow truck business.
          </p>
        </div>

        <ProgressBar
          steps={steps}
          currentStep={currentStep}
          onStepClick={goToStep}
        />

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
          {renderStep()}

          {currentStep < steps.length && (
            <div className="mt-8 flex justify-between">
              {currentStep > 1 ? (
                <button
                  onClick={previousStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Previous
                </button>
              ) : (
                <div></div>
              )}
              <button
                onClick={nextStep}
                className="inline-flex items-center px-6 py-2 rounded-lg font-semibold transition-colors bg-gradient-to-br from-green-50 to-emerald-50 text-gray-700 hover:from-green-100 hover:to-emerald-100 active:from-green-200 active:to-emerald-200 border border-emerald-100 shadow-sm"
              >
                {currentStep === steps.length - 1 ? 'See Results' : 'Continue'}
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function generateReportContent(data: TowTruckBusinessData, results: CalculationResults): string {
  return `
${data.companyName} - Business Projection Report
Generated on ${new Date().toLocaleDateString()}

BUSINESS ASSUMPTIONS
------------------
Number of Trucks: ${data.numTrucks}
Operating Days per Month: ${data.operatingDays}
Average Tows per Day: ${data.towsPerDay}
Fee per Tow: $${data.feePerTow}
Monthly Growth Rate: ${data.monthlyGrowthRate}%

FINANCIAL PROJECTIONS
-------------------
Monthly Revenue: $${results.monthlyRevenue.toLocaleString()}
Yearly Revenue: $${results.yearlyRevenue.toLocaleString()}
Monthly Expenses: $${results.monthlyExpenses.toLocaleString()}
Yearly Expenses: $${results.yearlyExpenses.toLocaleString()}
Monthly Profit: $${results.monthlyProfit.toLocaleString()}
Yearly Profit: $${results.yearlyProfit.toLocaleString()}

Required Tows per Month to Break Even: ${Math.ceil(results.requiredTowsPerMonth)}

MONTHLY CASH FLOW
---------------
${results.cashFlow.oneYear.map(flow => 
  `${flow.month}:
   Revenue: $${flow.revenue.toLocaleString()}
   Expenses: $${flow.expenses.toLocaleString()}
   Profit: $${flow.profit.toLocaleString()}
  `).join('\n')}
`;
}