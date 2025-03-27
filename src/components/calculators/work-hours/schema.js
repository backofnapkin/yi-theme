/**
 * Schema definitions for the Work Hours Calculator
 * This file contains type definitions and validation functions for the calculator's data structures
 */

/**
 * @typedef {Object} DayData
 * @property {string} day - Name of the day (Monday, Tuesday, etc.)
 * @property {string} start - Start time in 24-hour format (HH:MM)
 * @property {string} end - End time in 24-hour format (HH:MM)
 * @property {number} break - Break duration in minutes
 */

/**
 * @typedef {Object} ProcessedDayData
 * @property {string} day - Name of the day
 * @property {string} start - Start time in 24-hour format (HH:MM)
 * @property {string} end - End time in 24-hour format (HH:MM)
 * @property {number} break - Break duration in minutes
 * @property {number} totalMinutes - Total minutes worked (excluding breaks)
 * @property {number} totalHours - Total hours worked in decimal format
 * @property {string} formattedTime - Formatted time (H:MM)
 * @property {number} decimalHours - Hours worked in decimal format
 * @property {boolean} isOvertime - Whether this day includes overtime hours
 * @property {number} overtimeHours - Number of overtime hours for this day
 */

/**
 * @typedef {Object} FormData
 * @property {string} name - Employee name
 * @property {number} hourlyRate - Hourly pay rate
 * @property {number} overtimeMultiplier - Overtime rate multiplier
 * @property {string} overtimeOption - Selected overtime calculation option
 * @property {number} overtimeDailyThreshold - Daily overtime threshold in hours
 * @property {number} overtimeWeeklyThreshold - Weekly overtime threshold in hours
 * @property {boolean} showBlankDays - Whether to show days with no hours in reports
 * @property {Array<DayData>} days - Array of day data entries
 */

/**
 * @typedef {Object} CalculationResults
 * @property {Array<ProcessedDayData>} processedDays - Processed day data with calculations
 * @property {number} regularHours - Total regular hours
 * @property {number} overtimeHours - Total overtime hours
 * @property {number} totalHours - Total hours worked
 * @property {string} regHoursFormatted - Formatted regular hours (H:MM)
 * @property {string} otHoursFormatted - Formatted overtime hours (H:MM)
 * @property {string} totalHoursFormatted - Formatted total hours (H:MM)
 * @property {number} regularPay - Regular pay amount
 * @property {number} overtimePay - Overtime pay amount
 * @property {number} totalPay - Total pay amount
 * @property {number} avgHoursPerDay - Average hours worked per day
 * @property {Object} shortestDay - Information about the shortest work day
 * @property {Object} longestDay - Information about the longest work day
 * @property {number} monthlyRegularHours - Projected monthly regular hours
 * @property {number} monthlyOvertimeHours - Projected monthly overtime hours
 * @property {number} monthlyTotalHours - Projected monthly total hours
 * @property {number} monthlyPay - Projected monthly pay
 */

/**
 * Helper functions for data validation
 */

/**
 * Validates a time string in 24-hour format (HH:MM)
 * @param {string} time - Time string to validate
 * @returns {boolean} Whether the time string is valid
 */
export function isValidTimeFormat(time) {
    // Empty time is valid (means no entry)
    if (!time) return true;
    
    // Check HH:MM format
    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return timeRegex.test(time);
  }
  
  /**
   * Validates a break duration
   * @param {number} breakDuration - Break duration in minutes
   * @returns {boolean} Whether the break duration is valid
   */
  export function isValidBreakDuration(breakDuration) {
    return typeof breakDuration === 'number' && 
           breakDuration >= 0 && 
           breakDuration <= 480; // Max 8 hours break
  }
  
  /**
   * Validates an hourly rate
   * @param {number} rate - Hourly pay rate
   * @returns {boolean} Whether the rate is valid
   */
  export function isValidHourlyRate(rate) {
    return typeof rate === 'number' && rate >= 0;
  }
  
  /**
   * Validates overtime multiplier
   * @param {number} multiplier - Overtime multiplier
   * @returns {boolean} Whether the multiplier is valid
   */
  export function isValidOvertimeMultiplier(multiplier) {
    return typeof multiplier === 'number' && multiplier >= 1;
  }
  
  /**
   * Formats decimal hours as hours:minutes string
   * @param {number} decimalHours - Hours in decimal format
   * @returns {string} Formatted time string (H:MM)
   */
  export function formatTimeFromHours(decimalHours) {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }
  
  /**
   * Formats time for display (converts 24h to 12h format)
   * @param {string} time24h - Time in 24-hour format
   * @returns {string} Time in 12-hour format with AM/PM
   */
  export function formatTimeForDisplay(time24h) {
    if (!time24h) return '';
    
    const [hours, minutes] = time24h.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  }