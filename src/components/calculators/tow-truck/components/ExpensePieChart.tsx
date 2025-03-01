import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { ExpenseBreakdown } from '../types';

interface ExpensePieChartProps {
  data: ExpenseBreakdown[];
  customTooltip?: React.ComponentType<any>; // Optional prop for custom tooltip
}

const DefaultTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
        <p className="font-semibold text-gray-900">{data.name}</p>
        <p className="text-gray-600">
          Amount: <span className="font-medium">${Math.round(data.amount).toLocaleString()}</span>
        </p>
        <p className="text-gray-600">
          Percentage: <span className="font-medium">{data.percentage.toFixed(1)}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export function ExpensePieChart({ data, customTooltip }: ExpensePieChartProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [chartHeight, setChartHeight] = useState(400);
  const [chartWidth, setChartWidth] = useState('100%');

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setChartHeight(mobile ? 300 : 400);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sort data by amount in descending order for better visualization
  const sortedData = [...data].sort((a, b) => b.amount - a.amount);

  return (
    <div 
      className="chart-container relative"
      style={{
        height: chartHeight,
        width: chartWidth,
        minWidth: isMobile ? '300px' : 'auto',
        position: 'relative'
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            {data.map((entry, index) => (
              <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={entry.color} stopOpacity={0.8}/>
                <stop offset="100%" stopColor={entry.color} stopOpacity={0.5}/>
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={sortedData}
            cx="50%"
            cy="50%"
            innerRadius={isMobile ? 60 : 80}
            outerRadius={isMobile ? 110 : 160}
            paddingAngle={2}
            dataKey="amount"
            labelLine={false}
            label={false}
            animationDuration={1000}
            animationEasing="ease-out"
            isAnimationActive={true}
          >
            {sortedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#gradient-${data.findIndex(d => d.name === entry.name)})`}
                stroke={entry.color}
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip content={customTooltip || DefaultTooltip} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}