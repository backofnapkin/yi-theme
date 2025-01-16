import React, { useState, useCallback } from 'react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  prefix?: string;
  className?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  placeholder,
  prefix,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<string>(
    value ? value.toLocaleString() : ''
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    const numericValue = rawValue === '' ? 0 : Number(rawValue);
    
    if (!isNaN(numericValue)) {
      setDisplayValue(rawValue);
      onChange(numericValue);
    }
  }, [onChange]);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  }, []);

  const handleBlur = useCallback(() => {
    if (value) {
      setDisplayValue(value.toLocaleString());
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLInputElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-2 text-skin-base">{prefix}</span>
      )}
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onWheel={handleWheel}
        placeholder={placeholder}
        className={`w-full ${prefix ? 'pl-8' : 'px-4'} pr-4 py-2 rounded-lg border border-skin-base focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-skin-fill ${className}`}
      />
    </div>
  );
};