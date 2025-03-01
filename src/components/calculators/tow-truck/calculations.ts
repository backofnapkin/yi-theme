import type { TowTruckBusinessData, CalculationResults, CashFlowData, ExpenseBreakdown } from './types';

function generateMonthLabel(monthIndex: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() + monthIndex);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function generateYearLabel(yearIndex: number): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + yearIndex);
  return date.getFullYear().toString();
}

function calculateGrowthMultiplier(monthIndex: number, monthlyGrowthRate: number): number {
  return Math.pow(1 + monthlyGrowthRate / 100, monthIndex);
}

function generateMonthlyData(
  baseRevenue: number,
  baseExpenses: number,
  months: number,
  monthlyGrowthRate: number
): CashFlowData[] {
  let cumulativeRevenue = 0;
  let cumulativeExpenses = 0;

  return Array.from({ length: months }, (_, i) => {
    const growthMultiplier = calculateGrowthMultiplier(i, monthlyGrowthRate);
    const monthlyRevenue = baseRevenue * growthMultiplier;
    const monthlyExpenses = baseExpenses * growthMultiplier;

    cumulativeRevenue += monthlyRevenue;
    cumulativeExpenses += monthlyExpenses;
    
    return {
      month: generateMonthLabel(i),
      revenue: Math.round(cumulativeRevenue),
      expenses: Math.round(cumulativeExpenses),
      profit: Math.round(cumulativeRevenue - cumulativeExpenses)
    };
  });
}

function generateYearlyData(
  baseRevenue: number,
  baseExpenses: number,
  years: number,
  monthlyGrowthRate: number
): CashFlowData[] {
  let cumulativeRevenue = 0;
  let cumulativeExpenses = 0;

  return Array.from({ length: years }, (_, i) => {
    const yearlyGrowthMultiplier = calculateGrowthMultiplier(i * 12, monthlyGrowthRate);
    const yearlyRevenue = baseRevenue * 12 * yearlyGrowthMultiplier;
    const yearlyExpenses = baseExpenses * 12 * yearlyGrowthMultiplier;

    cumulativeRevenue += yearlyRevenue;
    cumulativeExpenses += yearlyExpenses;
    
    return {
      month: generateYearLabel(i),
      revenue: Math.round(cumulativeRevenue),
      expenses: Math.round(cumulativeExpenses),
      profit: Math.round(cumulativeRevenue - cumulativeExpenses)
    };
  });
}

function calculateExpenseBreakdown(data: TowTruckBusinessData, totalMonthlyLoanPayment: number, monthlyFuelCost: number): ExpenseBreakdown[] {
  const yearlyExpenses = [
    {
      name: 'Loan Payments',
      amount: Math.round(totalMonthlyLoanPayment * 12),
      color: '#4F46E5' // blue
    },
    {
      name: 'Fuel',
      amount: Math.round(monthlyFuelCost * 12),
      color: '#EF4444' // red
    },
    {
      name: 'Insurance',
      amount: Math.round(data.monthlyInsurance * 12),
      color: '#10B981' // green
    },
    {
      name: 'Maintenance',
      amount: Math.round(data.monthlyMaintenance * 12),
      color: '#F59E0B' // yellow
    },
    {
      name: 'Broker Fees',
      amount: Math.round(data.monthlyBrokerFees * 12),
      color: '#6366F1' // indigo
    },
    {
      name: 'Labor',
      amount: Math.round(data.monthlyLaborCosts * 12),
      color: '#8B5CF6' // purple
    },
    ...data.customExpenses.map((expense, index) => ({
      name: expense.name || `Custom Expense ${index + 1}`,
      amount: Math.round(expense.amount * 12),
      color: `#${Math.floor(Math.random()*16777215).toString(16)}` // random color
    }))
  ];

  const totalAmount = yearlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return yearlyExpenses.map(expense => ({
    ...expense,
    percentage: (expense.amount / totalAmount) * 100
  }));
}

export function calculateResults(data: TowTruckBusinessData): CalculationResults {
  // Calculate monthly revenue
  const monthlyRevenue = data.numTrucks * data.operatingDays * data.towsPerDay * data.feePerTow;
  const yearlyRevenue = monthlyRevenue * 12;

  // Calculate total monthly loan payments
  const totalMonthlyLoanPayment = data.truckFinancing.reduce((total, financing) => {
    const loanAmount = financing.truckPrice - financing.downPayment;
    const monthlyInterestRate = financing.interestRate / 100 / 12;
    const numberOfPayments = financing.loanTerm * 12;
    const monthlyLoanPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    return total + monthlyLoanPayment;
  }, 0);

  // Calculate fuel costs (estimated 100 miles per day per truck)
  const milesPerDay = 100;
  const gallonsPerDay = milesPerDay / data.milesPerGallon;
  const monthlyFuelCost = gallonsPerDay * data.fuelCostPerGallon * data.operatingDays * data.numTrucks;

  // Calculate total monthly expenses
  const monthlyExpenses = 
    totalMonthlyLoanPayment +
    monthlyFuelCost +
    data.monthlyInsurance +
    data.monthlyMaintenance +
    data.monthlyBrokerFees +
    data.monthlyLaborCosts +
    data.customExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const yearlyExpenses = monthlyExpenses * 12;

  // Calculate profits
  const monthlyProfit = monthlyRevenue - monthlyExpenses;
  const yearlyProfit = monthlyProfit * 12;

  // Calculate required tows to break even
  const requiredTowsPerMonth = monthlyExpenses / data.feePerTow;

  // Calculate expense breakdown
  const expenseBreakdown = calculateExpenseBreakdown(data, totalMonthlyLoanPayment, monthlyFuelCost);

  // Generate cash flow projections for different periods
  const cashFlow = {
    oneYear: generateMonthlyData(monthlyRevenue, monthlyExpenses, 12, data.monthlyGrowthRate),
    threeYears: generateMonthlyData(monthlyRevenue, monthlyExpenses, 36, data.monthlyGrowthRate),
    fiveYears: generateYearlyData(monthlyRevenue, monthlyExpenses, 5, data.monthlyGrowthRate)
  };

  return {
    monthlyRevenue: Math.round(monthlyRevenue),
    yearlyRevenue: Math.round(yearlyRevenue),
    monthlyExpenses: Math.round(monthlyExpenses),
    yearlyExpenses: Math.round(yearlyExpenses),
    monthlyProfit: Math.round(monthlyProfit),
    yearlyProfit: Math.round(yearlyProfit),
    requiredTowsPerMonth,
    expenseBreakdown,
    cashFlow
  };
}