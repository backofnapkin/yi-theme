import React from 'react';
import { DollarSign, TrendingUp, Clock, PiggyBank, Timer, Wallet, Info } from 'lucide-react';
import { Tooltip } from '../../ui/Tooltip';

interface KeyInsightsProps {
  monthlyRevenue: number;
  monthlyOperatingCosts: number;
  monthlyProfit: number;
  totalStartupCost: number;
  breakEvenMonths: number;
  annualCashFlow: number;
}

export const KeyInsights: React.FC<KeyInsightsProps> = ({
  monthlyRevenue,
  monthlyOperatingCosts,
  monthlyProfit,
  totalStartupCost,
  breakEvenMonths,
  annualCashFlow,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <PiggyBank className="w-5 h-5" />
          Profit Estimate
          <Tooltip content="A comprehensive breakdown of your monthly revenue, operating costs, and resulting profit">
            <Info className="w-4 h-4 text-gray-400" />
          </Tooltip>
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Monthly Revenue</p>
            <p className="text-2xl font-bold text-skin-emerald-text">{formatCurrency(monthlyRevenue)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Monthly Operating Costs</p>
            <p className="text-2xl font-bold text-skin-red-text">{formatCurrency(monthlyOperatingCosts)}</p>
          </div>
          <div className="pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-600">Monthly Profit</p>
            <p className={`text-2xl font-bold ${monthlyProfit >= 0 ? 'text-skin-emerald-text' : 'text-skin-red-text'}`}>
              {formatCurrency(monthlyProfit)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Timer className="w-5 h-5" />
          Break-Even Analysis
          <Tooltip content="Calculates how long it will take to recover your initial investment based on monthly profits">
            <Info className="w-4 h-4 text-gray-400" />
          </Tooltip>
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Total Startup Cost</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalStartupCost)}</p>
          </div>
          <div className="pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-600">Estimated Time to Break Even</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-blue-600">{breakEvenMonths}</p>
              <p className="text-gray-600">months</p>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {breakEvenMonths > 0 
                ? `(approximately ${Math.floor(breakEvenMonths / 12)} years and ${breakEvenMonths % 12} months)`
                : 'Warning: You will never break-even with current inputs. Adjust your business plan to turn a profit.'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Cash Flow Summary
          <Tooltip content="Overview of your monthly and annual cash flows, including profit margins">
            <Info className="w-4 h-4 text-gray-400" />
          </Tooltip>
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Monthly Cash Flow</p>
            <p className={`text-2xl font-bold ${monthlyProfit >= 0 ? 'text-skin-emerald-text' : 'text-skin-red-text'}`}>
              {formatCurrency(monthlyProfit)}
            </p>
          </div>
          <div className="pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-600">Annual Cash Flow</p>
            <p className={`text-2xl font-bold ${annualCashFlow >= 0 ? 'text-skin-emerald-text' : 'text-skin-red-text'}`}>
              {formatCurrency(annualCashFlow)}
            </p>
          </div>
          <div className="pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-600">Monthly Profit Margin</p>
            <p className={`text-2xl font-bold ${(monthlyProfit / monthlyRevenue * 100) >= 0 ? 'text-skin-emerald-text' : 'text-skin-red-text'}`}>
              {((monthlyProfit / monthlyRevenue) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};