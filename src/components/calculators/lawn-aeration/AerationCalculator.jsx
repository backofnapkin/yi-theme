import React, { useState, useRef } from 'react';
import { calculateAerationCost } from './utils/calculationUtils';
import { INITIAL_FORM_STATE } from './utils/constants';
import CalculatorForm from './components/CalculatorForm';
import ResultsDisplay from './components/ResultsDisplay';

/**
 * Main component for the Lawn Aeration Calculator
 * Manages state and coordinates form submission and results display
 */
const AerationCalculator = () => {
  // Form state with initial values from constants
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  
  // Results state
  const [showResults, setShowResults] = useState(false);
  const [estimate, setEstimate] = useState(null);
  
  // Ref for scrolling to results
  const resultsRef = useRef(null);

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Calculate estimate based on form data
    const calculatedEstimate = calculateAerationCost(formData);
    setEstimate(calculatedEstimate);
    setShowResults(true);
    
    // Scroll to results after they're shown
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="mt-6 mb-8">
      {/* Calculator Form */}
      <CalculatorForm 
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleFormSubmit}
      />
      
      {/* Results Section - only shown after form submission */}
      {showResults && (
        <ResultsDisplay
          ref={resultsRef}
          estimate={estimate}
          formData={formData}
          onRecalculate={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export default AerationCalculator;