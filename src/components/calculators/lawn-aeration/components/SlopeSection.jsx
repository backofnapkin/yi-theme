import React from 'react';
import { SLOPE_OPTIONS } from '../utils/constants';

/**
 * Lawn slope form section component
 * With standard radio buttons and emerald green accents
 */
const SlopeSection = ({ slope, onChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Lawn Slope</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(SLOPE_OPTIONS).map(([value, label]) => (
          <div key={value} className="flex items-center">
            <input
              id={`slope-${value}`}
              name="slope"
              type="radio"
              value={value}
              checked={slope === value}
              onChange={onChange}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
            />
            <label htmlFor={`slope-${value}`} className="ml-2 text-sm text-gray-700">
              {label}
            </label>
          </div>
        ))}
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Steeper slopes require more time and care, affecting pricing.
      </p>
    </div>
  );
};

export default SlopeSection;