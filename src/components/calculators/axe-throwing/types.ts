export interface CustomExpense {
    id: string;
    name: string;
    amount: number;
  }
  
  export interface CalculatorInputs {
    businessName: string;
    leaseholdImprovements: number;
    laneSetupCost: number;
    numberOfLanes: number;
    numberOfAxes: number;
    costPerAxe: number;
    permitsAndLicenses: number;
    initialMarketing: number;
    walkInPrice: number;
    averageGroupSize: number;
    corporateEventPrice: number;
    monthlyCorpEvents: number;
    peakHours: number;
    peakUtilization: number;
    offPeakHours: number;
    offPeakUtilization: number;
    monthlyRent: number;
    monthlyInsurance: number;
    monthlyUtilities: number;
    monthlyWages: number;
    monthlyMarketing: number;
    maintenanceCostPerLane: number;
    customExpenses: CustomExpense[];
  }
  
  export interface CalculatorResults {
    totalStartupCosts: number;
    totalMonthlyCosts: number;
    totalMonthlyRevenue: number;
    netProfitMargin: number;
    breakEvenWeeks: number;
    monthlyCustomersNeeded: number;
    monthlyProfitPerLane: number;
    threeYearProjections: {
      monthly: number[];
      annual: number[];
    };
    scenarios: {
      conservative: number;
      optimistic: number;
    };
  }