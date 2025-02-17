import React, { useState, useEffect } from 'react';
import { InfoTooltip } from './InfoTooltip';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  prefix?: string;
  tooltip?: string;
  formatCommas?: boolean;
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  prefix,
  tooltip,
  formatCommas = false
}: NumberInputProps) {
  const [localValue, setLocalValue] = useState<string>(
    formatCommas ? formatNumberWithCommas(value) : value.toString()
  );

  // Format number with commas
  function formatNumberWithCommas(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Remove commas for processing
  function removeCommas(str: string): string {
    return str.replace(/,/g, '');
  }

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(formatCommas ? formatNumberWithCommas(value) : value.toString());
  }, [value, formatCommas]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const cleanInput = removeCommas(input);
    
    // Allow empty input for better UX
    if (cleanInput === '') {
      setLocalValue('');
      return;
    }

    // Only allow numbers
    if (!/^\d*$/.test(cleanInput)) {
      return;
    }

    const numValue = parseInt(cleanInput, 10);
    
    // Update local display value
    setLocalValue(formatCommas ? formatNumberWithCommas(numValue) : cleanInput);

    // Update parent state if within bounds
    if (!isNaN(numValue)) {
      if (max !== undefined && numValue > max) {
        onChange(max);
      } else if (min !== undefined && numValue < min) {
        onChange(min);
      } else {
        onChange(numValue);
      }
    }
  };

  const handleBlur = () => {
    const cleanInput = removeCommas(localValue);
    
    // On blur, if empty or invalid, reset to min value
    if (cleanInput === '' || isNaN(parseInt(cleanInput, 10))) {
      const defaultValue = min !== undefined ? min : 0;
      setLocalValue(formatCommas ? formatNumberWithCommas(defaultValue) : defaultValue.toString());
      onChange(defaultValue);
    }
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        {label}
        {tooltip && <InfoTooltip text={tooltip} />}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9,]*"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`
            w-full px-4 py-2
            border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
            outline-none
            transition-shadow duration-200
            ${prefix ? 'pl-8' : ''}
          `}
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>
    </div>
  );
}