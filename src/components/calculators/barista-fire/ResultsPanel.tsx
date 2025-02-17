import React, { useState } from 'react';
import type { CalculatorState, Message } from './types';
import { calculateBaristaFireNumber, calculateFullFireNumber, calculateFutureValue, formatMoney } from './utils';
import { DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

interface ResultsPanelProps {
  state: CalculatorState;
  messages: Message[];
}

interface KeyNumberCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  details: React.ReactNode;
}

const KeyNumberCard: React.FC<KeyNumberCardProps> = ({ title, value, subtitle, color, details }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{title}</p>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
          <p className="text-xl font-bold">
            <span className={color}>{value}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          {details}
        </div>
      )}
    </div>
  );
};

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ state }) => {
  const baristaFireNumber = calculateBaristaFireNumber(state);
  const fullFireNumber = calculateFullFireNumber(state);
  const yearsToTarget = state.baristaFireAge - state.currentAge;
  const projectedNetWorth = calculateFutureValue(
    state.currentInvestedAssets,
    state.investmentGrowthRate,
    yearsToTarget,
    state.annualIncomeAfterTax - state.currentAnnualSpending,
    state.inflationRate
  );
  
  const additionalNeeded = Math.max(0, baristaFireNumber - projectedNetWorth);
  const annualSavings = state.annualIncomeAfterTax - state.currentAnnualSpending;
  const monthlyBaristaIncome = state.monthlyBaristaIncome * 12;

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <DollarSign className="w-6 h-6 text-emerald-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Key Numbers <span className="text-sm font-normal text-gray-600">(Today's Dollars)</span>
          <InfoTooltip text="All values are adjusted for inflation, showing what the money would be worth in terms of today's purchasing power. This makes it easier to understand the real value of your future savings in relation to your current lifestyle." />
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KeyNumberCard
          title="Barista FIRE Number"
          value={formatMoney(baristaFireNumber)}
          subtitle="Target for part-time transition"
          color="text-[#2563eb]"
          details={
            <div className="space-y-3 text-sm">
              <p className="font-medium">How this is calculated:</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Annual Retirement Expenses:</span>
                  <span className="font-medium">-{formatMoney(state.retirementAnnualSpending)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Part-time Income:</span>
                  <span className="font-medium">{formatMoney(monthlyBaristaIncome)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Net Annual Need:</span>
                  <span className="font-medium">-{formatMoney(state.retirementAnnualSpending - monthlyBaristaIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Safe Withdrawal Rate:</span>
                  <span className="font-medium">{state.safeWithdrawalRate}%</span>
                </div>
                <div className="mt-2 text-gray-600">
                  Your portfolio needs to cover your expenses minus your part-time income.
                </div>
              </div>
            </div>
          }
        />

        <KeyNumberCard
          title="Additional Amount Needed"
          value={formatMoney(additionalNeeded)}
          subtitle="Gap to reach your goal"
          color="text-skin-red-text"
          details={
            <div className="space-y-3 text-sm">
              <p className="font-medium">Your current savings rate:</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Annual Income (After Tax):</span>
                  <span className="font-medium">{formatMoney(state.annualIncomeAfterTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Expenses:</span>
                  <span className="font-medium">-{formatMoney(state.currentAnnualSpending)}</span>
                </div>
                <div className="flex justify-between text-blue-600">
                  <span>Annual Savings:</span>
                  <span className="font-medium">{formatMoney(annualSavings)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Savings Rate:</span>
                  <span className="font-medium">
                    {Math.round((annualSavings / state.annualIncomeAfterTax) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          }
        />

        <KeyNumberCard
          title="Traditional FIRE Number"
          value={formatMoney(fullFireNumber)}
          subtitle="Full retirement target"
          color="text-skin-red-text"
          details={
            <div className="space-y-3 text-sm">
              <p className="font-medium">Full financial independence:</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Annual Retirement Expenses:</span>
                  <span className="font-medium">-{formatMoney(state.retirementAnnualSpending)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Safe Withdrawal Rate:</span>
                  <span className="font-medium">{state.safeWithdrawalRate}%</span>
                </div>
                <div className="mt-2 text-gray-600">
                  This is the amount needed to fully retire without any work income.
                </div>
              </div>
            </div>
          }
        />

        <KeyNumberCard
          title="Projected Net Worth"
          value={formatMoney(projectedNetWorth)}
          subtitle={`At age ${state.baristaFireAge}`}
          color="text-skin-emerald-text"
          details={
            <div className="space-y-3 text-sm">
              <p className="font-medium">Projection assumptions:</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Current Invested Assets:</span>
                  <span className="font-medium">{formatMoney(state.currentInvestedAssets)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Savings:</span>
                  <span className="font-medium">{formatMoney(annualSavings)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Investment Growth Rate:</span>
                  <span className="font-medium">{state.investmentGrowthRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Years to Target:</span>
                  <span className="font-medium">{yearsToTarget} years</span>
                </div>
                <div className="flex justify-between">
                  <span>Inflation Rate:</span>
                  <span className="font-medium">{state.inflationRate}%</span>
                </div>
              </div>
            </div>
          }
        />
      </div>

      <div className="text-center text-sm text-gray-600 mt-4">
        Click on any card to see detailed calculations
      </div>
    </div>
  );
};