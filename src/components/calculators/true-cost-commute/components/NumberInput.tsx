import React, { useState } from 'react';
import { formatNumberWithCommas } from '../utils/formatting';

interface NumberInputProps {
  label: string | React.ReactNode;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  step?: number;
  min?: number;
  max?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  step = 1,
  min = 0,
  max,
  prefix,
  suffix,
  className = '',
}) => {
  const [localValue, setLocalValue] = useState<string>(value.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Allow empty input, single decimal point, or negative sign
    if (input === '' || input === '.' || input === '-' || input === '0' || input === '0.') {
      setLocalValue(input);
      return;
    }

    // Regular expression to match valid number formats including decimals
    const numberRegex = /^-?\d*\.?\d*$/;
    if (!numberRegex.test(input)) {
      return;
    }

    setLocalValue(input);
    
    const numValue = parseFloat(input);
    if (!isNaN(numValue)) {
      if (max !== undefined && numValue > max) {
        onChange(max);
        setLocalValue(max.toString());
      } else if (min !== undefined && numValue < min) {
        onChange(min);
        setLocalValue(min.toString());
      } else {
        onChange(numValue);
      }
    }
  };

  const handleBlur = () => {
    if (localValue === '' || localValue === '.' || localValue === '-' || localValue === '0.') {
      onChange(0);
      setLocalValue('0');
    } else {
      const numValue = parseFloat(localValue);
      if (!isNaN(numValue)) {
        // Format the number to a fixed number of decimal places if it's a decimal
        const formattedValue = numValue.toString();
        setLocalValue(formattedValue);
        onChange(numValue);
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          step={step}
          min={min}
          max={max}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
            ${prefix ? 'pl-8' : ''} 
            ${suffix ? 'pr-8' : ''} 
            ${className}`}
          onWheel={(e) => e.currentTarget.blur()}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

export default NumberInput;