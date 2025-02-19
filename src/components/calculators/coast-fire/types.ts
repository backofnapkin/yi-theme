export interface CalculatorState {
  currentAge: number;
  endAge: number;
  currentInvestedAssets: number;
  targetRetirementAge: number;
  retirementAnnualSpending: number;
  monthlyContributions: number;
  investmentGrowthRate: number;
  inflationRate: number;
  safeWithdrawalRate: number;
  showAdvancedFields: boolean;
  monthlySocialSecurity: number;
  socialSecurityAge: number;
  showExtendedChart: boolean;
  selectedChartLines: string[];
}

export interface ChartData {
  age: number;
  coastFireNetWorth: number;
  currentPathNetWorth: number;
  noContributionsAfterCoastNetWorth: number;
  fullFireNumber: number;
  socialSecurityImpact: number | undefined;
}

export interface Message {
  type: 'success' | 'warning' | 'action' | 'info' | 'opportunity';
  priority: number;
  message: string;
}