import React from 'react';
import { DentalProvider } from './dental/DentalContext';
import { BasicInfo } from './dental/BasicInfo';
import { EmployeeSection } from './dental/EmployeeSection';
import { OverheadSection } from './dental/OverheadSection';
import { ResultsSection } from './dental/ResultsSection';

const DentalCalculator = () => {
  return (
    <DentalProvider>
      <Calculator />
    </DentalProvider>
  );
};

// Separate component to use the context
const Calculator = () => {
  const { state, calculateResults } = useDentalContext();
  const [showResults, setShowResults] = React.useState(false);

  const handleCalculate = () => {
    calculateResults();
    setShowResults(true);
  };

  return (
    <div className="space-y-8">
      <BasicInfo />
      <EmployeeSection />
      <OverheadSection />
      
      <button
        onClick={handleCalculate}
        className="w-full px-8 py-3 bg-custom-active text-white text-lg font-semibold rounded-lg hover:bg-custom-hover transition-colors"
      >
        Calculate Results
      </button>
      
      {showResults && (
        <ResultsSection 
          practiceName={state.basicInfo.practiceName}
          metrics={state.results!}
          employees={state.employees}
        />
      )}
    </div>
  );
};

export default DentalCalculator;
