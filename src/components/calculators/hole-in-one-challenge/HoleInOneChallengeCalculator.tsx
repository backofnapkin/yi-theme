import { useState } from 'react';
import { Target, RotateCcw } from 'lucide-react';
import { GOLFER_PROFILES } from './constants';
import { ResultPanel } from './ResultPanel';
import { InfoButton } from './InfoButton';
import type { CalculatorInputs, CalculatorResults, GolferProfile } from './types';

export function HoleInOneChallengeCalculator() {
  const defaultInputs: CalculatorInputs = {
    prizeAmount: 10000,
    golferProfile: GOLFER_PROFILES[2],
    numberOfBalls: 20,
    pricePerAttempt: 20,
    monthlyCustomers: 1000,
    hasRevenueSplit: false,
    revenueSplitPercentage: 0
  };

  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const [results, setResults] = useState<CalculatorResults | null>(null);

  const handleCalculate = () => {
    const winProbability = inputs.numberOfBalls / inputs.golferProfile.odds;
    const projectedAnnualPayouts = (inputs.monthlyCustomers * 12) * winProbability;
    const totalPrizePayouts = projectedAnnualPayouts * inputs.prizeAmount;
    const annualRevenue = inputs.monthlyCustomers * 12 * inputs.pricePerAttempt;
    const monthlyRevenue = annualRevenue / 12;
    const revenueSplitAmount = inputs.hasRevenueSplit 
      ? (annualRevenue - totalPrizePayouts) * (inputs.revenueSplitPercentage / 100)
      : 0;
    const netRevenue = annualRevenue - totalPrizePayouts - revenueSplitAmount;

    setResults({
      winProbability,
      projectedAnnualPayouts,
      totalPrizePayouts,
      annualRevenue,
      monthlyRevenue,
      revenueSplitAmount,
      netRevenue
    });
  };

  const handleReset = () => {
    setInputs(defaultInputs);
    setResults(null);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const profile = GOLFER_PROFILES.find(p => p.type === e.target.value) as GolferProfile;
    setInputs(prev => ({ ...prev, golferProfile: profile }));
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  const inputClasses = "w-full p-2 bg-[rgb(var(--color-fill-secondary))] border border-[rgb(var(--color-border))] rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-[rgb(var(--color-text))] transition-colors";

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="bg-[rgb(var(--color-fill))] p-6 rounded-lg shadow-lg border border-[rgb(var(--color-border))]">
        <h1 className="text-2xl font-bold text-[rgb(var(--color-text))] mb-6">
          Hole-in-One Challenge Calculator
        </h1>

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="block text-sm font-medium text-[rgb(var(--color-text))]">
                  Prize Amount
                </label>
                <InfoButton content="Amount awarded for a hole-in-one" />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-[rgb(var(--color-text))]">$</span>
                <input
                  type="text"
                  value={formatNumber(inputs.prizeAmount)}
                  onChange={e => setInputs(prev => ({ ...prev, prizeAmount: Number(e.target.value.replace(/,/g, '')) }))}
                  className={`pl-8 ${inputClasses}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="block text-sm font-medium text-[rgb(var(--color-text))]">
                  Golfer Profile
                </label>
                <InfoButton content="Select the skill level of your target customers" />
              </div>
              <select
                value={inputs.golferProfile.type}
                onChange={handleProfileChange}
                className={inputClasses}
              >
                {GOLFER_PROFILES.map(profile => (
                  <option key={profile.type} value={profile.type}>
                    {profile.type} - 1 in {profile.odds.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="block text-sm font-medium text-[rgb(var(--color-text))]">
                  Number of Balls
                </label>
                <InfoButton content="Number of attempts per customer" />
              </div>
              <input
                type="text"
                value={formatNumber(inputs.numberOfBalls)}
                onChange={e => setInputs(prev => ({ ...prev, numberOfBalls: Number(e.target.value.replace(/,/g, '')) }))}
                className={inputClasses}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="block text-sm font-medium text-[rgb(var(--color-text))]">
                  Price per Game
                </label>
                <InfoButton content="Cost per customer" />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-[rgb(var(--color-text))]">$</span>
                <input
                  type="text"
                  value={formatNumber(inputs.pricePerAttempt)}
                  onChange={e => setInputs(prev => ({ ...prev, pricePerAttempt: Number(e.target.value.replace(/,/g, '')) }))}
                  className={`pl-8 ${inputClasses}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="block text-sm font-medium text-[rgb(var(--color-text))]">
                  Monthly Customers
                </label>
                <InfoButton content="Expected number of customers per month" />
              </div>
              <input
                type="text"
                value={formatNumber(inputs.monthlyCustomers)}
                onChange={e => setInputs(prev => ({ ...prev, monthlyCustomers: Number(e.target.value.replace(/,/g, '')) }))}
                className={inputClasses}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="block text-sm font-medium text-[rgb(var(--color-text))]">
                  Revenue Split
                </label>
                <InfoButton content="Share revenue with a third-party business or charity" />
              </div>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={inputs.hasRevenueSplit}
                    onChange={e => setInputs(prev => ({ ...prev, hasRevenueSplit: e.target.checked }))}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-[rgb(var(--color-text))]">Enable Split</span>
                </label>
                {inputs.hasRevenueSplit && (
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={inputs.revenueSplitPercentage}
                      onChange={e => setInputs(prev => ({ ...prev, revenueSplitPercentage: Number(e.target.value) }))}
                      className={`${inputClasses} pr-8`}
                      min="0"
                      max="100"
                    />
                    <span className="absolute right-3 top-2 text-[rgb(var(--color-text))]">%</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-[rgb(var(--color-border-active))] text-white py-3 px-6 rounded-lg hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center justify-center gap-2 transition-colors border-2 border-[rgb(var(--color-border-active))] shadow-lg hover:shadow-xl"
            >
              <Target className="w-5 h-5" />
              Calculate
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2 transition-colors border-2 border-gray-600"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {results && <ResultPanel results={results} />}
    </div>
  );
}