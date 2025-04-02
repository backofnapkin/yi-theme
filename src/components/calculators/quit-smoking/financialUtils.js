/**
 * Calculate daily cost of smoking
 * @param {number} dailyCigarettes - Number of cigarettes smoked daily
 * @param {number} costPerPack - Cost of a pack in dollars
 * @param {number} cigarettesPerPack - Number of cigarettes in a pack
 * @returns {number} - Daily cost in dollars
 */
export const calculateDailyCost = (dailyCigarettes, costPerPack, cigarettesPerPack) => {
    return (dailyCigarettes / cigarettesPerPack) * costPerPack;
  };
  
  /**
   * Calculate regular savings (without investment)
   * @param {number} dailyCost - Daily cost of smoking
   * @param {number} days - Number of days to calculate for
   * @returns {number} - Total savings
   */
  export const calculateRegularSavings = (dailyCost, days) => {
    return dailyCost * days;
  };
  
  /**
   * Calculate compound savings with monthly contributions
   * @param {number} monthlyContribution - Monthly amount saved
   * @param {number} annualRate - Annual rate of return (as decimal)
   * @param {number} years - Number of years
   * @returns {number} - Total savings with compound interest
   */
  export const calculateCompoundSavings = (monthlyContribution, annualRate, years) => {
    let total = 0;
    const monthlyRate = annualRate / 12;
    const months = years * 12;
    
    for (let i = 0; i < months; i++) {
      total = (total + monthlyContribution) * (1 + monthlyRate);
    }
    
    return total;
  };
  
  /**
   * Format currency value
   * @param {number} value - Amount to format
   * @param {number} fractionDigits - Number of decimal places
   * @returns {string} - Formatted currency string
   */
  export const formatCurrency = (value, fractionDigits = 2) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits
    }).format(value);
  };
  
  /**
   * Generate chart data for savings visualization
   * @param {number} dailyCost - Daily cost of smoking
   * @param {number} monthlyContribution - Monthly amount saved
   * @param {number} annualRate - Annual rate of return (as decimal)
   * @param {number} years - Number of years to generate data for
   * @returns {Array} - Array of data points for chart
   */
  export const generateChartData = (dailyCost, monthlyContribution, annualRate, years) => {
    const chartData = [];
    
    for (let year = 0; year <= years; year++) {
      chartData.push({
        year: year,
        regularSavings: dailyCost * 365 * year,
        compoundSavings: year === 0 ? 0 : calculateCompoundSavings(monthlyContribution, annualRate, year)
      });
    }
    
    return chartData;
  };