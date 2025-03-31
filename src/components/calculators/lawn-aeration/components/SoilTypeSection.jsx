import React from 'react';
import { SOIL_TYPE_OPTIONS } from '../utils/constants';

/**
 * Soil type selection form section component
 * With standard radio buttons and emerald green accents
 */
const SoilTypeSection = ({ soilType, onChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Soil Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(SOIL_TYPE_OPTIONS).map(([value, label]) => (
          <div key={value} className="flex items-center">
            <input
              id={`soil-${value}`}
              name="soilType"
              type="radio"
              value={value}
              checked={soilType === value}
              onChange={onChange}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
            />
            <label htmlFor={`soil-${value}`} className="ml-2 text-sm text-gray-700">
              {label}
            </label>
          </div>
        ))}
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Different soil types may affect aeration difficulty and pricing.
      </p>
    </div>
  );
};

export default SoilTypeSection;