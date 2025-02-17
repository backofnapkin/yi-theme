import React from 'react';

interface RangeInputProps {
  value: number;
  onChange: (value: string) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  showTooltip?: boolean;
}

export function RangeInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = '',
  showTooltip = false
}: RangeInputProps) {
  return (
    <div className="mt-1 space-y-2">
      <style>
        {`
          input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            background: transparent;
            width: 100%;
            margin: 4px 0;
          }
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: rgb(5, 150, 105); /* emerald-600 */
            cursor: pointer;
            margin-top: -4px; /* This centers the thumb on the track */
          }
          input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border: none;
            border-radius: 50%;
            background: rgb(5, 150, 105); /* emerald-600 */
            cursor: pointer;
          }
          input[type="range"]::-webkit-slider-runnable-track {
            width: 100%;
            height: 8px;
            background: rgb(229, 231, 235); /* gray-200 */
            border-radius: 4px;
          }
          input[type="range"]::-moz-range-track {
            width: 100%;
            height: 8px;
            background: rgb(229, 231, 235); /* gray-200 */
            border-radius: 4px;
          }
          input[type="range"]:focus {
            outline: none;
          }
        `}
      </style>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
        className="w-full cursor-pointer"
      />
      {showTooltip && (
        <div className="text-sm text-gray-600 text-center">
          {value}{suffix}
        </div>
      )}
    </div>
  );
}