export interface TruckFinancing {
    truckPrice: number;
    downPayment: number;
    interestRate: number;
    loanTerm: number;
  }
  
  export interface TowTruckBusinessData {
    companyName: string;
    numTrucks: number;
    truckFinancing: TruckFinancing[];
    operatingDays: number;
    towsPerDay: number;
    feePerTow: number;
    fuelCostPerGallon: number;
    milesPerGallon: number;
    monthlyInsurance: number;
    monthlyMaintenance: number;
    monthlyBrokerFees: number;
    monthlyLaborCosts: number;
    customExpenses: Array<{ name: string; amount: number }>;
    monthlyGrowthRate: number;
  }
  
  export interface CashFlowData {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }
  
  export interface ExpenseBreakdown {
    name: string;
    amount: number;
    percentage: number;
    color: string;
  }
  
  export interface CalculationResults {
    monthlyRevenue: number;
    yearlyRevenue: number;
    monthlyExpenses: number;
    yearlyExpenses: number;
    monthlyProfit: number;
    yearlyProfit: number;
    requiredTowsPerMonth: number;
    expenseBreakdown: ExpenseBreakdown[];
    cashFlow: {
      oneYear: CashFlowData[];
      threeYears: CashFlowData[];
      fiveYears: CashFlowData[];
    };
  }
  
  export type ProjectionPeriod = '1year' | '3years' | '5years';