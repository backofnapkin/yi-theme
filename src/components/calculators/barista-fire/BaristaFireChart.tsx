import React from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartData {
  age: number;
  baristaFireNetWorth: number;
  currentJobNetWorth: number;
  fullFireNumber: number;
  socialSecurityImpact?: number;
}

interface BaristaFireChartProps {
  data: ChartData[];
  selectedLines: string[];
  onLineToggle: (line: string) => void;
}

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const formatYAxis = (value: number): string => {
  if (value === 0) return '';
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-gray-50 border border-green-600 p-4 rounded-lg shadow-md absolute left-5 top-5 z-50 w-64 max-w-[calc(100vw-32px)] pointer-events-none">
      <p className="font-medium text-gray-900 mb-2">Age {label}</p>
      <div className="space-y-1">
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center space-x-2 mb-1">
            <div 
              className="w-3 h-3" 
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm text-gray-600">
              <span className="font-medium">{entry.name}:</span>{' '}
              {formatMoney(entry.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const renderLegend = (props: any, selectedLines: string[], onLineToggle: (line: string) => void) => {
  const legendItems = [
    { id: 'baristaFire', name: 'Barista FIRE Net Worth', dataKey: 'baristaFireNetWorth', color: '#2563eb' },
    { id: 'currentJob', name: 'Net Worth (Current Job)', dataKey: 'currentJobNetWorth', color: '#059669' },
    { id: 'fullFire', name: 'Full FIRE Number', dataKey: 'fullFireNumber', color: '#dc2626' },
    { id: 'socialSecurity', name: 'With Social Security', dataKey: 'socialSecurityImpact', color: '#9333ea' }
  ];
  
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-2">
      {legendItems.map((item) => {
        const isActive = selectedLines.includes(item.id);
        
        return (
          <div
            key={item.id}
            className={`flex items-center cursor-pointer transition-opacity duration-200 ${
              isActive ? 'opacity-100' : 'opacity-50'
            }`}
            onClick={() => onLineToggle(item.id)}
          >
            <span
              className="inline-block w-4 h-2 mr-2"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm font-medium">{item.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export const BaristaFireChart: React.FC<BaristaFireChartProps> = ({ data, selectedLines, onLineToggle }) => {
  return (
    <div className="w-full -mx-4 sm:mx-0 h-[400px] md:h-[700px] pl-2 pr-0 sm:px-0">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart 
          data={data} 
          margin={{ 
            top: 10, 
            right: 0,
            left: 10, 
            bottom: 5 
          }}
        >
          <defs>
            <linearGradient id="baristaFireGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="currentJobGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#059669" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="socialSecurityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#9333ea" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
          
          <XAxis
            dataKey="age"
            stroke="#6B7280"
            tick={{ 
              fill: '#6B7280',
              fontSize: 11
            }}
            tickLine={{ stroke: '#6B7280' }}
            tickMargin={5}
          />
          
          <YAxis
            yAxisId="left"
            tickFormatter={formatYAxis}
            axisLine={false}
            tickLine={false}
            orientation="left"
            tick={{ 
              dx: 5,
              textAnchor: "start",
              fontSize: 11
            }}
            width={55}
            tickSize={0}
            domain={[0, 'auto']}
            allowDecimals={false}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend content={(props) => renderLegend(props, selectedLines, onLineToggle)} />
          
          {selectedLines.includes('baristaFire') && (
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="baristaFireNetWorth"
              name="Barista FIRE Net Worth"
              stroke="#2563eb"
              fill="url(#baristaFireGradient)"
              strokeWidth={2}
            />
          )}
          
          {selectedLines.includes('currentJob') && (
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="currentJobNetWorth"
              name="Net Worth (Current Job)"
              stroke="#059669"
              fill="url(#currentJobGradient)"
              strokeWidth={2}
            />
          )}
          
          {selectedLines.includes('fullFire') && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="fullFireNumber"
              name="Full FIRE Number"
              stroke="#dc2626"
              strokeWidth={2}
              dot={false}
            />
          )}
          
          {selectedLines.includes('socialSecurity') && (
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="socialSecurityImpact"
              name="With Social Security"
              stroke="#9333ea"
              fill="url(#socialSecurityGradient)"
              strokeWidth={2}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};