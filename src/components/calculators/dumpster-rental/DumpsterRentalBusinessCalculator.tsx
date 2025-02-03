import React, { useState } from 'react';
import { StartupCosts } from './StartupCosts';
import { OperationalCosts } from './OperationalCosts';
import { AdditionalRevenue } from './AdditionalRevenue';
import { CalculatorHeader } from './CalculatorHeader';
import { MonthlyResults } from './results/MonthlyResults';
import { AnnualResults } from './results/AnnualResults';
import { ROITimeline } from './results/ROITimeline';
import { ProjectionsTable } from './results/ProjectionsTable';
import { defaultCalculatorState } from './calculatorDefaults';
import { calculateResults } from './calculations';
import { generateCSV } from './utils';
import { Building } from 'lucide-react';
import { InputButton } from '../../ui/InputButton';
import { BorderContainer } from '../../ui/BorderContainer';
import type { CalculatorState, CalculationResults } from './types';

export function DumpsterRentalBusinessCalculator() {
  const [calculatorState, setCalculatorState] = useState<CalculatorState>(defaultCalculatorState);
  const [results, setResults] = useState<CalculationResults | null>(null);

  const handleReset = () => {
    setCalculatorState(defaultCalculatorState);
    setResults(null);
  };

  const handleCalculate = () => {
    const newResults = calculateResults(calculatorState);
    setResults(newResults);
  };

  const handleExportCSV = () => {
    if (!results) return;

    const csv = generateCSV(results);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${calculatorState.businessName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_projections.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <CalculatorHeader 
        businessName={calculatorState.businessName}
        onBusinessNameChange={(name) => setCalculatorState(prev => ({ ...prev, businessName: name }))}
      />

      {/* Input Section */}
      <BorderContainer contentClassName="space-y-8">
        <StartupCosts
          state={calculatorState}
          onChange={(updates) => setCalculatorState(prev => ({ ...prev, ...updates }))}
        />

        <OperationalCosts
          state={calculatorState}
          onChange={(updates) => setCalculatorState(prev => ({ ...prev, ...updates }))}
        />

        <AdditionalRevenue
          state={calculatorState}
          onChange={(updates) => setCalculatorState(prev => ({ ...prev, ...updates }))}
        />

        <div className="flex gap-4 justify-center pt-6">
          <InputButton
            onClick={handleCalculate}
            variant="primary"
          >
            Calculate Dumpster Rental Numbers
          </InputButton>
          <button
            onClick={handleReset}
            className="bg-gray-200 text-gray-800 border px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Reset to Default
          </button>
        </div>
      </BorderContainer>

      {/* Results Section */}
      {results && (
        <BorderContainer contentClassName="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <Building className="w-7 h-7 text-blue-600" />
              {calculatorState.businessName} Business Projections
            </h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <BorderContainer>
              <MonthlyResults results={results} />
            </BorderContainer>
            <BorderContainer>
              <AnnualResults results={results} />
            </BorderContainer>
          </div>
          <ROITimeline results={results} />
          <ProjectionsTable 
            results={results}
            onExportCSV={handleExportCSV}
          />
        </BorderContainer>
      )}
    </div>
  );
}