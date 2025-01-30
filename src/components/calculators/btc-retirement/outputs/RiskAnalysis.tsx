import React, { useMemo } from 'react';
import { Info, TrendingUp, Activity, LineChart, Shield } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';

interface NetworkMetrics {
  hashRateGrowth: number;
  activeAddressesGrowth: number;
  transactionVolumeGrowth: number;
}

interface MacroFactors {
  inflation: number;
  gdpGrowth: number;
  goldCorrelation: number;
  stockCorrelation: number;
}

const RiskAnalysis = () => {
  // Sample data - replace with actual data from your state management
  const networkMetrics: NetworkMetrics = {
    hashRateGrowth: 15,
    activeAddressesGrowth: 20,
    transactionVolumeGrowth: 10
  };

  const macroFactors: MacroFactors = {
    inflation: 3,
    gdpGrowth: 2,
    goldCorrelation: -15,
    stockCorrelation: 25
  };

  const calculateNetworkEffect = (metrics: NetworkMetrics) => {
    const weightedAverage = 
      (metrics.hashRateGrowth * 0.4) +
      (metrics.activeAddressesGrowth * 0.4) +
      (metrics.transactionVolumeGrowth * 0.2);
    
    return 1 + (0.1 * (weightedAverage / 100));
  };

  const calculateMacroImpact = (factors: MacroFactors) => {
    return 1 + (
      (factors.inflation / 100 * 0.3) +
      (factors.gdpGrowth / 100 * 0.2) +
      (factors.goldCorrelation / 100 * 0.15) +
      (factors.stockCorrelation / 100 * 0.35)
    );
  };

  const networkEffectMultiplier = useMemo(() => calculateNetworkEffect(networkMetrics), [networkMetrics]);
  const macroImpactMultiplier = useMemo(() => calculateMacroImpact(macroFactors), [macroFactors]);

  const MetricCard = ({ title, value, description, icon: Icon, color, tooltip, className = '' }: {
    title: string;
    value: string;
    description: string;
    icon: React.ElementType;
    color: string;
    tooltip: string;
    className?: string;
  }) => (
    <div className={`bg-white p-6 rounded-lg border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          <Icon className={`h-5 w-5 ${color}`} />
          <Tooltip content={tooltip}>
            <div className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
              <Info size={16} />
            </div>
          </Tooltip>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <h2 className="text-xl font-semibold">Risk Analysis</h2>
        <Tooltip content="Comprehensive analysis of network metrics, market conditions, and volatility factors">
          <div className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
            <Info size={16} />
          </div>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title="Network Effect Multiplier"
          value={`${(networkEffectMultiplier * 100 - 100).toFixed(2)}%`}
          description="Impact of network growth on projections"
          icon={TrendingUp}
          color="text-blue-500"
          tooltip={`
            Weighted impact of key network metrics:
            • Hash Rate Growth (40%): ${networkMetrics.hashRateGrowth}%
            • Active Addresses (40%): ${networkMetrics.activeAddressesGrowth}%
            • Transaction Volume (20%): ${networkMetrics.transactionVolumeGrowth}%
            
            These metrics indicate network security, adoption, and usage.
          `}
        />

        <MetricCard
          title="Macro Factor Impact"
          value={`${(macroImpactMultiplier * 100 - 100).toFixed(2)}%`}
          description="Economic conditions adjustment"
          icon={Activity}
          color="text-green-500"
          tooltip={`
            Economic factors affecting Bitcoin value:
            • Inflation (30%): ${macroFactors.inflation}%
            • GDP Growth (20%): ${macroFactors.gdpGrowth}%
            • Gold Correlation (15%): ${macroFactors.goldCorrelation}%
            • Stock Market Correlation (35%): ${macroFactors.stockCorrelation}%
            
            These factors reflect Bitcoin's relationship with traditional markets.
          `}
        />

        <MetricCard
          title="Volatility Impact"
          value="Historical Cycles"
          description={`Bull: +180% (1.5yr)
            Bear: -60% (1yr)
            Consolidation: +20% (2yr)`}
          icon={LineChart}
          color="text-red-500"
          className="bg-skin-red-light"
          tooltip={`
            Historical market cycle analysis:
            • Bull Markets: +180% avg. return over 1.5 years (25% frequency)
            • Bear Markets: -60% avg. return over 1 year (25% frequency)
            • Consolidation: +20% avg. return over 2 years (50% frequency)
            
            These patterns help model potential future volatility.
          `}
        />

        <MetricCard
          title="Risk-Adjusted Projections"
          value={`${((networkEffectMultiplier * macroImpactMultiplier * 100) - 100).toFixed(2)}%`}
          description="Combined risk factors impact"
          icon={Shield}
          color="text-purple-500"
          className="bg-skin-red-light"
          tooltip={`
            Final projection adjustment combining:
            • Network Effect: ${(networkEffectMultiplier * 100 - 100).toFixed(2)}%
            • Macro Impact: ${(macroImpactMultiplier * 100 - 100).toFixed(2)}%
            • Volatility Patterns
            
            This provides a balanced view of potential returns considering all risk factors.
          `}
        />
      </div>
    </div>
  );
};

export default RiskAnalysis;