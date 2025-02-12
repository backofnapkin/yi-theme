import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { Tooltip } from '../../ui/Tooltip';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  prefix?: string;
  tooltip?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  prefix,
  tooltip
}: NumberInputProps) {
  const [localValue, setLocalValue] = useState<string>(value.toString());

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setLocalValue(input);
    
    // If input is empty, don't update parent state yet
    if (input === '') {
      return;
    }

    const numValue = parseInt(input, 10);
    if (isNaN(numValue)) {
      return;
    }

    // Update parent state if within bounds
    if (max !== undefined && numValue > max) {
      onChange(max);
    } else if (min !== undefined && numValue < min) {
      onChange(min);
    } else {
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    // On blur, if empty or invalid, reset to min value
    if (localValue === '' || isNaN(parseInt(localValue, 10))) {
      const defaultValue = min !== undefined ? min : 0;
      setLocalValue(defaultValue.toString());
      onChange(defaultValue);
    }
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        {label}
        {tooltip && (
          <Tooltip content={tooltip}>
            <Info className="w-4 h-4 text-gray-500 inline-block ml-2" />
          </Tooltip>
        )}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          min={min}
          max={max}
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