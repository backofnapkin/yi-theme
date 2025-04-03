/**
 * Utility functions for the Trump Tariff Calculator
 */

/**
 * Format a number as US currency
 * 
 * @param {number} amount - The amount to format
 * @param {Object} options - Formatting options
 * @param {number} options.minimumFractionDigits - Minimum number of decimal places (default: 2)
 * @param {number} options.maximumFractionDigits - Maximum number of decimal places (default: 2)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, options = {}) => {
    const {
      minimumFractionDigits = 2,
      maximumFractionDigits = 2
    } = options;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits,
      maximumFractionDigits
    }).format(amount);
  };
  
  /**
   * Format a number as a percentage
   * 
   * @param {number} value - The value to format as percentage
   * @param {Object} options - Formatting options
   * @param {number} options.minimumFractionDigits - Minimum number of decimal places (default: 1)
   * @param {number} options.maximumFractionDigits - Maximum number of decimal places (default: 1)
   * @returns {string} - Formatted percentage string
   */
  export const formatPercentage = (value, options = {}) => {
    const {
      minimumFractionDigits = 1,
      maximumFractionDigits = 1
    } = options;
    
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits,
      maximumFractionDigits
    }).format(value / 100);
  };
  
  /**
   * Creates a debounced function that delays invoking the provided function
   * until after the specified wait time has elapsed since the last time it was invoked
   * 
   * @param {Function} func - The function to debounce
   * @param {number} wait - The number of milliseconds to delay
   * @returns {Function} - The debounced function
   */
  export const debounce = (func, wait) => {
    let timeout;
    
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  /**
   * Convert monthly amount to annual
   * 
   * @param {number} monthlyAmount - Monthly dollar amount
   * @returns {number} - Annual dollar amount
   */
  export const monthlyToAnnual = (monthlyAmount) => {
    return monthlyAmount * 12;
  };
  
  /**
   * Convert annual amount to monthly
   * 
   * @param {number} annualAmount - Annual dollar amount
   * @returns {number} - Monthly dollar amount
   */
  export const annualToMonthly = (annualAmount) => {
    return annualAmount / 12;
  };
  
  /**
   * Round a number to a specified number of decimal places
   * 
   * @param {number} value - The value to round
   * @param {number} decimals - Number of decimal places
   * @returns {number} - Rounded value
   */
  export const roundToDecimals = (value, decimals = 2) => {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  };
  
  /**
   * Check if a value is a valid positive number
   * 
   * @param {any} value - The value to check
   * @returns {boolean} - True if value is a valid positive number
   */
  export const isValidPositiveNumber = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num) && num >= 0;
  };