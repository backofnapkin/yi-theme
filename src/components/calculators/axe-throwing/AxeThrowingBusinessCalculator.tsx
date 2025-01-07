import React, { useState } from 'react';
import { Axe } from 'lucide-react';
import { InputSection } from './InputSection';
import { ResultsSection } from './ResultsSection';
import type { CalculatorInputs, CalculatorResults } from './types';
import { calculateResults } from './calculations';

const defaultInputs: CalculatorInputs = {
  businessName: "Abe's Axe to Grind",
  leaseholdImprovements: 200000,
  laneSetupCost: 1500,
  numberOfLanes: 8,
  numberOfAxes: 50,
  costPerAxe: 150,
  permitsAndLicenses: 1000,
  initialMarketing: 10000,
  walkInPrice: 40,
  averageGroupSize: 3,
  corporateEventPrice: 1000,
  monthlyCorpEvents: 4,
  peakHours: 15,
  peakUtilization: 90,
  offPeakHours: 10,
  offPeakUtilization: 60,
  monthlyRent: 6000,
  monthlyInsurance: 500,
  monthlyUtilities: 800,
  monthlyWages: 5000,
  monthlyMarketing: 2000,
  maintenanceCostPerLane: 100,
  customExpenses: []
};

export default AxeThrowingBusinessCalculator;
export function AxeThrowingBusinessCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const [results, setResults] = useState<CalculatorResults | null>(null);

  const handlePrint = () => {
    const printContent = document.getElementById('results-section')?.innerHTML;
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${inputs.businessName} - Financial Projections</title>
              <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            </head>
            <body class="p-8">
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };
      
  const handleCalculate = () => {
    const calculatedResults = calculateResults(inputs);
    setResults(calculatedResults);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-[rgb(var(--color-fill))] rounded-lg shadow-lg p-6 mb-8 border border-[rgba(var(--color-border),0.3)]">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[rgb(var(--color-text))] flex items-center gap-2">
            <Axe className="h-8 w-8 text-[rgb(var(--color-border))]" />
            Axe Throwing Business Calculator
          </h1>
        </div>

        <InputSection
          inputs={inputs}
          setInputs={setInputs}
        />

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleCalculate}
            className="flex items-center gap-2 px-12 py-4 bg-[#0EC07C] text-white rounded-lg hover:bg-[#0CAD6F] transition-colors text-xl font-semibold border-2 border-[#0EC07C] hover:border-[#0CAD6F] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
          >
            <Axe className="h-7 w-7" />
            Calculate Results
          </button>
        </div>
      </div>

      {results && (
        <ResultsSection 
          results={results} 
          businessName={inputs.businessName}
        />
      )}
    </div>
  );
}
