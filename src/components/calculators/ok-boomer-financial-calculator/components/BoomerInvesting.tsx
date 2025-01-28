import React from 'react';
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
import InfoButton from '../components/InfoButton';
import CollapsibleInfo from './CollapsibleInfo';

interface BoomerInvestingProps {
  currentAge: number;
  selectedEra: 'early' | 'core' | 'late';
  initialInvestment: number;
  monthlyContribution: number;
  allocation: {
    stocks: number;
    savingsAccount: number;
    savingsBonds: number;
  };
}

const returns = {
  early: {
    stocks: 0.1336,
    savingsAccount: 0.0454,
    savingsBonds: 0.0678
  },
  core: {
    stocks: 0.1267,
    savingsAccount: 0.0375,
    savingsBonds: 0.0627
  },
  late: {
    stocks: 0.1107,
    savingsAccount: 0.0162,
    savingsBonds: 0.0315
  }
};

const BoomerInvesting: React.FC<BoomerInvestingProps> = ({
  currentAge,
  selectedEra,
  initialInvestment,
  monthlyContribution,
  allocation
}) => {
  const chartData = Array.from({ length: 31 }, (_, i) => {
    const yearlyContribution = monthlyContribution * 12;
    return {
      age: currentAge + i,
      stocks: Math.round((initialInvestment * (allocation.stocks / 100) + yearlyContribution * (allocation.stocks / 100)) * Math.pow(1 + returns[selectedEra].stocks, i)),
      savingsAccount: Math.round((initialInvestment * (allocation.savingsAccount / 100) + yearlyContribution * (allocation.savingsAccount / 100)) * Math.pow(1 + returns[selectedEra].savingsAccount, i)),
      savingsBonds: Math.round((initialInvestment * (allocation.savingsBonds / 100) + yearlyContribution * (allocation.savingsBonds / 100)) * Math.pow(1 + returns[selectedEra].savingsBonds, i))
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-900">Age {label}</p>
        <div className="space-y-1 mt-2">
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm">
              <span className="inline-block w-4 h-4 rounded mr-2" 
                style={{ backgroundColor: entry.color, opacity: 0.3 }} 
              />
              {entry.name}: ${entry.value.toLocaleString()}
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
          <LineChart className="w-6 h-6 text-purple-600" />
          Boomer Investing Returns
        </h2>

        <div className="h-[400px] w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0">
          <ResponsiveContainer>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="stocksGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="bondsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.05}/>
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
                dataKey="stocks"
                stroke="#059669"
                fill="url(#stocksGradient)"
                strokeWidth={2}
                name="Stocks"
              />
              <Area
                type="monotone"
                dataKey="savingsAccount"
                stroke="#DC2626"
                fill="url(#savingsGradient)"
                strokeWidth={2}
                name="Savings Account"
              />
              <Area
                type="monotone"
                dataKey="savingsBonds"
                stroke="#2563EB"
                fill="url(#bondsGradient)"
                strokeWidth={2}
                name="Savings Bonds"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <CollapsibleInfo title="Learn More About Investment Returns">
        <div className="space-y-4 text-gray-700">
          <section>
            <h4 className="font-semibold text-gray-900 mb-2">Investment Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-emerald-50 rounded-lg border border-emerald-100">
                <h5 className="font-medium mb-2">Stocks (S&P 500)</h5>
                <p className="text-sm">Historical annual return: {(returns[selectedEra].stocks * 100).toFixed(1)}%</p>
                <p className="text-sm mt-2">Highest risk, highest potential return</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-100">
                <h5 className="font-medium mb-2">Savings Account</h5>
                <p className="text-sm">Historical interest rate: {(returns[selectedEra].savingsAccount * 100).toFixed(1)}%</p>
                <p className="text-sm mt-2">Lowest risk, FDIC insured</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-100">
                <h5 className="font-medium mb-2">Savings Bonds</h5>
                <p className="text-sm">Historical yield: {(returns[selectedEra].savingsBonds * 100).toFixed(1)}%</p>
                <p className="text-sm mt-2">Government backed, tax advantages</p>
              </div>
            </div>
          </section>

          <section>
            <h4 className="font-semibold text-gray-900 mb-2">Investment Climate</h4>
            <p>The {selectedEra} Boomer period ({selectedEra === 'early' ? '1970s' : selectedEra === 'core' ? '1980s' : '1990s'}) was characterized by:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>High interest rates on savings accounts and bonds</li>
              <li>Strong stock market performance</li>
              <li>Simpler investment options with less complexity</li>
              <li>Growing adoption of 401(k) plans</li>
            </ul>
          </section>
        </div>
      </CollapsibleInfo>
    </div>
  );
};

export default BoomerInvesting;