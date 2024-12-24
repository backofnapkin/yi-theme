import React from 'react';
import { Info, DollarSign, Trophy, Target } from 'lucide-react';
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
      'The comfortable poor': "You've taken your first meaningful steps toward wealth. Keep pushing - the real excitement lies ahead!",
      'The comfortably off': "You're starting to experience financial comfort. There's so much more to achieve!",
      'The comfortably wealthy': "You've built something substantial. But remember, this is just the beginning of real wealth.",
      'The lesser rich': "Congratulations! You're among the truly successful. There are bigger mountains to climb.",
      'The comfortably rich': "You're playing in the big leagues. Keep pushing forward!",
      'The rich': "This is proper wealth. The summit is still ahead.",
      'The seriously rich': "You've mastered wealth creation. The view gets better at the top!",
      'The truly rich': "Magnificent achievement! There’s always another peak to conquer.",
      'The filthy rich': "Extraordinary! You've achieved what few dare to dream of. What's next?",
      'The super rich': "Welcome to the pinnacle! But the game never really ends, does it?",
    };
    return descriptions[level] || "Keep pushing forward - wealth is a journey, not a destination!";
  };

  return (
    <div className="bg-[rgb(var(--color-fill))] p-6 rounded-lg shadow-lg space-y-6">
      {/* Header */}
      <h2 className="text-3xl font-bold mb-6 text-[rgb(var(--color-text-active))] flex items-center gap-2">
        <Info className="w-8 h-8 text-[rgb(var(--color-text-active))]" />
        Your Wealth Analysis
      </h2>

      {/* Wealth Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Net Worth Level */}
        <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(var(--color-text-active),0.1)] to-[rgba(var(--color-border-active),0.1)] border border-[rgba(var(--color-border-active),0.6)]">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-[rgb(var(--color-text-active))]" />
            <h3 className="text-xl font-semibold text-[rgb(var(--color-text))]">Net Worth Level</h3>
          </div>
          <p className="text-4xl font-bold text-[rgb(var(--color-text-active))] mt-2">{formatCurrency(netWorth)}</p>
          <p className="text-lg text-[rgb(var(--color-text))] mt-2">{netWorthLevel}</p>
        </div>

        {/* Liquid Assets Level */}
        <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(var(--color-fill-secondary),0.1)] to-[rgba(var(--color-border),0.1)] border border-[rgba(var(--color-border),0.6)]">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-[rgb(var(--color-border))]" />
            <h3 className="text-xl font-semibold text-[rgb(var(--color-text))]">Liquid Assets Level</h3>
          </div>
          <p className="text-4xl font-bold text-[rgb(var(--color-border))] mt-2">{formatCurrency(liquidAssets)}</p>
          <p className="text-lg text-[rgb(var(--color-text))] mt-2">{cashLevel}</p>
        </div>
      </div>

      {/* Lifestyle Description */}
      <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(var(--color-modal),0.1)] to-[rgba(var(--color-border-active),0.1)] border border-[rgba(var(--color-border-active),0.6)]">
        <div className="flex items-center gap-3">
          <Info className="w-8 h-8 text-[rgb(var(--color-border-active))]" />
          <h3 className="text-xl font-semibold text-[rgb(var(--color-text))]">Felix Dennis's Take</h3>
        </div>
        <p className="text-lg text-[rgb(var(--color-text))] mt-2 italic">"{getLifestyleDescription(netWorthLevel)}"</p>
      </div>

      {/* Next Level Target */}
      {nextLevel && (
        <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(var(--color-border-active),0.1)] to-[rgba(var(--color-fill-secondary),0.1)] border border-[rgba(var(--color-border),0.6)]">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-[rgb(var(--color-border))]" />
            <h3 className="text-xl font-semibold text-[rgb(var(--color-text))]">Next Level Target</h3>
          </div>
          <p className="text-lg text-[rgb(var(--color-text))] mt-2">
            To reach the next wealth level, you need an additional{' '}
            <span className="font-bold text-[rgb(var(--color-border))]">{formatCurrency(nextLevel)}</span>.
          </p>
        </div>
      )}
    </div>
  );
}
