import React from 'react';
import { Target } from 'lucide-react';
import { Tooltip } from './components/Tooltip';

interface RetirementGoalsProps {
  retirementAge: number;
  annualSpend: number;
  onChange: (retirementAge: number, annualSpend: number) => void;
}

const RetirementGoals: React.FC<RetirementGoalsProps> = ({
  retirementAge,
  annualSpend,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Target className="h-6 w-6 text-gray-700" />
        <h2 className="text-xl font-semibold">Retirement Goals</h2>
        <Tooltip content="Set your retirement age and desired annual spending" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            Goal Retirement Age
            <Tooltip content="Select your target retirement age" />
          </label>
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
                background: rgb(5, 150, 105);
                cursor: pointer;
                margin-top: -4px;
              }
              input[type="range"]::-moz-range-thumb {
                width: 16px;
                height: 16px;
                border: none;
                border-radius: 50%;
                background: rgb(5, 150, 105);
                cursor: pointer;
              }
              input[type="range"]::-webkit-slider-runnable-track {
                width: 100%;
                height: 8px;
                background: rgb(229, 231, 235);
                border-radius: 4px;
              }
              input[type="range"]::-moz-range-track {
                width: 100%;
                height: 8px;
                background: rgb(229, 231, 235);
                border-radius: 4px;
              }
              input[type="range"]:focus {
                outline: none;
              }
            `}
          </style>
          <div className="mt-2">
            <input
              type="range"
              min="30"
              max="100"
              value={retirementAge}
              onChange={(e) => onChange(parseInt(e.target.value), annualSpend)}
              className="w-full cursor-pointer"
            />
            <div className="text-center mt-2">
              <span className="text-lg font-medium">{retirementAge}</span>
              <span className="text-gray-500"> years</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            Desired Annual Retirement Spend
            <Tooltip content="Enter your desired yearly retirement spending" />
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              min="0"
              max="99000000"
              value={annualSpend}
              onChange={(e) => onChange(retirementAge, parseFloat(e.target.value) || 0)}
              className="block w-full px-4 py-2 pl-7 pr-12
                       border rounded-lg 
                       focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                       outline-none
                       transition-shadow"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">USD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetirementGoals;