import type { CalculatorInputs, FinancialProjections } from './types';

export function generateCSVContent(
  inputs: CalculatorInputs,
  projections: FinancialProjections
): string {
  const rows = [
    ['Dental Practice Financial Report'],
    [`Practice Name: ${inputs.practiceName}`],
    [''],
    ['Financial Metrics'],
    ['Metric,Value'],
    [`Monthly Revenue,${projections.monthlyRevenue}`],
    [`Annual Revenue,${projections.annualRevenue}`],
    [`Monthly Overhead,${projections.monthlyOverhead}`],
    [`Annual Overhead,${projections.annualOverhead}`],
    [`Net Income (Monthly),${projections.netIncome}`],
    [`Profit Margin,${projections.profitMargin.toFixed(1)}%`],
    [''],
    ['Employee Salaries'],
    ['Title,Monthly Salary'],
    ...inputs.employees.map(emp => `${emp.title},${emp.monthlySalary}`),
    [''],
    ['Overhead Costs'],
    ['Expense,Monthly Amount'],
    ...inputs.overheadCosts.map(cost => `${cost.name},${cost.monthlyAmount}`),
    [''],
    ['5 Year Projections'],
    ['Year,Projected Profit'],
    ...projections.yearlyProjections.map((profit, i) => `Year ${i + 1},${profit}`)
  ];

  return rows.join('\n');
}

export function downloadCSV(
  inputs: CalculatorInputs,
  projections: FinancialProjections
): void {
  const csvContent = generateCSVContent(inputs, projections);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, 'dental-practice-projections.csv');
  } else {
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'dental-practice-projections.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
