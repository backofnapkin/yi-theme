import React from 'react';
import { InfoButton } from './InfoButton';

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  info: string;
  prefix?: string;
  suffix?: string;
  type?: 'number' | 'slider';
  min?: number;
  max?: number;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  info,
  prefix,
  suffix,
  type = 'number',
  min,
  max,
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center mb-1">
        <label className="text-sm font-medium" style={{ color: 'rgb(80, 73, 69)' }}>{label}</label>
        <div className="ml-2">
          <InfoButton content={info} />
        </div>
      </div>
      <div className="relative">
        {type === 'slider' ? (
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min={min}
              max={max}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="flex-grow h-2 rounded-lg appearance-none cursor-pointer"
              style={{ 
                backgroundColor: 'rgb(241, 241, 241)',
                accentColor: 'rgb(14, 192, 124)'
              }}
            />
            <span style={{ color: 'rgb(80, 73, 69)' }} className="font-medium min-w-[3rem]">{value}</span>
          </div>
        ) : (
          <>
            {prefix && (
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'rgb(80, 73, 69, 0.8)' }}>
                {prefix}
              </span>
            )}
            <input
              type="number"
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className={`w-full p-2 rounded-md focus:outline-none focus:ring-2 ${
                prefix ? 'pl-8' : ''
              } ${suffix ? 'pr-8' : ''}`}
              style={{ 
                backgroundColor: 'rgb(241, 241, 241)',
                border: '1px solid rgb(104, 157, 106)',
                color: 'rgb(80, 73, 69)',
                '--tw-ring-color': 'rgb(14, 192, 124)'
              } as React.CSSProperties}
            />
            {suffix && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2" style={{ color: 'rgb(80, 73, 69, 0.8)' }}>
                {suffix}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};