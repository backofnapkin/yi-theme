export interface CustomCost {
    name: string;
    amount: number;
  }
  
  export interface CalculatorState {
    businessName: string;
    // Startup Costs
    rollOffTrucks: number;
    rollOffTruckCost: number;
    dumpsterCount: number;
    dumpsterCost: number;
    rentalPricePerWeek: number;
    rentalsPerMonth: number;
    additionalStartupCosts: CustomCost[];
    
    // Operational Costs
    maintenanceCostPerYear: number;
    fullTimeDrivers: number;
    driverWagePerHour: number;
    fuelCostPerMonth: number;
    marketingCostsPerMonth: number;
    insuranceCostPerMonth: number;
    loanRepaymentPerMonth: number;
    softwareCostsPerMonth: number;
    additionalOperationalCosts: CustomCost[];
    
    // Additional Revenue
    junkRemovalRevenue: number;
    additionalServices: Array<{
      name: string;
      revenuePerMonth: number;
    }>;
  }
  
  export interface CalculationResults {
    monthly: {
      revenue: {
        dumpsterRentals: number;
        junkRemoval: number;
        additionalServices: Array<{
          name: string;
          amount: number;
        }>;
        total: number;
      };
      expenses: {
        maintenance: number;
        wages: number;
        fuel: number;
        marketing: number;
        insurance: number;
        loanPayment: number;
        software: number;
        total: number;
      };
      profit: number;
    };
    annual: {
      revenue: {
        dumpsterRentals: number;
        junkRemoval: number;
        additionalServices: Array<{
          name: string;
          amount: number;
        }>;
        total: number;
      };
      expenses: {
        maintenance: number;
        wages: number;
        fuel: number;
        marketing: number;
        insurance: number;
        loanPayment: number;
        software: number;
        total: number;
      };
      profit: number;
    };
    breakeven: {
      rentalsPerDumpster: number;
      monthsToBreakeven: number;
    };
    projections: Array<{
      year: number;
      revenue: {
        dumpsterRentals: number;
        junkRemoval: number;
        additionalServices: Array<{
          name: string;
          amount: number;
        }>;
        total: number;
      };
      expenses: {
        maintenance: number;
        wages: number;
        fuel: number;
        marketing: number;
        insurance: number;
        loanPayment: number;
        software: number;
        total: number;
      };
      profit: number;
      breakevenRentals: number;
    }>;
    roi: {
      paybackPeriodMonths: number;
      firstYearROI: number;
    };
  }