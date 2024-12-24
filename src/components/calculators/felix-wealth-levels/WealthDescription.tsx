import React from 'react';
import { Info } from 'lucide-react';
import { calculateWealthLevel, calculateCashWealthLevel, formatCurrency, getNextLevelRequirement } from './utils/calculations';

interface WealthDescriptionProps {
  netWorth: number;
  liquidAssets: number;
  useInflationAdjusted: boolean;
}

export function WealthDescription({ netWorth, liquidAssets, useInflationAdjusted }: WealthDescriptionProps) {
  const netWorthLevel = calculateWealthLevel(netWorth, useInflationAdjusted);
  const cashLevel = calculateCashWealthLevel(liquidAssets, useInflationAdjusted);
  const nextLevel = getNextLevelRequirement(netWorth, useInflationAdjusted);

  const getLifestyleDescription = (level: string) => {
    const descriptions: Record<string, string> = {
      'The comfortable poor': "You've taken your first meaningful steps toward wealth. While you're far from destitute, you're just beginning to taste financial freedom. Keep pushing - the real excitement lies ahead!",
      'The comfortably off': "You're starting to experience what real financial comfort feels like. Your money is working for you, but don't get too comfortable - there's so much more to achieve!",
      'The comfortably wealthy': "Now we're talking! You've built something substantial, but remember what I always say - this is just the beginning of real wealth.",
      'The lesser rich': "Congratulations on joining the ranks of the truly successful! But don't let it go to your head - there are bigger mountains to climb.",
      'The comfortably rich': "You're playing in the big leagues now. Your wealth opens doors, but remember - the game is far from over!",
      'The rich': "Now this is what I call proper wealth! But don't rest on your laurels - the summit is still ahead.",
      'The seriously rich': "You've mastered the art of wealth creation, but why stop here? The view gets even better at the top!",
      'The truly rich': "Magnificent achievement! You're in rarefied air now, but there's always another peak to conquer.",
      'The filthy rich': "Extraordinary! You've achieved what few dare to dream of. But knowing you, you're already planning your next conquest.",
      'The super rich': "Welcome to the pinnacle! Though if you're anything like me, you're already plotting your next venture. The game never really ends, does it?",
    };
    return descriptions[level] || "Keep pushing forward - wealth is a journey, not a destination!";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Info className="w-6 h-6 text-blue-600" />
        Your Wealth Analysis
      </h2>

      {/* Wealth Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Net Worth Level */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Net Worth Level</h3>
          <p className="text-3xl font-bold text-blue-600 mb-2">{formatCurrency(netWorth)}</p>
          <p className="text-xl text-gray-700">{netWorthLevel}</p>
        </div>

        {/* Liquid Assets Level */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Liquid Assets Level</h3>
          <p className="text-3xl font-bold text-green-600 mb-2">{formatCurrency(liquidAssets)}</p>
          <p className="text-xl text-gray-700">{cashLevel}</p>
        </div>
      </div>

      {/* Lifestyle Description */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Felix Dennis's Take</h3>
        <p className="text-gray-700 italic">"{getLifestyleDescription(netWorthLevel)}"</p>
      </div>

      {/* Next Level Target */}
      {nextLevel && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Next Level Target</h3>
          <p className="text-gray-700">
            To reach the next wealth level, you need an additional{' '}
            <span className="font-bold text-green-600">{formatCurrency(nextLevel)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
