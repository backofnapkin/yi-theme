import type { CalculatorInputs, FinancialProjections, Scenarios } from './types';

export function calculateFinancials(inputs: CalculatorInputs): FinancialProjections {
  const monthlyPatientsPerChair = inputs.patientsPerChair * inputs.daysPerWeek * 4;
  const totalMonthlyPatients = monthlyPatientsPerChair * inputs.dentalChairs;
  const monthlyRevenue = totalMonthlyPatients * inputs.revenuePerPatient;
  
  const totalMonthlySalaries = inputs.employees.reduce((sum, emp) => sum + emp.monthlySalary, 0);
  const totalMonthlyOverhead = inputs.overheadCosts.reduce((sum, cost) => sum + cost.monthlyAmount, 0);
  
  const monthlyOverhead = totalMonthlySalaries + totalMonthlyOverhead;
  const monthlyNetIncome = monthlyRevenue - monthlyOverhead;
  
  const annualRevenue = monthlyRevenue * 12;
  const annualOverhead = monthlyOverhead * 12;
  const profitMargin = (monthlyNetIncome / monthlyRevenue) * 100;

  return {
    monthlyRevenue,
    annualRevenue,
    monthlyOverhead,
    annualOverhead,
    netIncome: monthlyNetIncome,
    profitMargin,
    yearlyProjections: Array(5).fill(0).map((_, i) => monthlyNetIncome * 12 * (1 + (i * 0.1)))
  };
}

export function calculateScenarios(inputs: CalculatorInputs): Scenarios {
  const current = calculateFinancials(inputs);
  
  const bestCase = calculateFinancials({
    ...inputs,
    patientsPerChair: inputs.patientsPerChair + 2,
    daysPerWeek: Math.min(inputs.daysPerWeek + 1, 7)
  });

  const worstCase = calculateFinancials({
    ...inputs,
    patientsPerChair: Math.ceil(inputs.patientsPerChair * 0.75),
    revenuePerPatient: inputs.revenuePerPatient * 0.75
  });

  return { current, bestCase, worstCase };
}
