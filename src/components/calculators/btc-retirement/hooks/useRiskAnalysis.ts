import { useMemo } from 'react';

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

interface VolatilityData {
  bullMarkets: {
    averageReturn: number;
    duration: number;
    frequency: number;
  };
  bearMarkets: {
    averageReturn: number;
    duration: number;
    frequency: number;
  };
  consolidation: {
    averageReturn: number;
    duration: number;
    frequency: number;
  };
}

export const useRiskAnalysis = (
  networkMetrics: NetworkMetrics,
  macroFactors: MacroFactors,
  useHistoricalVolatility: boolean = false,
  riskTolerance: 'conservative' | 'moderate' | 'aggressive' = 'moderate'
) => {
  const volatilityData: VolatilityData = {
    bullMarkets: {
      averageReturn: 180,
      duration: 1.5,
      frequency: 0.25
    },
    bearMarkets: {
      averageReturn: -60,
      duration: 1,
      frequency: 0.25
    },
    consolidation: {
      averageReturn: 20,
      duration: 2,
      frequency: 0.5
    }
  };

  const networkEffect = useMemo(() => {
    const weightedAverage = 
      (networkMetrics.hashRateGrowth * 0.4) +
      (networkMetrics.activeAddressesGrowth * 0.4) +
      (networkMetrics.transactionVolumeGrowth * 0.2);
    
    return 1 + (0.1 * (weightedAverage / 100));
  }, [networkMetrics]);

  const macroImpact = useMemo(() => {
    return 1 + (
      (macroFactors.inflation / 100 * 0.3) +
      (macroFactors.gdpGrowth / 100 * 0.2) +
      (macroFactors.goldCorrelation / 100 * 0.15) +
      (macroFactors.stockCorrelation / 100 * 0.35)
    );
  }, [macroFactors]);

  const volatilityMultiplier = useMemo(() => {
    if (!useHistoricalVolatility) return 1;

    const cycleReturn = (
      (volatilityData.bullMarkets.averageReturn * volatilityData.bullMarkets.frequency) +
      (volatilityData.bearMarkets.averageReturn * volatilityData.bearMarkets.frequency) +
      (volatilityData.consolidation.averageReturn * volatilityData.consolidation.frequency)
    );

    return 1 + (cycleReturn / 100 * 0.3);
  }, [useHistoricalVolatility]);

  const riskToleranceMultiplier = useMemo(() => {
    switch (riskTolerance) {
      case 'conservative':
        return 0.8;
      case 'aggressive':
        return 1.2;
      default:
        return 1.0;
    }
  }, [riskTolerance]);

  const finalMultiplier = useMemo(() => {
    return networkEffect * macroImpact * volatilityMultiplier * riskToleranceMultiplier;
  }, [networkEffect, macroImpact, volatilityMultiplier, riskToleranceMultiplier]);

  return {
    networkEffect,
    macroImpact,
    volatilityMultiplier,
    riskToleranceMultiplier,
    finalMultiplier,
    metrics: {
      networkMetrics,
      macroFactors,
      volatilityData
    }
  };
};

export default useRiskAnalysis;