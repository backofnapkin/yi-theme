import React from 'react';
import { InfoTooltip } from './InfoTooltip';
import { DecimalInput } from '../../ui/DecimalInput';
import { RangeInput } from '../../ui/RangeInput';

interface InputFieldProps {
  label: string;
  name: string;
  value: number | string;
  onChange: (value: number | string) => void;
  type?: 'text' | 'number' | 'range';
  min?: number;
  max?: number;
  step?: number;
  tooltip?: string;
  prefix?: string;
  suffix?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'number',
  min,
  max,
  step,
  tooltip,
  prefix,
  suffix,
}) => {
  const labelComponent = (
    <span className="flex items-center">
      {label}
      {tooltip && <InfoTooltip text={tooltip} />}
    </span>
  );

  if (type === 'range') {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {labelComponent}
        </label>
        <RangeInput
          value={typeof value === 'string' ? parseFloat(value) : value}
          onChange={(newValue) => onChange(parseFloat(newValue))}
          min={min || 0}
          max={max || 100}
          step={step}
          suffix={suffix}
          showTooltip
        />
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {labelComponent}
        </label>
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {prefix}
            </span>
          )}
          <input
            type="text"
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`
              w-full px-4 py-2
              border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
              outline-none
              transition-shadow
              text-gray-900
              ${prefix ? 'pl-8' : ''}
              ${suffix ? 'pr-8' : ''}
            `}
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

  // For number type, use DecimalInput
  return (
    <div className="mb-4">
      <DecimalInput
        label={labelComponent}
        value={typeof value === 'string' ? parseFloat(value) : value}
        onChange={(newValue) => onChange(newValue)}
        min={min}
        max={max}
        step={step}
        prefix={prefix}
        suffix={suffix}
      />
    </div>
  );
};