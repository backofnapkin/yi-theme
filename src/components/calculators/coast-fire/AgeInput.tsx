import React from 'react';
import { InfoTooltip } from './InfoTooltip';

interface AgeInputProps {
  label: string;
  value: number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  tooltip?: string;
}

export const AgeInput: React.FC<AgeInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  tooltip,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Allow empty string or numbers only (including partial numbers)
    if (newValue === '' || /^\d*$/.test(newValue)) {
      // Convert empty string to '0' to prevent NaN issues
      onChange(newValue === '' ? '0' : newValue);
    }
  };

  // Format display value - show empty string if value is 0 to allow for easier editing
  const displayValue = value === 0 ? '' : value.toString();

  return (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        {label}
        {tooltip && <InfoTooltip text={tooltip} />}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={displayValue}
          onChange={handleChange}
          className={`
            w-full px-4 py-2
            border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
            outline-none
            transition-shadow duration-200
          `}
          onWheel={(e) => e.currentTarget.blur()}
          placeholder="Enter age"
        />
      </div>
    </div>
  );
};