import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip } from '../../ui/Tooltip';

interface ProgressBarProps {
  percentage: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="font-semibold">Progress to Coast FIRE</span>
        <Tooltip content="Shows how close your current investments are to reaching your Coast FIRE number. At 100%, you can stop contributing and still reach your retirement goal through investment growth alone.">
          <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
        </Tooltip>
      </div>

      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-300 ease-in-out"
          style={{ width: `${clampedPercentage}%` }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
            {clampedPercentage.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};