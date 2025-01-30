import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Tooltip } from './components/Tooltip';

interface MarketProjectionsProps {
  growthRate: number;
  onChange: (growthRate: number) => void;
}

const MarketProjections: React.FC<MarketProjectionsProps> = ({
  growthRate,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <TrendingUp className="h-6 w-6 text-gray-700" />
        <h2 className="text-xl font-semibold">Market Projections</h2>
        <Tooltip content="Set your Bitcoin price growth expectations" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 flex items-center">
          Average Annual Price Growth Rate
          <Tooltip content="Adjust expected Bitcoin price growth rate (-20% to 30%)" />
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
            min="-20"
            max="30"
            value={growthRate}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>-20%</span>
            <span className="font-medium">{growthRate}%</span>
            <span>30%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketProjections;