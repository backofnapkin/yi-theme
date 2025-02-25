import React, { useEffect, useMemo, memo, useState, useRef } from 'react';
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { PercentilePathPoint, FinancialInputs, Asset } from '../types';
import { Save } from 'lucide-react';

interface MonteCarloPathsProps {
  data: {
    p95: PercentilePathPoint[];
    p75: PercentilePathPoint[];
    p50: PercentilePathPoint[];
    p25: PercentilePathPoint[];
    p05: PercentilePathPoint[];
    failed: PercentilePathPoint[];
  };
  inputs: {
    currentAge: number;
    retirementAge: number;
    retirementLength: number;
  };
  allInputs: FinancialInputs;
}

interface TooltipProps {
  content: string | React.ReactNode;
  children?: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const updateTooltipPosition = () => {
      if (!tooltipRef.current || !triggerRef.current) return;

      const tooltip = tooltipRef.current;
      const tooltipRect = tooltip.getBoundingClientRect();

      tooltip.style.left = '50%';
      tooltip.style.transform = 'translateX(-50%)';

      const updatedTooltipRect = tooltip.getBoundingClientRect();

      if (updatedTooltipRect.right > window.innerWidth) {
        const overflow = updatedTooltipRect.right - window.innerWidth;
        tooltip.style.left = `calc(50% - ${overflow + 8}px)`;
      }

      if (updatedTooltipRect.left < 0) {
        tooltip.style.left = `calc(50% - ${updatedTooltipRect.left - 8}px)`;
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', updateTooltipPosition);
    window.addEventListener('scroll', updateTooltipPosition);

    if (isOpen) {
      updateTooltipPosition();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updateTooltipPosition);
      window.removeEventListener('scroll', updateTooltipPosition);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block ml-2" ref={triggerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center cursor-pointer">
        <span className="text-gray-400 hover:text-gray-600">ⓘ</span>
      </div>
      {isOpen && (
        <div
          ref={tooltipRef}
          className="absolute z-50 w-64 p-4 mt-2 text-sm rounded-lg shadow-lg"
          style={{ 
            backgroundColor: 'rgb(251, 251, 251)',
            border: '1px solid rgb(104, 157, 106)',
            color: 'rgb(80, 73, 69)',
            transform: 'translateX(-50%)',
            left: '50%',
            maxWidth: 'calc(100vw - 32px)'
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

const formatCurrency = (value: number) => {
  if (value === 0) return '$0';
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const processChartData = (data: MonteCarloPathsProps['data']) => {
  const years = new Set<number>();
  Object.values(data).forEach(pathData => {
    pathData.forEach(point => years.add(point.year));
  });

  const sortedYears = Array.from(years).sort((a, b) => a - b);
  
  // Only count unique failures that have happened up to this year
  return sortedYears.map(year => {
    const failedCount = data.failed
      .filter(p => p.year <= year && p.isFailed)
      .length;
    
    return {
      year,
      p95: data.p95.find(p => p.year === year)?.portfolioValue ?? 0,
      p75: data.p75.find(p => p.year === year)?.portfolioValue ?? 0,
      p50: data.p50.find(p => p.year === year)?.portfolioValue ?? 0,
      p25: data.p25.find(p => p.year === year)?.portfolioValue ?? 0,
      p05: data.p05.find(p => p.year === year)?.portfolioValue ?? 0,
      failed: data.failed.find(p => p.year === year)?.portfolioValue ?? 0,
      failedCount
    };
  });
};

// Custom Legend component for better display
const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-2 pb-1">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-item-${index}`} className="flex items-center">
          <div 
            className="w-3 h-3 mr-2" 
            style={{ backgroundColor: entry.color }} 
          />
          <span className="text-sm font-medium text-gray-700">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const CustomTooltip = memo(({ active, payload, label, inputs, isMobile, tooltipWidth, allInputs }: any) => {
  if (!active || !payload || !payload.length) return null;

  const year = label;
  const dataPoint = payload[0].payload;
  const age = inputs.currentAge + year;
  const phase = age < inputs.retirementAge ? 'Accumulation' : 'Retirement';
  const failedCount = dataPoint.failedCount;
  const totalSimulations = allInputs.simulationCount;
  const failureRate = ((failedCount / totalSimulations) * 100).toFixed(1);

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
        width: tooltipWidth,
        maxWidth: 'calc(100vw - 32px)',
        pointerEvents: 'none',
        fontSize: isMobile ? '0.875rem' : '1rem'
      }}
    >
      <p className="font-medium text-gray-900 mb-2">Age {age} ({phase} Phase)</p>
      <div className="space-y-1">
        {[
          { key: 'p95', name: '95th Percentile', color: '#059669' },
          { key: 'p75', name: '75th Percentile', color: '#10b981' },
          { key: 'p50', name: 'Median', color: '#2563eb' },
          { key: 'p25', name: '25th Percentile', color: '#eab308' },
          { key: 'p05', name: '5th Percentile', color: '#f97316' }
        ].map(({ key, name, color }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3" style={{ backgroundColor: color }} />
              <span className="text-gray-600">{name}</span>
            </div>
            <span className="font-medium">{formatCurrency(dataPoint[key])}</span>
          </div>
        ))}
      </div>
      
      {failedCount > 0 && (
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center justify-between text-red-600">
            <span>Failed Scenarios</span>
            <span>{failedCount} ({failureRate}%)</span>
          </div>
        </div>
      )}
    </div>
  );
});

CustomTooltip.displayName = 'CustomTooltip';

const MonteCarloPaths: React.FC<MonteCarloPathsProps> = ({ data, inputs, allInputs }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const chartData = useMemo(() => {
    const maxAllowedYear = inputs.retirementAge - inputs.currentAge + inputs.retirementLength;
    return processChartData(data).filter(point => point.year <= maxAllowedYear);
  }, [data, inputs]);

  const { maxYear, lastYearData, scenarioCounts } = useMemo(() => {
    const lastPoint = chartData[chartData.length - 1];
    const totalSimulations = allInputs.simulationCount;
    const failedCount = lastPoint.failedCount;
    
    // Calculate the number of successful simulations
    const successfulSimulations = totalSimulations - failedCount;
    
    return {
      maxYear: lastPoint.year,
      lastYearData: {
        p95: lastPoint.p95,
        p75: lastPoint.p75,
        p50: lastPoint.p50,
        p25: lastPoint.p25,
        p05: lastPoint.p05,
      },
      scenarioCounts: {
        above95: Math.round(successfulSimulations * 0.05),
        above75: Math.round(successfulSimulations * 0.20),
        above50: Math.round(successfulSimulations * 0.25),
        above25: Math.round(successfulSimulations * 0.25),
        above05: Math.round(successfulSimulations * 0.20),
        belowFailed: failedCount
      }
    };
  }, [chartData, allInputs.simulationCount]);

  const retirementYear = inputs.retirementAge - inputs.currentAge;
  const formatXAxis = (year: number) => `Age ${inputs.currentAge + year}`;

  const handleSaveResults = () => {
    const today = new Date();
    const formattedDate = formatDate(today);
    
    const textContent = `FIRE Calculator Results
Generated on ${formattedDate}
Data provided by BackofNapkin.com

=== Personal Information ===
Current Age: ${allInputs.currentAge}
Retirement Age: ${allInputs.retirementAge}
Years in Retirement: ${allInputs.retirementLength}

=== Financial Information ===
Current Investments: ${formatCurrency(allInputs.currentInvestments)}
Monthly Investments: ${formatCurrency(allInputs.monthlyInvestments)}
Annual Retirement Spending: ${formatCurrency(allInputs.retirementAnnualSpend)}

=== Asset Allocation ===
${allInputs.assetAllocation.map((asset: Asset) => 
  `${asset.name}: ${asset.percentage}% (Expected Return: ${asset.expectedReturn}%, Volatility: ${asset.volatility}%)`
).join('\n')}

=== Additional Settings ===
Inflation Rate: ${allInputs.inflationRate}%
Tax Rate: ${allInputs.taxRate}%
Investment Fees: ${allInputs.investmentFees}%
Rebalancing: ${allInputs.rebalancingFrequency.charAt(0).toUpperCase() + allInputs.rebalancingFrequency.slice(1)}

=== Simulation Results ===
Number of Simulations: ${allInputs.simulationCount}
Success Rate: ${allInputs.simulationCount - scenarioCounts.belowFailed}/${allInputs.simulationCount} (${(((allInputs.simulationCount - scenarioCounts.belowFailed) / allInputs.simulationCount) * 100).toFixed(1)}%)
Failed Scenarios: ${scenarioCounts.belowFailed} (${((scenarioCounts.belowFailed / allInputs.simulationCount) * 100).toFixed(1)}%)

Portfolio Value Distribution at End of Retirement:
- 95th Percentile: ${formatCurrency(lastYearData.p95)}
- 75th Percentile: ${formatCurrency(lastYearData.p75)}
- Median (50th): ${formatCurrency(lastYearData.p50)}
- 25th Percentile: ${formatCurrency(lastYearData.p25)}
- 5th Percentile: ${formatCurrency(lastYearData.p05)}

=== Risk Analysis ===
Very Safe Scenarios (>95th percentile): ${scenarioCounts.above95} scenarios
Strong Performance (75th-95th): ${scenarioCounts.above75} scenarios
Average Performance (50th-75th): ${scenarioCounts.above50} scenarios
Below Average (25th-50th): ${scenarioCounts.above25} scenarios
Poor Performance (5th-25th): ${scenarioCounts.above05} scenarios
Failed Scenarios: ${scenarioCounts.belowFailed} scenarios

=== Important Notes ===
1. A scenario is considered "failed" when the portfolio value drops below $50,000
2. Success rate calculations assume maintaining your desired withdrawal rate
3. All values are adjusted for inflation
4. Tax implications are estimated based on provided tax rate
5. Results assume consistent rebalancing to maintain target asset allocation

This analysis is for informational purposes only and should not be considered financial advice.
Past performance does not guarantee future results. Please consult with a financial advisor
before making any investment decisions.`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fire-calculator-results-${today.toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Adjusted chart margins to better utilize space
  const chartMargins = useMemo(() => ({
    top: isMobile ? 5 : 10,
    right: isMobile ? 10 : 24, // Increased right margin
    left: isMobile ? -4 : -16, // Adjusted left margin
    bottom: isMobile ? 5 : 5
  }), [isMobile]);

  const yAxisWidth = isMobile ? 40 : 50;
  const fontSize = isMobile ? 10 : 12;
  const chartHeight = isMobile ? 400 : 700;

  interface DotProps {
    cx?: number;
    cy?: number;
    payload: { year: number };
  }

  const renderMedianDot = (props: DotProps): JSX.Element => {
    const { cx, cy, payload } = props;
    const isRetirementYear = payload.year === retirementYear;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={isRetirementYear ? 4 : 0}
        fill="#2563eb"
        stroke={isRetirementYear ? 'white' : 'none'}
        strokeWidth={isRetirementYear ? 2 : 0}
      />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-2 md:p-4 relative" style={{ overflow: 'hidden' }}>
      <h2 className="text-xl font-semibold mb-4 px-2">Monte Carlo Scenarios</h2>
      <div 
        className="chart-container relative"
        style={{
          height: chartHeight,
          width: 'calc(100% + 16px)', // Expand width by 16px
          minWidth: isMobile ? '300px' : 'auto',
          overflowX: isMobile ? 'auto' : 'visible',
          overflowY: 'hidden',
          marginLeft: '-8px', // Equal margins on both sides
          marginRight: '-8px',
          position: 'relative' // Ensure positioning context
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={chartMargins}
          >
            <defs>
              <linearGradient id="chartBackground" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F9FAFB" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.9} />
              </linearGradient>
              
              <linearGradient id="p95Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#059669" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="p75Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="p50Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="p25Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#eab308" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="p05Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.05}/>
              </linearGradient>
            </defs>

            <rect x="0" y="0" width="100%" height="100%" fill="url(#chartBackground)" />
            
            <CartesianGrid 
              strokeDasharray="4 4" 
              stroke="#D1D5DB" 
              strokeWidth={1} 
              opacity={0.5} 
            />
            
            <XAxis
              dataKey="year"
              type="number"
              domain={[0, maxYear]}
              tickFormatter={formatXAxis}
              stroke="#6B7280"
              tick={{ 
                fill: '#6B7280',
                fontSize: fontSize
              }}
              tickLine={{ stroke: '#6B7280' }}
            />
            
            <YAxis
              tickFormatter={formatCurrency}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
              tick={{ 
                dx: 5,
                textAnchor: "start",
                fontSize: fontSize,
                fill: '#6B7280'
              }}
              width={yAxisWidth}
              tickSize={0}
              domain={[0, 'auto']}
              allowDecimals={false}
              orientation="left"
            />
            
            <RechartsTooltip 
              content={
                <CustomTooltip 
                  inputs={inputs} 
                  allInputs={allInputs}
                  isMobile={isMobile}
                  tooltipWidth={isMobile ? '14rem' : '16rem'}
                />
              } 
            />

            {/* Custom Legend implementation */}
            <Legend 
              content={<CustomLegend />}
              wrapperStyle={{ 
                paddingTop: '10px',
                width: '100%' // Ensure full width
              }}
            />
            
            <ReferenceLine
              x={retirementYear}
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{
                value: `Retirement (Age ${inputs.retirementAge})`,
                position: isMobile ? 'insideTopRight' : 'insideTop',
                fill: '#10b981',
                fontSize: isMobile ? 10 : 12,
                offset: 20,
                style: {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: 500
                }
              }}
            />

            <Area
              type="monotone"
              dataKey="failed"
              name="Failed Scenarios"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.1}
              strokeOpacity={0.3}
              dot={false}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />

            <Area
              type="monotone"
              dataKey="p95"
              name="95th Percentile"
              stroke="#059669"
              fill="url(#p95Gradient)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />

            <Area
              type="monotone"
              dataKey="p75"
              name="75th Percentile"
              stroke="#10b981"
              fill="url(#p75Gradient)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />

            <Area
              type="monotone"
              dataKey="p50"
              name="Median"
              stroke="#2563eb"
              fill="url(#p50Gradient)"
              strokeWidth={3}
              dot={renderMedianDot}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />

            <Area
              type="monotone"
              dataKey="p25"
              name="25th Percentile"
              stroke="#eab308"
              fill="url(#p25Gradient)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />

            <Area
              type="monotone"
              dataKey="p05"
              name="5th Percentile"
              stroke="#f97316"
              fill="url(#p05Gradient)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 md:mt-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">Portfolio Value Thresholds</h3>
            <Tooltip content="These thresholds show how your portfolio value is distributed across different percentiles in the simulations." />
          </div>
          <button
            onClick={handleSaveResults}
            className="flex items-center px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Results
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-skin-emerald-text">95th Percentile</div>
              <Tooltip content="Only 5% of scenarios performed better than this level. This represents a highly optimistic outcome requiring consistently strong market performance." />
            </div>
            <div className="mt-1">Above {formatCurrency(lastYearData.p95)}</div>
            <div className="text-sm text-emerald-600 mt-2">
              {scenarioCounts.above95} scenarios exceeded this threshold
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-emerald-600">75th Percentile</div>
              <Tooltip content="25% of scenarios performed better than this level. This represents strong market performance with some periods of volatility." />
            </div>
            <div className="mt-1">Above {formatCurrency(lastYearData.p75)}</div>
            <div className="text-sm text-green-600 mt-2">
              {scenarioCounts.above75} scenarios in this range
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <div className="font-semibold" style={{ color: '#2563eb' }}>Median (50th)</div>
              <Tooltip content="The middle outcome - half of scenarios performed better, half performed worse. This represents a balanced market performance over time." />
            </div>
            <div className="mt-1">Above {formatCurrency(lastYearData.p50)}</div>
            <div className="text-sm text-blue-600 mt-2">
              {scenarioCounts.above50} scenarios in this range
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-amber-600">25th Percentile</div>
              <Tooltip content="75% of scenarios performed better than this level." />
            </div>
            <div className="mt-1">Above {formatCurrency(lastYearData.p25)}</div>
            <div className="text-sm text-yellow-600 mt-2">
              {scenarioCounts.above25} scenarios in this range
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-orange-600">5th Percentile</div>
              <Tooltip content="95% of scenarios performed better than this level." />
            </div>
            <div className="mt-1">Above {formatCurrency(lastYearData.p05)}</div>
            <div className="text-sm text-orange-500 mt-2">
              {scenarioCounts.above05} scenarios in this range
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-skin-red-text">Failed</div>
              <Tooltip content="This is the number of scenarios that fell below $50,000 in value." />
            </div>
            <div className="mt-1">Below $50,000</div>
            <div className="text-sm text-red-600 mt-2">
              {scenarioCounts.belowFailed} scenarios failed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(MonteCarloPaths);