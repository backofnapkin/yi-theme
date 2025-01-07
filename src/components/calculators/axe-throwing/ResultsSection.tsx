import React, { forwardRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Printer, DollarSign, Calendar } from 'lucide-react';
import { InfoButton } from './InfoButton';
import type { CalculatorResults } from './types';

interface ResultsSectionProps {
  results: CalculatorResults;
  businessName: string;
}

const formatCurrency = (value: number) => {
  return `$${Math.round(value).toLocaleString()}`;
};

export const ResultsSection = forwardRef<HTMLDivElement, ResultsSectionProps>(
  ({ results, businessName }, ref) => {
    const handlePrint = () => {
      window.print();
    };

    const chartData = Array.from({ length: 36 }, (_, index) => {
      const monthInYear = index % 12;
      const yearNumber = Math.floor(index / 12) + 1;
      
      const yearToDate = {
        revenue: results.totalMonthlyRevenue * (monthInYear + 1),
        costs: results.totalMonthlyCosts * (monthInYear + 1),
        profit: (results.totalMonthlyRevenue - results.totalMonthlyCosts) * (monthInYear + 1)
      };

      return {
        month: `Year ${yearNumber} - M${monthInYear + 1}`,
        ...yearToDate
      };
    });

    return (
      <div ref={ref} className="bg-[rgb(var(--color-fill))] rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">
            {businessName} Financial Projections
          </h2>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--color-border-active))] text-white rounded-lg hover:bg-[rgba(var(--color-border-active),0.9)] transition-colors"
          >
            <Printer className="h-5 w-5" />
            Print Results
          </button>
        </div>

        {/* Rest of the component remains exactly the same */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(var(--color-text-active),0.1)] to-[rgba(var(--color-border-active),0.1)] border border-[rgba(var(--color-border-active),0.6)]">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-6 w-6 text-[rgb(var(--color-text-active))]" />
              <h3 className="text-lg font-semibold text-[rgb(var(--color-text))]">Total Startup Costs</h3>
              <InfoButton text="One-time costs to get your business running, including leasehold improvements, equipment, permits, and initial marketing." />
            </div>
            <p className="text-3xl font-bold text-[rgb(var(--color-text-active))]">{formatCurrency(results.totalStartupCosts)}</p>
          </div>

          <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(var(--color-fill-secondary),0.1)] to-[rgba(var(--color-border),0.1)] border border-[rgba(var(--color-border),0.6)]">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-6 w-6 text-[rgb(var(--color-border))]" />
              <h3 className="text-lg font-semibold text-[rgb(var(--color-text))]">Monthly Overview</h3>
              <InfoButton text="Monthly financial snapshot showing your expected revenue, operating costs, and resulting net profit." />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[rgb(var(--color-text))]">Revenue:</span>
                <span className="font-semibold text-[rgb(var(--color-text))]">{formatCurrency(results.totalMonthlyRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[rgb(var(--color-text))]">Costs:</span>
                <span className="font-semibold text-[rgb(var(--color-text))]">{formatCurrency(results.totalMonthlyCosts)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[rgba(var(--color-border),0.3)]">
                <span className="text-[rgb(var(--color-text))]">Net Profit:</span>
                <span className="font-semibold text-[rgb(var(--color-text))]">
                  {formatCurrency(results.totalMonthlyRevenue - results.totalMonthlyCosts)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-4 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(var(--color-text-active),0.1)] to-[rgba(var(--color-border),0.1)] border border-[rgba(var(--color-border),0.6)]">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-[rgb(var(--color-text))]">Net Profit Margin</h3>
              <InfoButton text="The percentage of revenue that becomes profit after all expenses. Higher margins indicate better profitability." />
            </div>
            <p className="text-3xl font-bold text-[rgb(var(--color-text-active))]">{results.netProfitMargin.toFixed(1)}%</p>
          </div>

          <div className="p-4 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(var(--color-fill-secondary),0.1)] to-[rgba(var(--color-border),0.1)] border border-[rgba(var(--color-border),0.6)]">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-[rgb(var(--color-text))]">Break-even Point</h3>
              <InfoButton text="The time it will take to recover your initial investment based on projected profits." />
            </div>
            <p className="text-3xl font-bold text-[rgb(var(--color-border))]">
              {results.breakEvenWeeks > 52 
                ? `${(results.breakEvenWeeks / 52).toFixed(1)} years`
                : `${Math.ceil(results.breakEvenWeeks / 4)} months`}
            </p>
          </div>

          <div className="p-4 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(var(--color-modal),0.1)] to-[rgba(var(--color-border-active),0.1)] border border-[rgba(var(--color-border),0.6)]">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-[rgb(var(--color-text))]">Monthly Customers Needed</h3>
              <InfoButton text="The minimum number of customers each month to cover all operating expenses." />
            </div>
            <p className="text-3xl font-bold text-[rgb(var(--color-text-active))]">{results.monthlyCustomersNeeded.toLocaleString()}</p>
          </div>

          <div className="p-4 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(var(--color-border-active),0.1)] to-[rgba(var(--color-fill-secondary),0.1)] border border-[rgba(var(--color-border),0.6)]">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-[rgb(var(--color-text))]">Monthly Profit/Lane</h3>
              <InfoButton text="Average profit generated by each lane per month, helping you assess per-lane performance." />
            </div>
            <p className="text-3xl font-bold text-[rgb(var(--color-border))]">{formatCurrency(results.monthlyProfitPerLane)}</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xl font-semibold text-[rgb(var(--color-text))]">3 Year Financial Overview</h3>
            <InfoButton text="Cumulative financial projections showing revenue, costs, and profit trends over three years." />
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={2}
                />
                <YAxis 
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#059669" 
                  name="Cumulative Revenue"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="costs" 
                  stroke="#DC2626" 
                  name="Cumulative Costs"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#2563EB" 
                  name="Cumulative Profit"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(var(--color-text-active),0.1)] to-[rgba(var(--color-border-active),0.1)] border border-[rgba(var(--color-border-active),0.6)]">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-6 w-6 text-[rgb(var(--color-text-active))]" />
              <h3 className="text-lg font-semibold text-[rgb(var(--color-text))]">Conservative Scenario</h3>
              <InfoButton text="Annual profit projection assuming 25% lower customer traffic than expected, helping you plan for slower periods." />
            </div>
            <p className="text-3xl font-bold text-[rgb(var(--color-text-active))]">{formatCurrency(results.scenarios.conservative)}</p>
            <p className="text-sm text-[rgb(var(--color-text))] mt-2">Annual net-profit with 25% less customers</p>
          </div>

          <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(var(--color-fill-secondary),0.1)] to-[rgba(var(--color-border),0.1)] border border-[rgba(var(--color-border),0.6)]">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-6 w-6 text-[rgb(var(--color-border))]" />
              <h3 className="text-lg font-semibold text-[rgb(var(--color-text))]">Optimistic Scenario</h3>
              <InfoButton text="Annual profit projection assuming 25% higher customer traffic than expected, showing growth potential." />
            </div>
            <p className="text-3xl font-bold text-[rgb(var(--color-border))]">{formatCurrency(results.scenarios.optimistic)}</p>
            <p className="text-sm text-[rgb(var(--color-text))] mt-2">Annual net-profit with 25% more customers</p>
          </div>
        </div>
      </div>
    );
  }
);