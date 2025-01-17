export interface UnitConfiguration {
    id: string;
    width: number;
    depth: number;
    numberOfUnits: number;
    monthlyRentPerUnit: number;
  }
  
  export interface CalculatorInputs {
    facilityName: string;
    askingPrice: number;
    moneyDown: number;
    loanAmount: number;
    interestRate: number;
    loanTerms: number;
    squareFootage: number;
    vacancyRate: number;
    monthlyExpenses: number;
    unitConfigurations: UnitConfiguration[];
  }
  
  export interface CalculatorResults {
    totalUnits: number;
    totalSquareFeet: number;
    capRate: number;
    monthlyGross: number;
    monthlyOverhead: number;
    monthlyNetCashFlow: number;
    annualGross: number;
    annualOverhead: number;
    annualNetCashFlow: number;
    monthlyLoanPayment: number;
    annualLoanPayment: number;
    unitAnalysis: UnitAnalysis[];
  }
  
  export interface UnitAnalysis {
    unitType: string;
    numberOfUnits: number;
    totalSquareFeet: number;
    rentPerUnit: number;
    rentPerSquareFoot: number;
    monthlyRent: number;
  }