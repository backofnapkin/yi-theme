import React from 'react';
import { Check } from 'lucide-react';
import { stateBenefits } from './stateBenefitsData'; // Adjust path as needed
import { formatCurrency } from './utils';

/**
 * Component to display state-specific tariff benefits
 * @param {string} state - The selected state from formValues
 * @returns {JSX.Element} - Styled benefits section
 */
const StateBenefits = ({ state }) => {
  // Normalize state name to match stateBenefits keys (e.g., "rhode island" -> "Rhode Island")
  const normalizedState = state
    ? state.charAt(0).toUpperCase() + state.slice(1).toLowerCase()
    : null;

  // Fallback to "default" if state is not provided or not found
  const benefits = stateBenefits[normalizedState] || stateBenefits["default"];

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">
        Potential Benefits for {state || "U.S."} Residents
      </h3>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <ul className="space-y-4">
          <li className="flex items-start">
            <Check size={20} className="text-green-600 mr-3 flex-shrink-0 mt-1" />
            <span>
              <span className="font-semibold text-gray-800">{benefits.insight}</span>
            </span>
          </li>
          <li className="flex items-start">
            <Check size={20} className="text-green-600 mr-3 flex-shrink-0 mt-1" />
            <span>
              <span className="text-gray-700">{benefits.how}</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StateBenefits;