import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RevenueChartProps {
  trueFansRevenue: number;
  superFansRevenue: number[];
  superFansNames: string[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  trueFansRevenue,
  superFansRevenue,
  superFansNames,
}) => {
  // Using emerald color variations for the chart
  const colors = ['#059669', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];
  
  const data = [
    { name: 'True Fans Revenue', value: trueFansRevenue },
    ...superFansRevenue.map((revenue, index) => ({
      name: superFansNames[index] || `Revenue Stream ${index + 1}`,
      value: revenue,
    })),
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const formatTooltip = (value: number) => {
    const percentage = ((value / total) * 100).toFixed(1);
    return [`$${value.toLocaleString()}`, `${percentage}%`];
  };

  // Custom label renderer that only shows on larger screens
  const renderLabel = ({ name, value, percent }: any) => {
    // Only show label if segment is significant enough
    if (percent < 0.05) return null;
    return `${((percent || 0) * 100).toFixed(0)}%`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-skin-base">Revenue Distribution</h3>
      <div className="h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              label={renderLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={formatTooltip}
              contentStyle={{
                background: 'white',
                border: '2px solid #10b981',
                borderRadius: '8px',
                padding: '8px'
              }}
            />
            <Legend 
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '12px'
              }}
              formatter={(value, entry) => {
                const dataEntry = data.find(item => item.name === value);
                if (dataEntry) {
                  const percentage = ((dataEntry.value / total) * 100).toFixed(1);
                  return `${value} (${percentage}%)`;
                }
                return value;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};