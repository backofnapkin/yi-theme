import React from 'react';
import { Home } from 'lucide-react';
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
import InfoButton from '../components/InfoButton';
import CollapsibleInfo from './CollapsibleInfo';

interface BoomerHomeValueProps {
  homeValue: number;
  selectedEra: 'early' | 'core' | 'late';
  currentAge: number;
}

const appreciationRates = {
  early: 0.0754,
  core: 0.0671,
  late: 0.0530
};

const BoomerHomeValue: React.FC<BoomerHomeValueProps> = ({ homeValue, selectedEra, currentAge }) => {
  const chartData = Array.from({ length: 31 }, (_, i) => ({
    age: currentAge + i,
    projectedValue: Math.round(homeValue * Math.pow(1 + appreciationRates[selectedEra], i))
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
                style={{ backgroundColor: '#059669', opacity: 0.3 }} 
              />
              Home Value: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Home className="w-6 h-6 text-indigo-600" />
          Boomer Home Value Projection
        </h2>

        <div className="h-[400px] w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0">
          <ResponsiveContainer>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="homeValueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="age"
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
                tickLine={{ stroke: '#6B7280' }}
              />
              <YAxis hide={true} />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top"
                height={36}
              />
              <Area
                type="monotone"
                dataKey="projectedValue"
                stroke="#059669"
                fill="url(#homeValueGradient)"
                strokeWidth={2}
                name="Home Value"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <CollapsibleInfo title="Learn More About Home Values">
        <div className="space-y-4 text-gray-700">
          <section>
            <h4 className="font-semibold text-gray-900 mb-2">Appreciation Rates</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-emerald-50 rounded-lg border border-emerald-100">
                <h5 className="font-medium mb-2">Early Boomer (1970s)</h5>
                <p className="text-sm">Annual appreciation: {(appreciationRates.early * 100).toFixed(1)}%</p>
                <p className="text-sm mt-2">Post-war housing boom</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-100">
                <h5 className="font-medium mb-2">Core Boomer (1980s)</h5>
                <p className="text-sm">Annual appreciation: {(appreciationRates.core * 100).toFixed(1)}%</p>
                <p className="text-sm mt-2">Suburban expansion era</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-100">
                <h5 className="font-medium mb-2">Late Boomer (1990s)</h5>
                <p className="text-sm">Annual appreciation: {(appreciationRates.late * 100).toFixed(1)}%</p>
                <p className="text-sm mt-2">Pre-housing bubble growth</p>
              </div>
            </div>
          </section>

          <section>
            <h4 className="font-semibold text-gray-900 mb-2">Housing Market Factors</h4>
            <p>During the {selectedEra} Boomer period ({selectedEra === 'early' ? '1970s' : selectedEra === 'core' ? '1980s' : '1990s'}), home values were influenced by:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Strong economic growth and rising incomes</li>
              <li>Expanding suburban development</li>
              <li>Favorable mortgage terms and rates</li>
              <li>Growing middle-class homeownership</li>
            </ul>
          </section>
        </div>
      </CollapsibleInfo>
    </div>
  );
};

export default BoomerHomeValue;