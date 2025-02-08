import React from 'react';
import { ArrowRight, Calculator, DollarSign, PiggyBank, RefreshCcw } from 'lucide-react';
import type { IncomeRange, ResultsData } from './types';
import { BorderContainer } from './BorderContainer';

interface ResultsDisplayProps {
  results: ResultsData;
  income: IncomeRange;
  onRetake: () => void;
}

const SCORING_RANGES: Record<IncomeRange, { range: string; description: string }[]> = {
  'Under $30,000': [
    { range: '7-10', description: 'Free Spending. Be careful: this could lead to financial stress at your income.' },
    { range: '11-14', description: 'Balanced (making good choices for your income).' },
    { range: '15-22', description: 'Frugal (being careful with limited resources).' },
    { range: '23-29', description: 'Your spending is understandable due to limited income.)' },
  ],
  '$30,000-$59,999': [
    { range: '8-12', description: 'Comfortable Spending. Consider building more savings.' },
    { range: '13-16', description: 'Balanced. You are certainly not a tight wad.' },
    { range: '17-24', description: 'Frugal, but not cheap. Nice work!' },
    { range: '25-32', description: 'Getting into "cheap" territory.' },
  ],
  '$60,000-$99,999': [
    { range: '9-14', description: 'Comfortable Spending. You\'re generous and enjoy using money.' },
    { range: '15-18', description: 'Balanced spending. No one can call you cheap!' },
    { range: '19-27', description: 'Frugal, but not cheap. Nice work!' },
    { range: '28-36', description: 'You are cheap. Plain and simple.' },
  ],
  '$100,000-$149,999': [
    { range: '11-17', description: 'Free Spending (You\'re generous and comfortable sharing your success)' },
    { range: '18-22', description: 'Balanced spending. You are giving without going overboard.' },
    { range: '23-32', description: 'You are frugal my friend. Not cheap!' },
    { range: '33-43', description: 'Definitely cheap. That is not a compliment!' },
  ],
  '$150,000+': [
    { range: '14-20', description: 'Free Spending. You\'re generous and enjoy sharing your prosperity.' },
    { range: '21-27', description: 'Balanced spending. You have the means to enjoy life.' },
    { range: '28-40', description: 'Frugal with resources and planning for the future.' },
    { range: '41-54', description: 'Being cheap and probably sacrificing quality of life.' },
  ],
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  income,
  onRetake,
}) => {
  const getCategoryIcon = () => {
    switch (results.category) {
      case 'Free Spending':
        return <DollarSign className="w-12 h-12 text-skin-active" />;
      case 'Balanced':
        return <Calculator className="w-12 h-12 text-skin-active" />;
      case 'Frugal':
        return <PiggyBank className="w-12 h-12 text-skin-active" />;
      case 'Cheap':
        return <ArrowRight className="w-12 h-12 text-skin-active" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Category and Score */}
      <BorderContainer>
        <div className="flex items-center gap-3 mb-4">
          {getCategoryIcon()}
          <h2 className="text-3xl font-bold text-skin-base">
            You are: <span className="text-skin-active">{results.category}</span>
          </h2>
        </div>
        <p className="text-lg text-skin-base opacity-90 mb-4">{results.feedback}</p>
        <div className="flex flex-col sm:flex-row gap-2 text-center">
          <div className="flex-1 p-4 bg-skin-fill rounded-lg">
            <p className="text-sm text-skin-base mb-1">Your Score</p>
            <p className="text-2xl font-bold text-skin-active">
              {results.adjustedScore} / {results.maxPossibleScore}
            </p>
          </div>
          <div className="flex-1 p-4 bg-skin-fill rounded-lg">
            <p className="text-sm text-skin-base opacity-90 mb-1">Income Multiplier</p>
            <p className="text-2xl font-bold text-skin-active">×{results.incomeMultiplier}</p>
          </div>
        </div>
      </BorderContainer>

      {/* Scoring System */}
      <BorderContainer >
        <h3 className="text-xl font-semibold text-skin-base mb-1">
          Scoring System for {income}
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-1">
            {SCORING_RANGES[income].map(({ range, description }, index) => {
              const isCurrentRange = results.adjustedScore >= parseInt(range.split('-')[0]) && 
                                   results.adjustedScore <= parseInt(range.split('-')[1]);
              return (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg transition-all duration-200 ${
                    isCurrentRange
                      ? 'bg-[rgb(var(--color-border-active))] bg-opacity-10 border-2 border-skin-active'
                      : 'bg-skin-fill bg-opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-skin-base">Score Range: {range}</p>
                      <p className="text-sm text-skin-base opacity-80">{description}</p>
                    </div>
                    {isCurrentRange && (
                      <div className="flex-shrink-0">
                        <span className="px-3 py-1 text-sm font-medium text-skin-active bg-skin-fill rounded-full">
                          Your Range
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </BorderContainer>

      {/* Retake Button */}
      <div className="text-center">
        <button
          onClick={onRetake}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors bg-gradient-to-br from-green-50 to-emerald-50 text-gray-700 hover:from-green-100 hover:to-emerald-100 active:from-green-200 active:to-emerald-200 border border-emerald-100 shadow-sm"
        >
          <RefreshCcw className="w-5 h-5" />
          Take the Quiz Again
        </button>
      </div>
    </div>
  );
};