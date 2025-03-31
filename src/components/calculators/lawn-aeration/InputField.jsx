import React from 'react';

/**
 * Reusable input field component with support for prefixes and suffixes
 * Fixed with explicit border to ensure focus styles work
 */
const InputField = ({
  label,
  value,
  onChange,
  type = 'text',
  name,
  id,
  min,
  max,
  step,
  prefix,
  suffix,
  placeholder,
  required = false,
  className = '',
  helpText
}) => {
  // Generate a unique ID if not provided
  const inputId = id || `input-${name}-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={className}>
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        <input
          type={type}
          id={inputId}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          required={required}
          className={`block w-full py-3 px-4 rounded-md border border-gray-300 shadow-sm text-base ${
            prefix ? 'pl-8' : ''
          } ${suffix ? 'pr-12' : ''}`}
          aria-describedby={helpText ? `${inputId}-description` : undefined}
        />
        {suffix && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>
      {helpText && (
        <p id={`${inputId}-description`} className="mt-1 text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default InputField;