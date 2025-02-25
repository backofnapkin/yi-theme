import { useState, useCallback, useMemo } from 'react';
import type { SimulationResults, FinancialInputs } from './types';
import InputFields from './input-fields/InputFields';
import PortfolioHealthMetrics from './results/PortfolioHealthMetrics';
import MonteCarloPaths from './visualizations/MonteCarloPaths';
import { runMonteCarloSimulation } from './utils/monteCarloSimulation';
import { Loader2, AlertTriangle } from 'lucide-react';
import { BorderContainer } from '../../ui/BorderContainer';

const MonteCarloFireCalculator = () => {
  const [inputs, setInputs] = useState<FinancialInputs | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seed, setSeed] = useState<number | null>(null);

  const results = useMemo<SimulationResults | null>(() => {
    if (!inputs || seed === null) return null;
    try {
      const simulationResults = runMonteCarloSimulation(inputs, { seed });
      setError(null);
      return simulationResults;
    } catch (error) {
      console.error('Simulation failed:', error);
      setError(error instanceof Error ? error.message : 'Simulation failed');
      return null;
    }
  }, [inputs, seed]);

  const handleCalculate = useCallback(async (formData: FinancialInputs) => {
    setLoading(true);
    setError(null);
    try {
      setSeed(Date.now());
      setInputs(formData);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="container mx-auto p-2 space-y-4">
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">Monte Carlo FIRE Calculator</h1>
        <p className="text-gray-600">
          Test your retirement plan with thousands of possible economic scenarios.
        </p>
      </header>

      <InputFields onCalculate={handleCalculate} />

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-3 text-lg">Calculating Monte Carlo Projections...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Simulation Error</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {results && !loading && !error && inputs && ( // Added inputs check
        <BorderContainer className="space-y-8">
          <PortfolioHealthMetrics simulationData={results} />
          <MonteCarloPaths 
            data={results.percentilePaths} 
            inputs={{
              currentAge: inputs.currentAge,
              retirementAge: inputs.retirementAge,
              retirementLength: inputs.retirementLength
            }}
            allInputs={inputs} // Type-safe now due to conditional
          />
        </BorderContainer>
      )}
    </div>
  );
};

export default MonteCarloFireCalculator;