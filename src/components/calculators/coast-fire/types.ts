export interface CoastFireInputs {
  currentAge: number;
  retirementAge: number;
  annualSpending: number;
  currentInvestedAssets: number;
  monthlyContributions: number;
  investmentGrowthRate: number;
  inflationRate: number;
  safeWithdrawalRate: number;
  advancedOptions?: {
    monthlySocialSecurity: number;
    socialSecurityStartAge: number;
  };
}

export interface CoastFireResults {
  targetFireNumber: number;
  futureValueCurrentInvestments: number;
  coastFireNumber: number;
  additionalNeeded: number;
  progressPercentage: number;
  timelineData: TimelineDataPoint[];
  currentInvestedAssets: number; // Add this to support the new progress bar
}

export interface TimelineDataPoint {
  age: number;
  withContributions: number;
  withoutContributions: number;
  coastFireNumber: number;
  fireNumber: number;
  withSocialSecurity?: number;
}