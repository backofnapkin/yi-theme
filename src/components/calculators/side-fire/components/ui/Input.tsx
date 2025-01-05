import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { formatNumberWithCommas } from '../../utils/calculations';
import { CURRENCY_FORMAT_OPTIONS } from '../../constants';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  tooltip?: string;
  prefix?: string;
  suffix?: string;
}

export function Input({
  label,
  tooltip,
  prefix,
  suffix,
  className = '',
  onChange,
  value,
  type,
  'aria-label': ariaLabel,
  ...props
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'number' && onChange) {
      const rawValue = e.target.value.replace(/[^0-9.-]/g, '');
      e.target.value = rawValue;
      onChange(e);
    } else if (onChange) {
      onChange(e);
    }
  };

  const displayValue = type === 'number' && value !== undefined 
    ? formatNumberWithCommas(Number(value))
    : value;

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {label}
        {tooltip && (
          <Tooltip content={tooltip}>
            <Info className="w-4 h-4 text-gray-400 hover:text-gray-500" />
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
          {...props}
          type={type === 'number' ? 'text' : type}
          inputMode={type === 'number' ? 'numeric' : undefined}
          value={displayValue}
          onChange={handleChange}
          aria-label={ariaLabel || label}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 
            ${prefix ? 'pl-8' : ''} 
            ${suffix ? 'pr-8' : ''} 
            ${className}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}