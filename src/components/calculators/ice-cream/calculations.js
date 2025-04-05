import { generateMonthlyProjection, monthNames } from './seasonality.js';

/**
 * Calculate all profit projections for the ice cream business
 * @param {Object[]} menuItems - Array of menu items
 * @param {Object} operations - Operations parameters
 * @param {Object[]} expenses - Array of expense items
 * @returns {Object} - Complete calculation results
 */
export function calculateProfits(menuItems, operations, expenses) {
  // Fix parameter inconsistency - use operations.daysOpen instead of daysOpenPerWeek
  const { daysOpen, monthsOpen, wastePercentage, revenueGrowth, expenseGrowth } = operations;
  
  // Calculate daily revenue and costs
  let dailyRevenue = 0;
  let dailyCogs = 0; // Cost of Goods Sold
  
  // Process each menu item
  menuItems.forEach(item => {
    const { unitsSold, price, ingredientCost, packagingCost } = item;
    dailyRevenue += unitsSold * price;
    dailyCogs += unitsSold * (ingredientCost + packagingCost);
  });
  
  // Apply waste percentage to COGS
  dailyCogs = dailyCogs * (1 + wastePercentage / 100);
  
  // Calculate monthly fixed expenses
  const monthlyFixedExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Convert daily COGS to monthly
  const weeksPerMonth = 4.33; // Average weeks in a month
  const monthlyCogs = dailyCogs * daysOpen * weeksPerMonth;
  
  // Calculate monthly revenue
  const monthlyRevenue = dailyRevenue * daysOpen * weeksPerMonth;
  
  // Calculate total monthly expenses
  const totalMonthlyExpenses = monthlyFixedExpenses + monthlyCogs;
  
  // Calculate profits
  const dailyFixedExpenses = monthlyFixedExpenses / (daysOpen * weeksPerMonth);
  const dailyProfit = dailyRevenue - dailyCogs - dailyFixedExpenses;
  const monthlyProfit = monthlyRevenue - totalMonthlyExpenses;
  const annualProfit = monthlyProfit * monthsOpen;
  
  // Calculate annual values
  const annualRevenue = monthlyRevenue * monthsOpen;
  const annualCogs = monthlyCogs * monthsOpen;
  const annualFixedExpenses = monthlyFixedExpenses * monthsOpen;
  const totalAnnualExpenses = totalMonthlyExpenses * monthsOpen;
  
  // Calculate profit per unit for each menu item
  // UPDATED: Only consider direct costs (ingredients + packaging) without allocating fixed expenses
  const profitPerUnit = menuItems.map(item => {
    const { name, price, ingredientCost, packagingCost } = item;
    const directCostPerUnit = (ingredientCost + packagingCost) * (1 + wastePercentage / 100);
    const profit = price - directCostPerUnit;
    const margin = price > 0 ? (profit / price) * 100 : 0;
    return { name, profit, margin };
  });
  
  // Create expense breakdown
  const wasteCost = {
    monthly: monthlyCogs * (wastePercentage / 100),
    annual: annualCogs * (wastePercentage / 100)
  };
  
  const expenseBreakdown = {
    monthly: [
      ...expenses.map(expense => ({
        name: expense.name,
        amount: expense.amount,
        percentage: totalMonthlyExpenses > 0 ? 
          (expense.amount / totalMonthlyExpenses) * 100 : 0
      })),
      {
        name: 'Ingredients & Packaging',
        amount: monthlyCogs - wasteCost.monthly,
        percentage: totalMonthlyExpenses > 0 ? 
          ((monthlyCogs - wasteCost.monthly) / totalMonthlyExpenses) * 100 : 0
      },
      {
        name: 'Waste',
        amount: wasteCost.monthly,
        percentage: totalMonthlyExpenses > 0 ? 
          (wasteCost.monthly / totalMonthlyExpenses) * 100 : 0
      }
    ],
    annual: [
      ...expenses.map(expense => ({
        name: expense.name,
        amount: expense.amount * monthsOpen,
        percentage: totalAnnualExpenses > 0 ? 
          (expense.amount * monthsOpen / totalAnnualExpenses) * 100 : 0
      })),
      {
        name: 'Ingredients & Packaging',
        amount: annualCogs - wasteCost.annual,
        percentage: totalAnnualExpenses > 0 ? 
          ((annualCogs - wasteCost.annual) / totalAnnualExpenses) * 100 : 0
      },
      {
        name: 'Waste',
        amount: wasteCost.annual,
        percentage: totalAnnualExpenses > 0 ? 
          (wasteCost.annual / totalAnnualExpenses) * 100 : 0
      }
    ]
  };
  
  // Generate monthly projection data with seasonal adjustments
  const monthlyProjection = generateMonthlyProjection(menuItems, operations, expenses);
  
  // Generate 5-year projection data with user-defined growth rates
  const yearlyProjection = generateYearlyProjection(
    annualRevenue, 
    totalAnnualExpenses, 
    revenueGrowth / 100, 
    expenseGrowth / 100
  );
  
  return {
    dailyRevenue,
    dailyCogs,
    dailyProfit,
    monthlyRevenue,
    monthlyCogs,
    monthlyProfit,
    annualRevenue,
    annualCogs,
    annualProfit,
    totalMonthlyExpenses,
    totalAnnualExpenses,
    profitPerUnit,
    expenseBreakdown,
    monthlyProjection,
    yearlyProjection
  };
}

/**
 * Generate 5-year projection data for the business
 * @param {number} firstYearRevenue - First year revenue
 * @param {number} firstYearExpenses - First year expenses
 * @param {number} revenueGrowthRate - Annual revenue growth rate (decimal)
 * @param {number} expenseGrowthRate - Annual expense growth rate (decimal)
 * @returns {Object[]} - Yearly projection data for charts
 */
function generateYearlyProjection(
  firstYearRevenue, 
  firstYearExpenses, 
  revenueGrowthRate = 0.05, 
  expenseGrowthRate = 0.03
) {
  const yearlyData = [];
  const YEARS = 5;
  
  let revenue = firstYearRevenue;
  let expenses = firstYearExpenses;
  
  for (let year = 1; year <= YEARS; year++) {
    const profit = revenue - expenses;
    
    yearlyData.push({
      year,
      revenue: Math.max(0, revenue),  // Ensure non-negative value for charts
      expenses: Math.max(0, expenses), // Ensure non-negative value for charts
      profit
    });
    
    // Apply growth rates for next year
    revenue *= (1 + revenueGrowthRate);
    expenses *= (1 + expenseGrowthRate);
  }
  
  return yearlyData;
}