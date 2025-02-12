import React, { useState } from 'react';
import { LineChart } from 'lucide-react';
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
import type { TimelineDataPoint } from './types';

interface CoastFireChartProps {
  data: TimelineDataPoint[];
  showSocialSecurity: boolean;
  showTaxImpact: boolean;
  inflationRate: number;
  currentAge: number;
}

const BaseChart: React.FC<{
  chartData: TimelineDataPoint[];
  visibleLines: any;
  showSocialSecurity: boolean;
  CustomTooltip: any;
  isMobile: boolean;
}> = ({ chartData, visibleLines, showSocialSecurity, CustomTooltip, isMobile }) => (
  <ResponsiveContainer height={isMobile ? 500 : 560}>
    <AreaChart 
      data={chartData}
      margin={isMobile 
        ? { top: 20, right: 0, left: 0, bottom: 20 }
        : { top: 30, right: 0, left: 0, bottom: 30 }
      }
    >
      <defs>
        <linearGradient id="withContributionsGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05}/>
        </linearGradient>
        <linearGradient id="withoutContributionsGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#059669" stopOpacity={0.05}/>
        </linearGradient>
        <linearGradient id="coastFireGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
        </linearGradient>
        <linearGradient id="fireNumberGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#dc2626" stopOpacity={0.05}/>
        </linearGradient>
        <linearGradient id="socialSecurityGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#9333ea" stopOpacity={0.05}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
      <XAxis 
        dataKey="age"
        stroke="#6B7280"
        tick={{ fill: '#6B7280' }}
        tickLine={{ stroke: '#6B7280' }}
        interval={isMobile ? 3 : 2}
        fontSize={isMobile ? 10 : 12}
        padding={{ left: 10, right: 10 }}
      />
      <YAxis hide={true} domain={['auto', 'auto']} />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={isMobile ? { fontSize: '10px' } : undefined} />
      
      {visibleLines.withContributions && (
        <Area
          type="monotone"
          dataKey="withContributions"
          name="With Contributions"
          stroke="#2563eb"
          fill="url(#withContributionsGradient)"
          strokeWidth={2}
        />
      )}
      
      {visibleLines.withoutContributions && (
        <Area
          type="monotone"
          dataKey="withoutContributions"
          name="No Contributions"
          stroke="#059669"
          fill="url(#withoutContributionsGradient)"
          strokeWidth={2}
        />
      )}
      
      {visibleLines.coastFireNumber && (
        <Area
          type="monotone"
          dataKey="coastFireNumber"
          name="Coast FIRE Number"
          stroke="#6366f1"
          fill="url(#coastFireGradient)"
          strokeWidth={2}
        />
      )}
      
      {visibleLines.fireNumber && (
        <Area
          type="monotone"
          dataKey="fireNumber"
          name="FIRE Number"
          stroke="#dc2626"
          fill="url(#fireNumberGradient)"
          strokeWidth={2}
        />
      )}
      
      {showSocialSecurity && visibleLines.withSocialSecurity && (
        <Area
          type="monotone"
          dataKey="withSocialSecurity"
          name="With Social Security"
          stroke="#9333ea"
          fill="url(#socialSecurityGradient)"
          strokeWidth={2}
        />
      )}
    </AreaChart>
  </ResponsiveContainer>
);

export const CoastFireChart: React.FC<CoastFireChartProps> = ({
  data,
  showSocialSecurity,
  inflationRate,
  currentAge
}) => {
  const [visibleLines, setVisibleLines] = useState({
    withContributions: true,
    withoutContributions: true,
    coastFireNumber: true,
    fireNumber: true,
    withSocialSecurity: true
  });
  const [adjustForInflation, setAdjustForInflation] = useState(false);

  const adjustValueForInflation = (value: number, age: number) => {
    return adjustForInflation
      ? value * Math.pow(1 + inflationRate / 100, age - currentAge)
      : value;
  };

  const chartData = data.map(point => ({
    ...point,
    withContributions: adjustValueForInflation(point.withContributions, point.age),
    withoutContributions: adjustValueForInflation(point.withoutContributions, point.age),
    coastFireNumber: adjustValueForInflation(point.coastFireNumber, point.age),
    fireNumber: adjustValueForInflation(point.fireNumber, point.age),
    withSocialSecurity: point.withSocialSecurity 
      ? adjustValueForInflation(point.withSocialSecurity, point.age)
      : undefined
  }));

  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const toggleLine = (key: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
      <div
        style={{
          backgroundColor: 'rgb(251, 251, 251)',
          border: '1px solid rgb(104, 157, 106)',
          color: 'rgb(80, 73, 69)',
          position: 'absolute',
          left: '20px',
          top: '20px',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          zIndex: 50,
          width: '16rem',
          maxWidth: 'calc(100vw - 32px)',
          pointerEvents: 'none'
        }}
      >
        <p className="font-medium text-gray-900">Age {label}</p>
        <div className="space-y-1 mt-2">
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm">
              <span className="inline-block w-4 h-4 rounded mr-2" 
                style={{ backgroundColor: entry.color, opacity: 0.3 }} 
              />
              {entry.name}: {formatTooltipValue(entry.value)}
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mx-0 space-y-3">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <LineChart className="w-6 h-6 text-emerald-600" />
          Coast FIRE Timeline
        </h2>
        <button
          onClick={() => setAdjustForInflation(!adjustForInflation)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          {adjustForInflation ? 'Show Nominal Values' : 'Adjust for Inflation'}
        </button>
      </div>

      <div className="hidden md:block h-[560px] relative">
        <BaseChart 
          chartData={chartData}
          visibleLines={visibleLines}
          showSocialSecurity={showSocialSecurity}
          CustomTooltip={CustomTooltip}
          isMobile={false}
        />
      </div>
      
      <div className="block md:hidden h-[500px] relative -mx-8 px-0">
        <BaseChart 
          chartData={chartData}
          visibleLines={visibleLines}
          showSocialSecurity={showSocialSecurity}
          CustomTooltip={CustomTooltip}
          isMobile={true}
        />
      </div>

      <div className="text-xs text-gray-500 mb-1">
        Click checkboxes to display or remove lines from graph
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow-sm">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={visibleLines.withContributions}
            onChange={() => toggleLine('withContributions')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm flex items-center">
            <span className="w-4 h-0.5 bg-blue-600 inline-block mr-2"></span>
            With Contributions
          </span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={visibleLines.withoutContributions}
            onChange={() => toggleLine('withoutContributions')}
            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm flex items-center">
            <span className="w-4 h-0.5 bg-emerald-600 inline-block mr-2"></span>
            No Contributions
          </span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={visibleLines.coastFireNumber}
            onChange={() => toggleLine('coastFireNumber')}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm flex items-center">
            <span className="w-4 h-0.5 bg-indigo-600 inline-block mr-2"></span>
            Coast FIRE Number
          </span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={visibleLines.fireNumber}
            onChange={() => toggleLine('fireNumber')}
            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
          />
          <span className="text-sm flex items-center">
            <span className="w-4 h-0.5 bg-red-600 inline-block mr-2"></span>
            FIRE Number
          </span>
        </label>

        {showSocialSecurity && (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={visibleLines.withSocialSecurity}
              onChange={() => toggleLine('withSocialSecurity')}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm flex items-center">
              <span className="w-4 h-0.5 bg-purple-600 inline-block mr-2"></span>
              With Social Security
            </span>
          </label>
        )}
      </div>

      <div className="text-sm text-gray-600 text-center">
        {adjustForInflation 
          ? "Values shown are adjusted for inflation (future dollars)"
          : "Values shown are nominal (not adjusted for inflation)"}
      </div>
    </div>
  );
};