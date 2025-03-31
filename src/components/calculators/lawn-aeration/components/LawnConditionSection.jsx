import React from 'react';
import { LAWN_CONDITION_OPTIONS } from '../utils/constants';

/**
 * Lawn condition form section component
 * With standard radio buttons and emerald green accents
 */
const LawnConditionSection = ({ lawnCondition, onChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Lawn Condition</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(LAWN_CONDITION_OPTIONS).map(([value, label]) => (
          <div key={value} className="flex items-center">
            <input
              id={`condition-${value}`}
              name="lawnCondition"
              type="radio"
              value={value}
              checked={lawnCondition === value}
              onChange={onChange}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
            />
            <label htmlFor={`condition-${value}`} className="ml-2 text-sm text-gray-700">
              {label}
            </label>
          </div>
        ))}
      </div>
      <p className="mt-1 text-sm text-gray-500">
        The current condition of your lawn can affect aeration costs.
      </p>
    </div>
  );
};

export default LawnConditionSection;