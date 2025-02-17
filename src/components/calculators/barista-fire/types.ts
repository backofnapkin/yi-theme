export interface CalculatorState {
  currentAge: number;
  endAge: number;
  annualIncomeAfterTax: number;
  currentAnnualSpending: number;
  currentInvestedAssets: number;
  baristaFireAge: number;
  retirementAnnualSpending: number;
  monthlyBaristaIncome: number;
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
  baristaFireNetWorth: number;
  currentJobNetWorth: number;
  fullFireNumber: number;
  socialSecurityImpact: number | undefined;
}

export interface Message {
  type: 'success' | 'warning' | 'action' | 'info' | 'opportunity';
  priority: number;
  message: string;
}