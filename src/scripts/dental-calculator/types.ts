export interface Employee {
  title: string;
  monthlySalary: number;
}

export interface OverheadCost {
  name: string;
  monthlyAmount: number;
}

export interface CalculatorInputs {
  practiceName: string;
  dentalChairs: number;
  patientsPerChair: number;
  revenuePerPatient: number;
  daysPerWeek: number;
  startupCosts: number;
  employees: Employee[];
  overhead: OverheadCost[];
}

export interface FinancialProjections {
  monthlyRevenue: number;
  annualRevenue: number;
  monthlyOverhead: number;
  annualOverhead: number;
  netIncome: number;
  profitMargin: number;
  yearlyProjections: number[];
}

export interface Scenarios {
  current: FinancialProjections;
  bestCase: FinancialProjections;
  worstCase: FinancialProjections;
}
