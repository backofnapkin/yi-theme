import React from 'react';
import { HelpCircle } from 'lucide-react';

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type: string;
  min?: number;
  max?: number;
  step?: string;
  prefix?: string;
  suffix?: string;
  tooltip?: string;
  options?: Array<{ value: number; label: string }>;
}

export function InputField({
  label,
  value,
  onChange,
  type,
  min,
  max,
  step,
  prefix,
  suffix,
  tooltip,
  options
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
        {label}
        {tooltip && (
          <div className="group relative">
            <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg w-64 hidden group-hover:block z-10">
              {tooltip}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        )}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        {prefix && !options && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        {options ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min={min}
            max={max}
            step={step}
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
              ${prefix ? 'pl-7' : ''}
              ${suffix ? 'pr-12' : ''}
            `}
          />
        )}
        {suffix && !options && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
}