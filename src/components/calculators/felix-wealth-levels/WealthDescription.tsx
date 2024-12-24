import React from 'react';
import { Info } from 'lucide-react';
import { 
  calculateWealthLevel, 
  calculateCashWealthLevel, 
  formatCurrency, 
  getNextLevelRequirement 
} from './utils/calculations';

interface WealthDescriptionProps {
  netWorth: number;
  liquidAssets: number;
  useInflationAdjusted: boolean;
}

export function WealthDescription({ netWorth, liquidAssets, useInflationAdjusted }: WealthDescriptionProps) {
  // Calculate wealth level and next level requirement
  const wealthLevel = calculateWealthLevel(netWorth, useInflationAdjusted);
  const cashWealthLevel = calculateCashWealthLevel(liquidAssets, useInflationAdjusted);
  const nextLevelRequirement = getNextLevelRequirement(netWorth, useInflationAdjusted);

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg space-y-4">
      <h3 className="text-2xl font-semibold text-gray-800">
        Your Wealth Description
      </h3>
      
      <p className="text-gray-700">
        Based on your net worth of <strong>{formatCurrency(netWorth)}</strong>, 
        you fall into the category of <strong>{wealthLevel}</strong>.
      </p>

      <p className="text-gray-700">
        Your liquid assets total <strong>{formatCurrency(liquidAssets)}</strong>, 
        which places you in the <strong>{cashWealthLevel}</strong> cash wealth level.
      </p>

      {nextLevelRequirement > 0 && (
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p className="text-yellow-800">
            To reach the next wealth category, you need an additional <strong>{formatCurrency(nextLevelRequirement)}</strong>.
          </p>
        </div>
      )}

      <div className="flex items-center bg-blue-50 p-4 rounded-lg gap-2">
        <Info className="w-6 h-6 text-blue-600" />
        <p className="text-blue-700">
          The wealth categories are based on Felix Dennis's methodology, adjusted for inflation where applicable.
        </p>
      </div>
    </div>
  );
}
