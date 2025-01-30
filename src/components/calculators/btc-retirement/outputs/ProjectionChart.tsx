import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ProjectionChartProps {
  showVolatility: boolean;
  showBtcPrice: boolean;
  currentAge: number;
  lifeExpectancy: number;
  retirementAge: number;
  btcPrice: number;
  growthRate: number;
}

const ProjectionChart: React.FC<ProjectionChartProps> = ({
  showVolatility,
  showBtcPrice,
  currentAge,
  lifeExpectancy,
  retirementAge,
  btcPrice,
  growthRate,
}) => {
  // Generate data points from current age to life expectancy
  const data = useMemo(() => {
    const results = [];
    let currentPrice = btcPrice;
    let totalBtc = 0; // Track total BTC holdings
    const yearsToProject = lifeExpectancy - currentAge;
    const annualBtcPurchase = 6000 / btcPrice; // Convert USD to BTC at current price
    
    for (let year = 0; year <= yearsToProject; year++) {
      const age = currentAge + year;
      const isRetired = age >= retirementAge;
      
      // Update BTC holdings
      if (!isRetired) {
        // Before retirement: Add annual BTC purchase
        totalBtc += annualBtcPurchase;
      } else {
        // After retirement: Sell BTC for annual spending
        const btcToSell = 100000 / currentPrice; // Convert annual spend to BTC at current price
        totalBtc -= btcToSell;
      }

      // Calculate portfolio value
      const portfolioValue = totalBtc * currentPrice;

      // Calculate volatile portfolio value if enabled
      const volatileValue = showVolatility
        ? portfolioValue * (0.7 + Math.random() * 0.6) // Add ±30% volatility
        : null;

      results.push({
        age,
        btcPrice: Math.round(currentPrice),
        portfolioValue: Math.round(portfolioValue),
        volatilePortfolioValue: volatileValue ? Math.round(volatileValue) : null,
        totalBtc: totalBtc, // Add this for debugging
        isRetired, // Add this for debugging
      });

      // Increase BTC price by growth rate for next year
      currentPrice *= (1 + growthRate / 100);
    }

    return results;
  }, [currentAge, lifeExpectancy, retirementAge, btcPrice, growthRate, showVolatility]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    const dataPoint = payload[0]?.payload;

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-900">Age {label}</p>
        <div className="space-y-1 mt-2">
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm">
              <span 
                className="inline-block w-4 h-4 rounded mr-2" 
                style={{ backgroundColor: entry.color, opacity: 0.3 }} 
              />
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
          <p className="text-xs text-gray-500 mt-1">
            BTC Holdings: ₿{dataPoint.totalBtc.toFixed(8)}
          </p>
          {dataPoint.isRetired && (
            <p className="text-xs text-emerald-600">
              Retirement Phase: -$100,000/year
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow-sm">
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#059669" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="btcPriceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="volatileGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#DC2626" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="age"
            stroke="#6B7280"
            tick={{ fill: '#6B7280' }}
            tickLine={{ stroke: '#6B7280' }}
          />
          <YAxis 
            hide={true}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top"
            height={36}
          />
          {/* Portfolio Value (always shown, in emerald) */}
          <Area
            type="monotone"
            dataKey="portfolioValue"
            name="Portfolio Value"
            stroke="#059669"
            fill="url(#portfolioGradient)"
            strokeWidth={2}
          />
          {/* BTC Price (optional, in blue) */}
          {showBtcPrice && (
            <Area
              type="monotone"
              dataKey="btcPrice"
              name="BTC Price"
              stroke="#2563EB"
              fill="url(#btcPriceGradient)"
              strokeWidth={2}
            />
          )}
          {/* Volatility (optional, in red) */}
          {showVolatility && (
            <Area
              type="monotone"
              dataKey="volatilePortfolioValue"
              name="Portfolio with Volatility"
              stroke="#DC2626"
              fill="url(#volatileGradient)"
              strokeWidth={2}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectionChart;