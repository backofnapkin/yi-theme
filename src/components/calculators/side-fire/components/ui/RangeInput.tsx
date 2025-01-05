import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface RangeInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  tooltip?: string;
  suffix?: string;
}

export function RangeInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  tooltip,
  suffix = '%'
}: RangeInputProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {label}
        {tooltip && (
          <Tooltip content={tooltip}>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              aria-label={`${label} information`}
            >
              <Info className="w-4 h-4" />
            </button>
          </Tooltip>
        )}
      </label>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
          aria-label={`${label} slider`}
        />
        <span className="min-w-[4rem] text-right text-sm text-gray-600">
          {value}{suffix}
        </span>
      </div>
    </div>
  );
}
