import React, { useCallback } from 'react';

interface EnhancedInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  placeholder?: string;
  min?: number;
  max?: number;
  tooltip?: string;
  prefix?: string;
  suffix?: string;
}

export const EnhancedInput: React.FC<EnhancedInputProps> = ({
  value,
  onChange,
  label,
  placeholder = '0',
  min = 0,
  max = 999999999,
  prefix,
  suffix,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-numeric characters except decimal point
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    const numValue = Number(rawValue);
    
    if (rawValue === '' || isNaN(numValue)) {
      onChange(0);
    } else {
      onChange(Math.min(Math.max(numValue, min), max));
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
  }, []);

  const formatValue = (val: number): string => {
    if (val === 0) return '';
    return val.toLocaleString('en-US');
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value === 0 ? '' : `${prefix || ''}${formatValue(value)}${suffix || ''}`}
        onChange={handleChange}
        onFocus={handleFocus}
        onWheel={handleWheel as any}
        placeholder={placeholder}
        className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm 
                 focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 px-3 py-2
                 placeholder:text-gray-400"
        aria-label={label}
      />
    </div>
  );
};