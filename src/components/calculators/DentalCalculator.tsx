import React, { useState } from 'react';
import { BasicInfo } from './dental/BasicInfo';
import { EmployeeSection } from './dental/EmployeeSection';
import { OverheadSection } from './dental/OverheadSection';
import { ResultsSection } from './dental/ResultsSection';

const DentalCalculator = () => {
  const [showResults, setShowResults] = useState(false);
  
  return (
    <div className="space-y-8">
      <BasicInfo />
      <EmployeeSection />
      <OverheadSection />
      
      <button
        onClick={() => setShowResults(true)}
        className="w-full px-8 py-3 bg-custom-active text-white text-lg font-semibold rounded-lg hover:bg-custom-hover transition-colors"
      >
        Calculate Results
      </button>
      
      {showResults && <ResultsSection />}
    </div>
  );
};

export default DentalCalculator;
