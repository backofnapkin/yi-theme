import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { formatCurrency } from '../../../utils/calculations';
import type { CalculationResults, CalculatorInputs } from '../../../types';

interface ResultsChartProps {
  results: CalculationResults;
  inputs: CalculatorInputs;
}

export function ResultsChart({ results, inputs }: ResultsChartProps) {
  const [adjustForInflation, setAdjustForInflation] = useState(false);

  // Adjust data for inflation if enabled
  const chartData = results.chartData.map(point => ({
    ...point,
    totalInvestedAssets: adjustForInflation 
      ? point.totalInvestedAssets / Math.pow(1 + inputs.inflationRate / 100, point.age - inputs.currentAge)
      : point.totalInvestedAssets,
    fireGoal: inputs.totalInvestedAssetsGoal
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-900">Age {label}</p>
        <div className="space-y-1 mt-2">
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm">
              <span className="inline-block w-4 h-4 rounded mr-2" 
                style={{ backgroundColor: entry.color, opacity: entry.dataKey === 'totalInvestedAssets' ? 0.3 : 1 }} 
              />
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Investment Growth Timeline</h2>
        <Button
          variant="outline"
          onClick={() => setAdjustForInflation(!adjustForInflation)}
        >
          {adjustForInflation ? 'Show Nominal Values' : 'Adjust for Inflation'}
        </Button>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="investedAssetsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="age"
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
              tickLine={{ stroke: '#6B7280' }}
            />
            <YAxis
              hide={true} 
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
              tickLine={{ stroke: '#6B7280' }}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top"
              height={36}
              formatter={(value) => {
                switch (value) {
                  case 'Total Invested Assets':
                    return 'Total Invested Assets';
                  case 'FIRE Goal':
                    return 'FIRE Goal';
                  default:
                    return value;
                }
              }}
            />
            <Area
              type="monotone"
              dataKey="totalInvestedAssets"
              stroke="#059669"
              fill="url(#investedAssetsGradient)"
              strokeWidth={2}
              name="Total Invested Assets"
            />
            <Area
              type="monotone"
              dataKey="fireGoal"
              stroke="#DC2626"
              fill="none"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="FIRE Goal"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          {adjustForInflation 
            ? "Values shown are adjusted for inflation to today's dollars"
            : "Values shown are nominal (not adjusted for inflation)"}
        </p>
      </div>
    </Card>
  );
}