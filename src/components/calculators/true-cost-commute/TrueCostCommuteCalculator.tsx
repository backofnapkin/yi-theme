import React, { useState } from 'react';
import { ListMusic as Mustache } from 'lucide-react';
import type { CommuteData } from './types';
import { defaultData } from './types';
import CommuteInputForm from './CommuteInputForm';
import ResultsDisplay from './ResultsDisplay';

const TrueCostCommuteCalculator: React.FC = () => {
  const [data, setData] = useState<CommuteData>(defaultData);
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setData(defaultData);
    setShowResults(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-2 print:p-0">
      <div className="text-center mb-2">
        <p className="text-gray-600 mt-2">Understand the real financial and time impact of your daily commute inspired by the teachings of Mr. Money Mustache.</p>
      </div>

      <div className="space-y-6">
        <div className="print:hidden">
          <CommuteInputForm
            data={data}
            onDataChange={setData}
            onCalculate={handleCalculate}
            onReset={handleReset}
          />
        </div>

        {showResults && (
          <ResultsDisplay
            data={data}
            onPrint={handlePrint}
          />
        )}
      </div>
    </div>
  );
};

export default TrueCostCommuteCalculator;