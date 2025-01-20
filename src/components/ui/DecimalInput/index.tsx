// src/components/ui/DecimalInput/index.tsx

/**
 * DecimalInput Component
 * 
 * A specialized input component for handling decimal numbers in calculators.
 * Provides enhanced user experience for currency, percentages, and precise decimal inputs.
 * 
 * Features:
 * - Handles decimal point inputs (e.g., $1.25, 10.5%)
 * - Supports prefix/suffix (e.g., $, %, etc.)
 * - Validates number input in real-time
 * - Provides visual feedback with focus ring
 * - Prevents invalid inputs while allowing interim states (., -)
 * - Supports min/max boundaries
 * - Mobile-friendly with appropriate input mode
 * - Prevents scroll wheel changes when focused
 * 
 * UX Improvements:
 * - Allows typing decimal points naturally
 * - Shows emerald focus ring on click/focus
 * - Maintains cursor position during typing
 * - Handles edge cases (empty input, single decimal, etc.)
 * - Formats numbers appropriately on blur
 * - Supports prefix/suffix without affecting input value
 * 
 * Common Use Cases:
 * - Currency inputs (with $ prefix)
 * - Percentage inputs (with % suffix)
 * - Decimal measurements
 * - Financial calculations
 * - Rate inputs
 */

import React, { useState } from 'react';

interface DecimalInputProps {
  label: string | React.ReactNode;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  step?: number;
  min?: number;
  max?: number;
  prefix?: string;    // e.g., '$' for currency
  suffix?: string;    // e.g., '%' for percentages
  className?: string;
}

export function DecimalInput({
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
}: DecimalInputProps) {
  const [localValue, setLocalValue] = useState<string>(value.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Allow intermediate states during typing
    // Examples: '', '.', '-', '0', '0.'
    if (input === '' || input === '.' || input === '-' || input === '0' || input === '0.') {
      setLocalValue(input);
      return;
    }

    // Validate numeric input including decimals
    const numberRegex = /^-?\d*\.?\d*$/;
    if (!numberRegex.test(input)) {
      return;
    }

    setLocalValue(input);
    
    const numValue = parseFloat(input);
    if (!isNaN(numValue)) {
      // Enforce min/max boundaries
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
    // Handle empty or partial inputs on blur
    if (localValue === '' || localValue === '.' || localValue === '-' || localValue === '0.') {
      onChange(0);
      setLocalValue('0');
    } else {
      const numValue = parseFloat(localValue);
      if (!isNaN(numValue)) {
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
        {/* Prefix (e.g., $) */}
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
          className={`
            w-full px-4 py-2 
            border rounded-lg 
            focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
            outline-none
            transition-shadow
            ${prefix ? 'pl-8' : ''} 
            ${suffix ? 'pr-8' : ''} 
            ${className}
          `}
          onWheel={(e) => e.currentTarget.blur()}
        />
        {/* Suffix (e.g., %) */}
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}