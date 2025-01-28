import React from 'react';
import { TrendingUp } from 'lucide-react';
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

interface BoomerWageGrowthProps {
  currentIncome: number;
  currentAge: number;
  selectedEra: 'early' | 'core' | 'late';
}

// Career stage growth rates by era
const CAREER_STAGE_GROWTH = {
  early: {  // Early Boomers (1970-2000)
    earlyCareer: 0.12,   // Years 1-10: Rapid growth phase
    midCareer: 0.06,     // Years 11-20: Established career
    lateCareer: 0.03     // Years 21-30: Peak career
  },
  core: {   // Core Boomers (1977-2007)
    earlyCareer: 0.10,
    midCareer: 0.05,
    lateCareer: 0.025
  },
  late: {   // Late Boomers (1988-2018)
    earlyCareer: 0.08,
    midCareer: 0.04,
    lateCareer: 0.02
  }
};

const BoomerWageGrowth: React.FC<BoomerWageGrowthProps> = ({ currentIncome, currentAge, selectedEra }) => {
  const calculateWageGrowth = () => {
    const data = [];
    let currentSalary = currentIncome;
    const growthRates = CAREER_STAGE_GROWTH[selectedEra];

    for (let year = 0; year <= 30; year++) {
      // Determine career stage and growth rate
      let growthRate;
      let stage;
      
      if (year <= 10) {
        growthRate = growthRates.earlyCareer;
        stage = 'Early Career';
      } else if (year <= 20) {
        growthRate = growthRates.midCareer;
        stage = 'Mid Career';
      } else {
        growthRate = growthRates.lateCareer;
        stage = 'Late Career';
      }

      data.push({
        age: currentAge + year,
        projectedIncome: Math.round(currentSalary),
        stage,
        growthRate: (growthRate * 100).toFixed(1)
      });

      currentSalary *= (1 + growthRate);
    }

    return data;
  };

  const chartData = calculateWageGrowth();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-900">Age {label}</p>
        <div className="space-y-2 mt-2">
          <p className="text-sm">
            <span className="inline-block w-4 h-4 rounded mr-2" 
              style={{ backgroundColor: '#059669', opacity: 0.3 }} 
            />
            Salary: ${data.projectedIncome.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            Stage: {data.stage}
          </p>
          <p className="text-sm text-gray-600">
            Growth Rate: {data.growthRate}%
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Career Wage Growth
        </h2>

        <div className="h-[400px] w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0">
          <ResponsiveContainer>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="wageGrowthGradient" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="projectedIncome"
                stroke="#059669"
                fill="url(#wageGrowthGradient)"
                strokeWidth={2}
                name="Projected Income"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <CollapsibleInfo title="Learn More About Career Growth">
        <div className="space-y-4 text-gray-700">
          <section>
            <h4 className="font-semibold text-gray-900 mb-2">Career Stages</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-emerald-50 rounded-lg border border-emerald-100">
                <h5 className="font-medium mb-2">Early Career (Years 1-10)</h5>
                <p className="text-sm">Rapid growth phase with highest percentage increases as skills develop</p>
                <p className="text-sm font-medium mt-2">Growth Rate: {(CAREER_STAGE_GROWTH[selectedEra].earlyCareer * 100).toFixed(1)}%</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-100">
                <h5 className="font-medium mb-2">Mid Career (Years 11-20)</h5>
                <p className="text-sm">Moderate but steady growth as skills mature</p>
                <p className="text-sm font-medium mt-2">Growth Rate: {(CAREER_STAGE_GROWTH[selectedEra].midCareer * 100).toFixed(1)}%</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-100">
                <h5 className="font-medium mb-2">Late Career (Years 21-30)</h5>
                <p className="text-sm">Slower growth rate at career peak</p>
                <p className="text-sm font-medium mt-2">Growth Rate: {(CAREER_STAGE_GROWTH[selectedEra].lateCareer * 100).toFixed(1)}%</p>
              </div>
            </div>
          </section>

          <section>
            <h4 className="font-semibold text-gray-900 mb-2">Historical Context</h4>
            <p>During the {selectedEra} Boomer period ({selectedEra === 'early' ? '1970s' : selectedEra === 'core' ? '1980s' : '1990s'}), career progression was characterized by:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Strong company loyalty with internal promotion paths</li>
              <li>Regular cost-of-living adjustments</li>
              <li>Merit-based raises every 1-2 years</li>
              <li>Pension plans rewarding long-term employment</li>
            </ul>
          </section>
        </div>
      </CollapsibleInfo>
    </div>
  );
};

export default BoomerWageGrowth;