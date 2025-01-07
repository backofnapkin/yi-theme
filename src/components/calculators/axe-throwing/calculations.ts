import type { CalculatorInputs, CalculatorResults } from './types';

export function calculateResults(inputs: CalculatorInputs): CalculatorResults {
  // Calculate total startup costs
  const totalStartupCosts = 
    inputs.leaseholdImprovements +
    (inputs.laneSetupCost * inputs.numberOfLanes) +
    (inputs.numberOfAxes * inputs.costPerAxe) +
    inputs.permitsAndLicenses +
    inputs.initialMarketing;

  // Calculate monthly revenue
  // Each lane can host one group at a time, revenue is per group
  const peakHoursRevenue = 
    inputs.numberOfLanes *
    inputs.peakHours * 4 * // 4 weeks per month
    (inputs.peakUtilization / 100) *
    (inputs.walkInPrice * inputs.averageGroupSize); // Full group revenue

  const offPeakHoursRevenue =
    inputs.numberOfLanes *
    inputs.offPeakHours * 4 *
    (inputs.offPeakUtilization / 100) *
    (inputs.walkInPrice * inputs.averageGroupSize);

  const corporateEventRevenue = 
    inputs.monthlyCorpEvents * inputs.corporateEventPrice;

  const totalMonthlyRevenue = 
    peakHoursRevenue + offPeakHoursRevenue + corporateEventRevenue;

  // Calculate monthly costs including custom expenses
  const customExpensesTotal = inputs.customExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const totalMonthlyCosts =
    inputs.monthlyRent +
    inputs.monthlyInsurance +
    inputs.monthlyUtilities +
    inputs.monthlyWages +
    inputs.monthlyMarketing +
    (inputs.maintenanceCostPerLane * inputs.numberOfLanes) +
    customExpensesTotal;

  // Calculate monthly profit
  const monthlyProfit = totalMonthlyRevenue - totalMonthlyCosts;
  const monthlyProfitPerLane = monthlyProfit / inputs.numberOfLanes;

  // Calculate net profit margin
  const netProfitMargin = (monthlyProfit / totalMonthlyRevenue) * 100;

  // Calculate break-even point (in weeks)
  const weeklyProfit = monthlyProfit / 4;
  const breakEvenWeeks = Math.ceil(totalStartupCosts / weeklyProfit);

  // Calculate monthly customers needed
  const revenuePerCustomer = inputs.walkInPrice;
  const monthlyCustomersNeeded = Math.ceil(totalMonthlyCosts / revenuePerCustomer);

  const monthlyProjections = Array(36).fill(0).map((_, i) => 
    monthlyProfit * Math.pow(1.05, i)
  );

  const annualProjections = [
    monthlyProjections.slice(0, 12).reduce((a, b) => a + b, 0),
    monthlyProjections.slice(12, 24).reduce((a, b) => a + b, 0),
    monthlyProjections.slice(24, 36).reduce((a, b) => a + b, 0)
  ];

  const annualProfit = monthlyProfit * 12;
  const conservativeScenario = annualProfit * 0.75;
  const optimisticScenario = annualProfit * 1.25;

  return {
    totalStartupCosts,
    totalMonthlyCosts,
    totalMonthlyRevenue,
    netProfitMargin,
    breakEvenWeeks,
    monthlyCustomersNeeded,
    monthlyProfitPerLane,
    threeYearProjections: {
      monthly: monthlyProjections,
      annual: annualProjections
    },
    scenarios: {
      conservative: conservativeScenario,
      optimistic: optimisticScenario
    }
  };
}