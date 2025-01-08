import React from 'react';
import { InfoButton } from './InfoButton';
import type { CalculatorResults } from './types';

interface ResultPanelProps {
  results: CalculatorResults | null;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ results }) => {
  if (!results) return null;

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);

  const formatPercentage = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 4 }).format(value);

  return (
    <div className="bg-[rgb(var(--color-fill))] p-6 rounded-lg shadow-lg border-2 border-[rgb(var(--color-border-active))] space-y-6">
      <h2 className="text-xl font-bold text-[rgb(var(--color-text))] mb-6">Hole-In-One Challenge Business Projections</h2>
      
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-[rgba(var(--color-border-active),0.1)] to-[rgba(var(--color-border),0.1)] p-6 rounded-xl shadow-md border-2 border-[rgb(var(--color-border-active))] transform hover:scale-105 transition-transform">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-[rgb(var(--color-text))]">Win Probability</h3>
            <InfoButton content="The probability of a single customer hitting a hole-in-one" />
          </div>
          <p className="text-3xl font-bold text-[rgb(var(--color-border-active))]">{formatPercentage(results.winProbability)}</p>
          <p className="text-sm text-[rgb(var(--color-text))] mt-1">per customer</p>
        </div>

        <div className="bg-gradient-to-r from-[rgba(var(--color-border),0.1)] to-[rgba(var(--color-border-active),0.1)] p-6 rounded-xl shadow-md border-2 border-[rgb(var(--color-border))] transform hover:scale-105 transition-transform">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-[rgb(var(--color-text))]">Annual Payouts</h3>
            <InfoButton content="Expected number of prize payouts per year" />
          </div>
          <p className="text-3xl font-bold text-[rgb(var(--color-border))]">{Math.round(results.projectedAnnualPayouts)}</p>
          <p className="text-sm text-[rgb(var(--color-text))] mt-1">projected wins</p>
        </div>

        <div className="bg-[rgb(var(--color-red-bg))] p-6 rounded-xl shadow-md border-2 border-[rgb(var(--color-red-border))] transform hover:scale-105 transition-transform">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-[rgb(var(--color-red-text))]">Prize Payouts</h3>
            <InfoButton content="Total amount expected to be paid out in prizes annually" />
          </div>
          <p className="text-3xl font-bold text-[rgb(var(--color-red-text))]">{formatCurrency(results.totalPrizePayouts)}</p>
          <p className="text-sm text-[rgb(var(--color-red-text))] mt-1">per year</p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Annual Revenue</span>
            <InfoButton content="Total revenue before expenses (12 months)" />
          </div>
          <span className="font-bold text-gray-900">{formatCurrency(results.annualRevenue)}</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Monthly Revenue</span>
            <InfoButton content="Average monthly revenue before expenses" />
          </div>
          <span className="font-bold text-gray-900">{formatCurrency(results.monthlyRevenue)}</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Revenue Split Amount</span>
            <InfoButton content="Amount shared with third-party business or charity" />
          </div>
          <span className="font-bold text-gray-900">{formatCurrency(results.revenueSplitAmount)}</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Net Revenue</span>
            <InfoButton content="Final revenue after prize payouts and splits" />
          </div>
          <span className="font-bold text-gray-900">{formatCurrency(results.netRevenue)}</span>
        </div>
      </div>
    </div>
  );
};