export type IncomeType = 'annual' | 'hourly';
export type FilingStatus = 'single' | 'married';

export interface CalculatorInputs {
  incomeType: IncomeType;
  incomeAmount: number;
  filingStatus: FilingStatus;
  monthlyExpenses: number;
  investmentReturns: number;
  currentAge: number;
}

export interface TimeResult {
  years: number;
  months: number;
  ageAtGoal: number;
  impossible?: boolean;
}

export interface CalculationResults {
  grossIncome: TimeResult;
  afterTaxIncome: TimeResult;
  afterTaxAndExpenses: TimeResult;
  investedAmount: TimeResult;
  annualSummary: {
    annualIncome: number;
    taxRate: number;
    afterTaxIncome: number;
    investableAmount: number;
    monthlyExpenses?: number;
    investmentReturns?: number;
  };
}