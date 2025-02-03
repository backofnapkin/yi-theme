import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import type { CalculationResults } from '../types';
import { formatCurrency } from '../utils';

interface ROITimelineProps {
  results: CalculationResults;
}

export function ROITimeline({ results }: ROITimelineProps) {
  const { roi, projections } = results;

  // Transform projections data for the chart
  const chartData = projections.map(year => ({
    year: `Year ${year.year}`,
    profit: year.profit,
    revenue: year.revenue.total,
    expenses: year.expenses.total
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-900">{label}</p>
        <div className="space-y-1 mt-2">
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm">
              <span 
                className="inline-block w-4 h-4 rounded mr-2" 
                style={{ backgroundColor: entry.color, opacity: 0.3 }} 
              />
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Return on Investment Timeline</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          <div>
            <span className="font-medium">Payback Period:</span>
            <span className="ml-2">{Math.floor(roi.paybackPeriodMonths / 12)} years, {roi.paybackPeriodMonths % 12} months</span>
          </div>
          <div>
            <span className="font-medium">First Year ROI:</span>
            <span className="ml-2">{roi.firstYearROI.toFixed(1)}%</span>
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="year"
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
                tickLine={{ stroke: '#6B7280' }}
                axisLine={{ stroke: '#6B7280' }}
                padding={{ left: 0, right: 0 }}
              />
              <YAxis 
                hide={true}
                domain={['auto', 'auto']}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="profit"
                name="Net Profit"
                stroke="#059669"
                fill="url(#profitGradient)"
                strokeWidth={2}
                isAnimationActive={true}
                animationDuration={1000}
                animationBegin={0}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#2563EB"
                fill="url(#revenueGradient)"
                strokeWidth={2}
                isAnimationActive={true}
                animationDuration={1000}
                animationBegin={200}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#DC2626"
                fill="url(#expensesGradient)"
                strokeWidth={2}
                isAnimationActive={true}
                animationDuration={1000}
                animationBegin={400}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="text-sm text-gray-500 text-center">
          Projected financial performance over 10 years. The annual growth rate used in the Return on Investment Timeline is 3%. This growth rate is applied to both revenue and expenses with the exception of loan payments.
        </div>
      </div>
    </div>
  );
}