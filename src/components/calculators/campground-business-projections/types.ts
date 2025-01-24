export interface CampgroundData {
  campgroundName: string;
  initialPurchasePrice: number;
  downPaymentPercentage: number;
  interestRate: number;
  loanTerm: number;
  annualAppreciation: number;
  numberOfSites: number;
  monthlyRentPerSite: number;
  additionalServicesRevenue: number;
  occupancyRate: number;
  openMonthsPerYear: number;
  monthlyManagementFee: number;
  monthlyMaintenanceCosts: number;
  monthlyOperatingCosts: number;
}

export interface CalculationResults {
  totalInitialInvestment: number;
  monthlyLoanPayment: number;
  breakEvenOccupancy: number;
  monthlyGrossRevenue: number;
  annualGrossRevenue: number;
  monthlyTotalExpenses: number;
  annualTotalExpenses: number;
  annualNOI: number;
  cashOnCashReturn: number;
  propertyValueYear1: number;
  propertyValueYear5: number;
  propertyValueYear10: number;
  numberOfSites: number; // Added this field
}