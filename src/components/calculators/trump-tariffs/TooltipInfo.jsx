import React from 'react';
import { Info } from 'lucide-react';

/**
 * Reusable tooltip component for displaying help information
 * 
 * @param {string} id - The unique identifier for the tooltip
 * @param {boolean} active - Whether the tooltip is currently displayed
 * @param {function} toggle - Function to toggle the tooltip visibility
 * @param {string} text - The content to display in the tooltip
 * @returns {JSX.Element} - Tooltip component with toggle button
 */
const TooltipInfo = ({ id, active, toggle, text }) => {
  return (
    <>
      <button 
        type="button" 
        className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full"
        onClick={toggle}
        aria-expanded={active}
        aria-controls={`${id}-tooltip`}
        aria-label={`Information about ${id}`}
      >
        <Info size={16} />
      </button>
      {active && (
        <div 
          id={`${id}-tooltip`}
          className="mb-2 p-2 bg-blue-50 text-blue-800 rounded-md border border-blue-200"
          role="tooltip"
        >
          {text}
        </div>
      )}
    </>
  );
};

export default TooltipInfo;