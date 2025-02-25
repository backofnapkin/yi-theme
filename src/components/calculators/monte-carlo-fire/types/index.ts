export interface Asset {
  name: string;
  percentage: number; // 0-100
  expectedReturn: number; // Annual % return
  volatility: number; // Annual % volatility
}

export interface FinancialInputs {
  currentAge: number;
  retirementAge: number;
  retirementLength: number;
  currentInvestments: number;
  monthlyInvestments: number;
  retirementAnnualSpend: number;
  assetAllocation: Asset[];
  inflationRate: number;
  taxRate: number; // % tax on withdrawals
  investmentFees: number; // % annual fees
  simulationCount: number;
  rebalancingFrequency: "none" | "annual" | "quarterly";
}

export interface PercentilePathPoint {
  year: number;
  portfolioValue: number;
  isFailed?: boolean;
}

export interface SimulationResults {
  percentilePaths: {
    p95: PercentilePathPoint[];
    p75: PercentilePathPoint[];
    p50: PercentilePathPoint[];
    p25: PercentilePathPoint[];
    p05: PercentilePathPoint[];
    failed: PercentilePathPoint[];
  };
  metrics: {
    successRate: number;
    medianEndingBalance: number;
    traditional4PercentRule: { successRate: number; medianEndingBalance: number };
  };
}