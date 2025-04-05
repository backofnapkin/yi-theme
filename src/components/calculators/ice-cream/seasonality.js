// Seasonal adjustment factors for ice cream sales throughout the year
export const seasonalityFactors = {
    0: 0.6,  // Jan (Winter)
    1: 0.6,  // Feb
    2: 0.9,  // Mar (Spring)
    3: 0.9,  // Apr
    4: 0.9,  // May
    5: 1.3,  // Jun (Summer)
    6: 1.3,  // Jul
    7: 1.3,  // Aug
    8: 0.8,  // Sep (Fall)
    9: 0.8,  // Oct
    10: 0.8, // Nov
    11: 0.6  // Dec (Winter)
  };
  
  // Month names for use in charts and reporting
  export const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  /**
   * Calculate seasonally adjusted sales for a given month
   * @param {number} unitsSoldPerDay - Base number of units sold per day
   * @param {number} month - Month index (0-11)
   * @returns {number} - Adjusted units sold per day
   */
  export function calculateSeasonalSales(unitsSoldPerDay, month) {
    const factor = seasonalityFactors[month];
    return unitsSoldPerDay * factor;
  }
  
  /**
   * Calculate monthly revenue with seasonal adjustments
   * @param {number} unitsSoldPerDay - Base number of units sold per day
   * @param {number} pricePerUnit - Price per unit
   * @param {number} daysOpenPerWeek - Days open per week
   * @param {number} month - Month index (0-11)
   * @returns {number} - Total monthly revenue
   */
  export function calculateMonthlyRevenue(unitsSoldPerDay, pricePerUnit, daysOpenPerWeek, month) {
    const adjustedUnits = calculateSeasonalSales(unitsSoldPerDay, month);
    const dailyRevenue = adjustedUnits * pricePerUnit;
    const weeksPerMonth = 4.33; // Average weeks in a month
    return dailyRevenue * daysOpenPerWeek * weeksPerMonth;
  }
  
  /**
   * Generate data for monthly projection with seasonal adjustments
   * @param {Object[]} menuItems - Array of menu items
   * @param {Object} operations - Operations parameters
   * @param {Object[]} expenses - Array of expense items
   * @returns {Object[]} - Monthly projection data for charts
   */
  export function generateMonthlyProjection(menuItems, operations, expenses) {
    // Fix the parameter name mismatch - operations object has daysOpen, not daysOpenPerWeek
    const daysOpenPerWeek = operations.daysOpen;
    const { monthsOpen, wastePercentage } = operations;
    
    // Calculate total fixed monthly expenses
    const fixedMonthlyExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Generate monthly data
    const monthlyData = [];
    
    for (let month = 0; month < 12; month++) {
      // Skip months when business is not open
      if (month >= monthsOpen) {
        continue;
      }
      
      let monthlyRevenue = 0;
      let monthlyCogs = 0;
      
      // Calculate revenue and COGS for each menu item
      menuItems.forEach(item => {
        const { unitsSold, price, ingredientCost, packagingCost } = item;
        
        // Apply seasonal adjustment
        const adjustedUnits = calculateSeasonalSales(unitsSold, month);
        
        // Calculate for the entire month
        const weeksPerMonth = 4.33;
        const unitsPerMonth = adjustedUnits * daysOpenPerWeek * weeksPerMonth;
        
        // Add to totals
        monthlyRevenue += unitsPerMonth * price;
        monthlyCogs += unitsPerMonth * (ingredientCost + packagingCost);
      });
      
      // Apply waste percentage
      monthlyCogs = monthlyCogs * (1 + wastePercentage / 100);
      
      // Calculate profit
      const totalMonthlyExpenses = fixedMonthlyExpenses + monthlyCogs;
      const monthlyProfit = monthlyRevenue - totalMonthlyExpenses;
      
      // Ensure we have no negative values that might break the chart
      monthlyData.push({
        month: monthNames[month],
        monthIndex: month,
        revenue: Math.max(0, monthlyRevenue),
        expenses: Math.max(0, totalMonthlyExpenses),
        profit: monthlyProfit
      });
    }
    
    return monthlyData;
  }