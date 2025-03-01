import React from 'react';
import type { CalculationResults, TowTruckBusinessData } from './types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ResultsSectionProps {
  results: CalculationResults;
  data: TowTruckBusinessData;
}

export function ResultsSection({ results, data }: ResultsSectionProps) {
  return (
    <div className="space-y-8">
      <div className="text-center text-2xl font-bold text-gray-900 mb-8">
        {data.companyName}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Monthly Revenue"
          value={results.monthlyRevenue}
          type="currency"
        />
        <MetricCard
          title="Monthly Expenses"
          value={results.monthlyExpenses}
          type="currency"
        />
        <MetricCard
          title="Monthly Profit"
          value={results.monthlyProfit}
          type="currency"
          highlight={true}
        />
        <MetricCard
          title="Yearly Revenue"
          value={results.yearlyRevenue}
          type="currency"
        />
        <MetricCard
          title="Yearly Expenses"
          value={results.yearlyExpenses}
          type="currency"
        />
        <MetricCard
          title="Yearly Profit"
          value={results.yearlyProfit}
          type="currency"
          highlight={true}
        />
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Required Tows to Break Even
        </h3>
        <p className="text-3xl font-bold text-blue-600">
          {Math.ceil(results.requiredTowsPerMonth)} tows per month
        </p>
        <p className="text-sm text-gray-500 mt-2">
          This is the minimum number of tows needed monthly to cover all expenses
        </p>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          12-Month Cash Flow Projection
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={results.cashFlow.oneYear}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#4F46E5"
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#EF4444"
                name="Expenses"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#10B981"
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  type: 'currency' | 'number';
  highlight?: boolean;
}

function MetricCard({ title, value, type, highlight = false }: MetricCardProps) {
  const formattedValue = type === 'currency'
    ? `$${value.toLocaleString()}`
    : value.toLocaleString();

  const isPositive = value > 0;
  const textColorClass = highlight
    ? isPositive
      ? 'text-green-600'
      : 'text-red-600'
    : 'text-gray-900';

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className={`mt-2 text-3xl font-bold ${textColorClass}`}>
        {formattedValue}
      </p>
    </div>
  );
}