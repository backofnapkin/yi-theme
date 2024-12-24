import React from 'react';
import { Info, DollarSign, Trophy } from 'lucide-react';
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
  const wealthLevel = calculateWealthLevel(netWorth, useInflationAdjusted);
  const cashWealthLevel = calculateCashWealthLevel(liquidAssets, useInflationAdjusted);
  const nextLevelRequirement = getNextLevelRequirement(netWorth, useInflationAdjusted);

  return (
    <div className="space-y-6 mt-8">
      {/* Net Worth Card */}
      <div
        className="rounded-lg p-6 shadow-lg flex items-center gap-4 transition-transform transform hover:scale-105"
        style={{
          background: "linear-gradient(to right, rgba(var(--color-text-active), 0.1), rgba(var(--color-border-active), 0.1))",
          border: "1px solid rgba(var(--color-border-active), 0.6)",
        }}
      >
        <DollarSign className="text-custom-active w-8 h-8" />
        <div>
          <h4 className="text-xl font-bold text-skin-base">Your Net Worth</h4>
          <p className="text-2xl font-semibold text-skin-active">
            {formatCurrency(netWorth)}
          </p>
        </div>
      </div>

      {/* Wealth Level Card */}
      <div
        className="rounded-lg p-6 shadow-lg flex items-center gap-4 transition-transform transform hover:scale-105"
        style={{
          background: "linear-gradient(to right, rgba(var(--color-fill-secondary), 0.2), rgba(var(--color-border-active), 0.1))",
          border: "1px solid rgba(var(--color-border-active), 0.6)",
        }}
      >
        <Trophy className="text-custom-active w-8 h-8" />
        <div>
          <h4 className="text-xl font-bold text-skin-base">Wealth Category</h4>
          <p className="text-2xl font-semibold text-skin-active">
            {wealthLevel}
          </p>
        </div>
      </div>

      {/* Next Level Requirement Card */}
      {nextLevelRequirement > 0 && (
        <div
          className="rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105"
          style={{
            background: "linear-gradient(to right, rgba(255, 241, 179, 0.3), rgba(255, 221, 153, 0.3))",
            border: "1px solid rgba(255, 193, 7, 0.6)",
          }}
        >
          <h4 className="text-xl font-bold text-yellow-800">
            To Reach the Next Wealth Category
          </h4>
          <p className="text-lg text-yellow-700 mt-2">
            You need an additional <strong>{formatCurrency(nextLevelRequirement)}</strong>.
          </p>
        </div>
      )}

      {/* Info Box */}
      <div
        className="rounded-lg p-6 shadow-md flex items-center gap-4 transition-transform transform hover:scale-105"
        style={{
          background: "linear-gradient(to right, rgba(173, 216, 230, 0.3), rgba(135, 206, 250, 0.3))",
          border: "1px solid rgba(70, 130, 180, 0.6)",
        }}
      >
        <Info className="text-blue-600 w-8 h-8" />
        <p className="text-blue-700">
          These wealth categories are based on Felix Dennis's methodology, adjusted for inflation where applicable.
        </p>
      </div>
    </div>
  );
}
