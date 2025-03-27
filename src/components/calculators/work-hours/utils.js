/**
 * Utility functions for the Work Hours Calculator
 */

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
    if (!time24h) return '-';
    
    const [hours, minutes] = time24h.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
  
  /**
   * Formats currency value
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
  
  /**
   * Calculates time worked between two time strings
   * @param {string} startTime - Start time in 24-hour format (HH:MM)
   * @param {string} endTime - End time in 24-hour format (HH:MM)
   * @param {number} breakMinutes - Break duration in minutes
   * @returns {Object} Calculated time data
   */
  export function calculateTimeWorked(startTime, endTime, breakMinutes = 0) {
    if (!startTime || !endTime) {
      return {
        totalMinutes: 0,
        decimalHours: 0,
        formattedTime: '0:00'
      };
    }
    
    // Parse times
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    // Convert to minutes since midnight
    let startTotalMinutes = startHour * 60 + startMinute;
    let endTotalMinutes = endHour * 60 + endMinute;
    
    // Handle overnight shifts
    if (endTotalMinutes < startTotalMinutes) {
      endTotalMinutes += 24 * 60; // Add a day in minutes
    }
    
    // Calculate total minutes worked
    let totalMinutes = endTotalMinutes - startTotalMinutes - breakMinutes;
    if (totalMinutes < 0) totalMinutes = 0;
    
    // Convert to decimal hours
    const decimalHours = parseFloat((totalMinutes / 60).toFixed(2));
    
    // Format as H:MM
    const formattedTime = formatTimeFromHours(decimalHours);
    
    return {
      totalMinutes,
      decimalHours,
      formattedTime
    };
  }
  
  /**
   * Validates a day's time entries
   * @param {Object} dayData - Data for a single day
   * @returns {Object} Validation result
   */
  export function validateDayEntry(dayData) {
    const errors = {};
    
    // If start time is present, end time must also be present
    if (dayData.start && !dayData.end) {
      errors.end = 'End time is required when start time is provided';
    }
    
    // If end time is present, start time must also be present
    if (dayData.end && !dayData.start) {
      errors.start = 'Start time is required when end time is provided';
    }
    
    // Break should be a non-negative number
    if (dayData.break < 0) {
      errors.break = 'Break duration cannot be negative';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
  
  /**
   * Calculates overtime based on specified rules
   * @param {Array} processedDays - Array of processed day data
   * @param {Object} options - Overtime calculation options
   * @returns {Object} Calculated overtime data
   */
  export function calculateOvertime(processedDays, options) {
    const {
      overtimeOption,
      overtimeDailyThreshold,
      overtimeWeeklyThreshold
    } = options;
    
    // Calculate total hours worked
    const totalHours = processedDays.reduce((sum, day) => sum + day.decimalHours, 0);
    
    let regularHours = totalHours;
    let overtimeHours = 0;
    
    // Apply overtime rules
    switch (overtimeOption) {
      case 'noOvertime':
        // No overtime adjustment needed
        break;
        
      case 'dailyMax':
        // Cap hours per day
        regularHours = processedDays.reduce((sum, day) => {
          return sum + Math.min(day.decimalHours, overtimeDailyThreshold);
        }, 0);
        break;
        
      case 'weeklyMax':
        // Cap total weekly hours
        regularHours = Math.min(totalHours, overtimeWeeklyThreshold);
        break;
        
      case 'dailyOvertime':
        // Recalculate each day's overtime
        regularHours = 0;
        overtimeHours = 0;
        
        processedDays.forEach(day => {
          if (day.decimalHours > overtimeDailyThreshold) {
            const dayOvertimeHours = day.decimalHours - overtimeDailyThreshold;
            regularHours += overtimeDailyThreshold;
            overtimeHours += dayOvertimeHours;
          } else {
            regularHours += day.decimalHours;
          }
        });
        break;
        
      case 'weeklyOvertime':
        // Overtime after weekly threshold
        if (totalHours > overtimeWeeklyThreshold) {
          regularHours = overtimeWeeklyThreshold;
          overtimeHours = totalHours - overtimeWeeklyThreshold;
        }
        break;
        
      default:
        break;
    }
    
    return {
      regularHours,
      overtimeHours,
      totalHours,
      regHoursFormatted: formatTimeFromHours(regularHours),
      otHoursFormatted: formatTimeFromHours(overtimeHours),
      totalHoursFormatted: formatTimeFromHours(totalHours)
    };
  }
  
  /**
   * Analyze timecard data to generate statistics
   * @param {Array} processedDays - Array of processed day data
   * @returns {Object} Statistics about the timecard
   */
  export function analyzeTimecard(processedDays) {
    // Filter days with work hours
    const workingDays = processedDays.filter(day => day.decimalHours > 0);
    const workDaysCount = workingDays.length;
    
    // Calculate average hours per working day
    const totalHours = workingDays.reduce((sum, day) => sum + day.decimalHours, 0);
    const avgHoursPerDay = workDaysCount > 0 ? parseFloat((totalHours / workDaysCount).toFixed(2)) : 0;
    
    // Find shortest and longest days
    let shortestDay = { day: 'None', hours: 0 };
    let longestDay = { day: 'None', hours: 0 };
    
    if (workDaysCount > 0) {
      shortestDay = workingDays.reduce(
        (min, day) => day.decimalHours < min.hours ? { day: day.day, hours: day.decimalHours } : min,
        { day: workingDays[0].day, hours: workingDays[0].decimalHours }
      );
      
      longestDay = workingDays.reduce(
        (max, day) => day.decimalHours > max.hours ? { day: day.day, hours: day.decimalHours } : max,
        { day: workingDays[0].day, hours: workingDays[0].decimalHours }
      );
    }
    
    return {
      workDaysCount,
      avgHoursPerDay,
      shortestDay,
      longestDay
    };
  }
  
  /**
   * Calculate monthly projections based on weekly data
   * @param {Object} weeklyData - Weekly calculation results
   * @param {number} weeksInMonth - Number of weeks to project (default: 4)
   * @returns {Object} Monthly projections
   */
  export function calculateMonthlyProjection(weeklyData, weeksInMonth = 4) {
    const {
      regularHours,
      overtimeHours,
      totalHours,
      regularPay,
      overtimePay,
      totalPay
    } = weeklyData;
    
    return {
      monthlyRegularHours: regularHours * weeksInMonth,
      monthlyOvertimeHours: overtimeHours * weeksInMonth,
      monthlyTotalHours: totalHours * weeksInMonth,
      monthlyRegularPay: regularPay * weeksInMonth,
      monthlyOvertimePay: overtimePay * weeksInMonth,
      monthlyTotalPay: totalPay * weeksInMonth
    };
  }
  
  /**
   * Find days with overtime
   * @param {Array} processedDays - Array of processed day data
   * @param {number} dailyThreshold - Daily overtime threshold
   * @returns {Array} Days with overtime
   */
  export function findOvertimeDays(processedDays, dailyThreshold) {
    return processedDays
      .filter(day => day.decimalHours > dailyThreshold)
      .map(day => ({
        day: day.day,
        hours: day.decimalHours,
        overtime: day.decimalHours - dailyThreshold
      }));
  }