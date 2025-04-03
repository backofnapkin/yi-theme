import React from 'react';
import { dataSources } from './stateBenefitsData';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

/**
 * Component to display data sources and methodology information
 * 
 * @param {boolean} showSources - Whether to display the sources section
 * @param {function} toggleDataSources - Function to toggle sources visibility
 * @returns {JSX.Element} - Data sources information display
 */
const DataSources = ({ showSources, toggleDataSources }) => {
  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={toggleDataSources}
        className="flex items-center text-skin-active hover:underline focus:outline-none" // Updated color
        aria-expanded={showSources}
        aria-controls="data-sources-panel"
      >
        {showSources ? (
          <ChevronUp className="mr-1" size={16} />
        ) : (
          <ChevronDown className="mr-1" size={16} />
        )}
        {showSources ? "Hide Data Sources" : "Show Data Sources"}
      </button>
      
      {showSources && (
        <div 
          id="data-sources-panel"
          className="mt-4 p-4 bg-gray-100 rounded-md border border-gray-200"
        >
          <h4 className="font-bold mb-2">Supporting Data Sources</h4>
          <ul className="space-y-2">
            {Object.values(dataSources).map((source, index) => (
              <li key={index} className="flex items-start">
                <ExternalLink size={16} className="mt-1 mr-2 flex-shrink-0 text-gray-500" />
                <span>
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-skin-active hover:underline font-medium" // Updated color
                  >
                    {source.name}
                  </a>
                  <span className="text-gray-700">: {source.description}</span>
                </span>
              </li>
            ))}
          </ul>
          
          <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <h5 className="font-semibold text-yellow-800 mb-2">Methodology Note</h5>
            <p className="text-sm text-yellow-700">
              These insights are estimates based on tariff rates (25% Canada/Mexico, 20% China), 
              90% cost pass-through (NBER), and historical job creation patterns, adjusted for state 
              industry strengths. Actual impacts may vary based on implementation details, market 
              conditions, and behavioral responses.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSources;