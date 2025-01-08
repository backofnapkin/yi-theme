export interface GolferProfile {
    type: string;
    odds: number;
    description: string;
  }
  
  export interface CalculatorInputs {
    prizeAmount: number;
    golferProfile: GolferProfile;
    numberOfBalls: number;
    pricePerAttempt: number;
    monthlyCustomers: number;
    hasRevenueSplit: boolean;
    revenueSplitPercentage: number;
  }
  
  export interface CalculatorResults {
    winProbability: number;
    projectedAnnualPayouts: number;
    totalPrizePayouts: number;
    annualRevenue: number;
    monthlyRevenue: number;
    revenueSplitAmount: number;
    netRevenue: number;
  }