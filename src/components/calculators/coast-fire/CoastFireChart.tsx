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
import type { ChartData } from './types';
import { formatMoney } from './utils';

interface CoastFireChartProps {
  data: ChartData[];
  selectedLines: string[];
  onLineToggle: (line: string) => void;
  showAdvancedFields: boolean;
}

export const CoastFireChart: React.FC<CoastFireChartProps> = ({
  data,
  selectedLines,
  onLineToggle,
  showAdvancedFields
}) => {
  const formatYAxis = (value: number) => {
    if (value === 0) return '';
    return `$${formatMoney(value).replace('$', '')}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
      <div
        style={{
          backgroundColor: 'rgb(251, 251, 251)',
          border: '1px solid rgb(104, 157, 106)',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          position: 'absolute',
          left: '20px',
          top: '20px',
          zIndex: 50,
          width: '16rem',
          maxWidth: 'calc(100vw - 32px)',
          pointerEvents: 'none'
        }}
      >
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

  const renderLegend = (props: any) => {
    const legendItems = [
      { id: 'coastFire', name: 'Coast FIRE Number', dataKey: 'coastFireNetWorth', color: '#2563eb', style: 'solid' },
      { id: 'currentPath', name: 'With Continued Monthly Contributions', dataKey: 'currentPathNetWorth', color: '#059669', style: 'solid' },
      { id: 'noContributionsAfterCoast', name: 'No Contributions After Coast FIRE', dataKey: 'noContributionsAfterCoastNetWorth', color: '#10b981', style: 'dashed' },
      { id: 'fullFire', name: 'Full FIRE Number', dataKey: 'fullFireNumber', color: '#dc2626', style: 'solid' },
      ...(showAdvancedFields ? [{ id: 'socialSecurity', name: 'With Social Security', dataKey: 'socialSecurityImpact', color: '#9333ea', style: 'solid' }] : [])
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
              <div
                className="inline-block w-8 h-2 mr-2"
                style={{ 
                  backgroundColor: item.style === 'dashed' ? 'transparent' : item.color,
                  borderStyle: item.style === 'dashed' ? 'dashed' : 'none',
                  borderWidth: item.style === 'dashed' ? '2px' : '0',
                  borderColor: item.color
                }}
              />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-[700px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="coastFireGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="currentPathGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#059669" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="noContributionsAfterCoastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="socialSecurityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#9333ea" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeWidth={2} />
          <XAxis
            dataKey="age"
            stroke="#6B7280"
            tick={{ fill: '#6B7280' }}
            tickLine={{ stroke: '#6B7280' }}
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
              fontSize: 12
            }}
            width={1}
            tickSize={0}
            domain={[0, 'auto']}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
          
          {selectedLines.includes('coastFire') && (
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="coastFireNetWorth"
              name="Coast FIRE Number"
              stroke="#2563eb"
              fill="url(#coastFireGradient)"
              strokeWidth={2}
            />
          )}
          
          {selectedLines.includes('currentPath') && (
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="currentPathNetWorth"
              name="With Continued Monthly Contributions"
              stroke="#059669"
              fill="url(#currentPathGradient)"
              strokeWidth={2}
            />
          )}
          
          {selectedLines.includes('noContributionsAfterCoast') && (
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="noContributionsAfterCoastNetWorth"
              name="No Contributions After Coast FIRE"
              stroke="#10b981"
              fill="url(#noContributionsAfterCoastGradient)"
              strokeWidth={2}
              strokeDasharray="5 5"
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
          
          {selectedLines.includes('socialSecurity') && showAdvancedFields && (
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