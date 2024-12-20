import React from 'react';
import { useDentalContext, DentalProvider } from './dental/DentalContext';
import { BasicInfo } from './dental/BasicInfo';
import { EmployeeSection } from './dental/EmployeeSection';
import { OverheadSection } from './dental/OverheadSection';
import { ResultsSection } from './dental/ResultsSection';

// Separate Calculator component that uses context
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
  className="w-full px-8 py-3 bg-custom-active text-white text-lg font-semibold rounded-lg hover:bg-custom-hover transition-colors ring-2 ring-skin-border/50"
>
  Calculate Results
</button>
      
      {showResults && <ResultsSection />}
    </div>
  );
};

// Main component that provides context
const DentalCalculator = () => {
  return (
    <DentalProvider>
      <Calculator />
    </DentalProvider>
  );
};

export default DentalCalculator;
