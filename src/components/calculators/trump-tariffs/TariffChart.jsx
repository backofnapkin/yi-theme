import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from './utils';

/**
 * Chart component to visualize before and after tariff expenses
 * 
 * @param {Array} chartData - Array of data objects for the chart
 * @returns {JSX.Element} - Recharts bar chart visualization
 */
const TariffChart = ({ chartData }) => {
  // Custom tooltip formatter to display only the hovered bar's name and value
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md text-left" 
             style={{ 
               backdropFilter: 'blur(4px)', 
               maxWidth: '250px', 
               backgroundColor: 'rgba(255, 255, 255, 0.95)',
               boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)'
             }}>
          <p className="text-sm font-semibold text-gray-900 mb-2 border-b pb-1">{label}</p>
          {payload.map((entry, index) => (
            <div 
              key={`tooltip-item-${index}`} 
              className="flex items-center mb-2 last:mb-0"
            >
              <div 
                className="w-3 h-3 rounded-full mr-2 flex-shrink-0 border border-white" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-bold text-gray-800">
                {entry.name}: {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom Y-axis tick formatter to display currency without decimals
  const formatYAxisTick = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate min and max values for a tighter Y-axis range
  const minValue = Math.min(...chartData.map(d => Math.min(d.Before, d['Low Tariff Impact'], d['High Tariff Impact'])));
  const maxValue = Math.max(...chartData.map(d => Math.max(d.Before, d['Low Tariff Impact'], d['High Tariff Impact'])));
  const difference = maxValue - minValue;
  const tighterPadding = difference * 0.05;

  // Custom Legend with more prominent styling
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 px-2">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center">
            <span
              className="inline-block w-3 h-3 mr-1 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span
              style={{ color: entry.color }}
              className="font-semibold text-sm"
            >
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="h-64 w-full mb-6" aria-label="Chart comparing expenses before and after tariffs">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" />
          <YAxis
            tickFormatter={formatYAxisTick}
            domain={[minValue - tighterPadding, maxValue + tighterPadding]}
            tickCount={5}
          />
          <Tooltip 
            content={<CustomTooltip />}
            wrapperStyle={{ zIndex: 100, outline: "none" }}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            position={{ x: 'center', y: 'top' }}
          />
          <Legend content={renderLegend} />
          <Bar
            dataKey="Before"
            name="Before Tariffs"
            fill="#4299e1"
            aria-label="Expenses before tariffs"
            barSize={40}
            opacity={0.85}
          />
          <Bar
            dataKey="Low Tariff Impact"
            name="Low Tariff Impact"
            fill="#f56565"
            aria-label="Expenses with low tariff impact"
            barSize={40}
            opacity={0.9}
          />
          <Bar
            dataKey="High Tariff Impact"
            name="High Tariff Impact"
            fill="#e53e3e"
            aria-label="Expenses with high tariff impact"
            barSize={40}
            opacity={1}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TariffChart;