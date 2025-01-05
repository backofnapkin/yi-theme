import React, { useState } from 'react';
import { Calculator as CalcIcon, Download, RefreshCw } from 'lucide-react';
import { IncomeSection } from './components/sections/IncomeSection';
import { InvestmentSection } from './components/sections/InvestmentSection';
import { GoalsSection } from './components/sections/GoalsSection';
import { ResultsSummary } from './components/sections/ResultsSection/ResultsSummary';
import { ResultsChart } from './components/sections/ResultsSection/ResultsChart';
import { ResultsTable } from './components/sections/ResultsSection/ResultsTable';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { calculateFireResults, exportToCSV } from './utils/calculations';
import { DEFAULT_INPUTS } from './constants';
import type { CalculatorInputs, CalculationResults } from './types';

export function SideFireCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [results, setResults] = useState<CalculationResults | null>(null);

  const handleCalculate = () => {
    const calculatedResults = calculateFireResults(inputs);
    setResults(calculatedResults);
  };

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setResults(null);
  };

  const handleExport = () => {
    if (results) {
      exportToCSV(results);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Side Hustle FIRE Calculator
        </h1>
        <p className="mt-2 text-gray-600">
          Calculate how side income can accelerate your path to financial independence
        </p>
      </header>

      <div className="space-y-6">
        {/* Input Sections */}
        <IncomeSection inputs={inputs} setInputs={setInputs} />
        <InvestmentSection inputs={inputs} setInputs={setInputs} />
        <GoalsSection inputs={inputs} setInputs={setInputs} />

        {/* Action Buttons */}
        <Card>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={handleCalculate}
              icon={CalcIcon}
            >
              Calculate FIRE Path
            </Button>
            
            <Button
              variant="secondary"
              icon={Download}
              onClick={handleExport}
              disabled={!results}
            >
              Export Results
            </Button>
            
            <Button
              variant="outline"
              icon={RefreshCw}
              onClick={handleReset}
            >
              Reset Calculator
            </Button>
          </div>
        </Card>

        {/* Results Sections */}
        {results && (
          <div className="space-y-6">
            <ResultsSummary results={results} inputs={inputs} />
            <ResultsChart results={results} inputs={inputs} />
            <ResultsTable results={results} inputs={inputs} />
          </div>
        )}
      </div>
    </div>
  );
}