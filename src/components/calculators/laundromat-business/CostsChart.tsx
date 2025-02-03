import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Info } from 'lucide-react';
import { Tooltip as UITooltip } from '../../ui/Tooltip';

interface CostsChartProps {
  costs: {
    utilities: number;
    rent: number;
    labor: number;
    maintenance: number;
    additional: { name: string; amount: number; }[];
  };
}

export const CostsChart: React.FC<CostsChartProps> = ({ costs }) => {
  // Using emerald color variations for the chart
  const colors = ['#059669', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];
  
  const data = [
    { name: 'Utilities', value: costs.utilities },
    { name: 'Rent', value: costs.rent },
    { name: 'Labor', value: costs.labor },
    { name: 'Maintenance', value: costs.maintenance },
    ...costs.additional.map(cost => ({
      name: cost.name,
      value: cost.amount,
    })),
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const formatTooltip = (value: number) => {
    const percentage = ((value / total) * 100).toFixed(1);
    return [`$${value.toLocaleString()}`, `${percentage}%`];
  };

  // Custom label renderer that only shows on larger segments
  const renderLabel = ({ name, value, percent }: any) => {
    // Only show label if segment is significant enough
    if (percent < 0.05) return null;
    return `${((percent || 0) * 100).toFixed(0)}%`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        Operating Costs Breakdown
        <UITooltip content="Visual breakdown of all operating costs as a percentage of total expenses">
          <Info className="w-4 h-4 text-gray-400" />
        </UITooltip>
      </h3>
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