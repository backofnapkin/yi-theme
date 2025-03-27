import React, { useState, useEffect } from 'react';
import { TimeCardDisplay } from './TimeCardDisplay';
import { 
  formatTimeFromHours, 
  formatTimeForDisplay, 
  calculateTimeWorked,
  calculateOvertime,
  analyzeTimecard,
  calculateMonthlyProjection,
  formatCurrency
} from './utils';
import './WorkHoursCalculator.css';

export function WorkHoursCalculator() {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const defaultWorkdayTimes = {
    start: '09:00',
    end: '17:00',
    break: 30
  };

  const initialFormData = {
    name: '',
    hourlyRate: 35.00,
    overtimeMultiplier: 1.5,
    overtimeOption: 'weeklyOvertime',
    overtimeDailyThreshold: 8,
    overtimeWeeklyThreshold: 40,
    showBlankDays: true,
    days: daysOfWeek.map((day, index) => ({
      day,
      start: index < 5 ? defaultWorkdayTimes.start : '',
      end: index < 5 ? defaultWorkdayTimes.end : '',
      break: index < 5 ? defaultWorkdayTimes.break : 0
    }))
  };

  const [formData, setFormData] = useState(initialFormData);
  const [calculationResults, setCalculationResults] = useState(null);
  const [isCalculated, setIsCalculated] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'radio') {
      setFormData(prev => ({ ...prev, overtimeOption: name }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle day-specific input changes
  const handleDayChange = (index, field, value) => {
    setFormData(prev => {
      const updatedDays = [...prev.days];
      updatedDays[index] = { ...updatedDays[index], [field]: value };
      return { ...prev, days: updatedDays };
    });
  };

  // Copy Monday-Friday times down
  const copyFirstRowDown = () => {
    setFormData(prev => {
      const updatedDays = [...prev.days];
      const mondayData = updatedDays[0];
      
      // Apply Monday's data to Tuesday-Friday
      for (let i = 1; i < 5; i++) {
        updatedDays[i] = { 
          ...updatedDays[i],
          start: mondayData.start,
          end: mondayData.end,
          break: mondayData.break
        };
      }
      
      return { ...prev, days: updatedDays };
    });
  };

  // Reset form to defaults
  const resetForm = () => {
    setFormData(initialFormData);
    setCalculationResults(null);
    setIsCalculated(false);
  };

  // Calculate time and pay
  const calculateTimeCard = (e) => {
    e.preventDefault();
    
    // Process each day's hours
    const processedDays = formData.days.map(dayData => {
      // Skip empty days
      if (!dayData.start || !dayData.end) {
        return {
          ...dayData,
          totalMinutes: 0,
          totalHours: 0,
          formattedTime: '0:00',
          decimalHours: 0,
          isOvertime: false,
          overtimeHours: 0
        };
      }
      
      // Calculate working minutes
      const startParts = dayData.start.split(':').map(Number);
      const endParts = dayData.end.split(':').map(Number);
      
      const startMinutes = startParts[0] * 60 + startParts[1];
      const endMinutes = endParts[0] * 60 + endParts[1];
      
      // Calculate minutes worked (accounting for break time)
      let totalMinutes = endMinutes - startMinutes - (dayData.break || 0);
      if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight shifts
      
      // Format for display
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
      const decimalHours = parseFloat((totalMinutes / 60).toFixed(2));
      
      // Initial overtime calculation for daily overtime
      const isOvertime = formData.overtimeOption === 'dailyOvertime' && decimalHours > formData.overtimeDailyThreshold;
      const overtimeHours = isOvertime ? decimalHours - formData.overtimeDailyThreshold : 0;
      
      return {
        ...dayData,
        totalMinutes,
        totalHours: decimalHours,
        formattedTime,
        decimalHours,
        isOvertime,
        overtimeHours
      };
    });
    
    // Calculate weekly totals
    const totalMinutes = processedDays.reduce((sum, day) => sum + day.totalMinutes, 0);
    const totalHours = parseFloat((totalMinutes / 60).toFixed(2));
    
    let regularHours = totalHours;
    let overtimeHours = 0;
    
    // Apply overtime rules
    switch (formData.overtimeOption) {
      case 'noOvertime':
        // No overtime adjustment needed
        break;
        
      case 'dailyMax':
        // Cap hours per day
        regularHours = processedDays.reduce((sum, day) => {
          return sum + Math.min(day.decimalHours, formData.overtimeDailyThreshold);
        }, 0);
        break;
        
      case 'weeklyMax':
        // Cap total weekly hours
        regularHours = Math.min(totalHours, formData.overtimeWeeklyThreshold);
        break;
        
      case 'dailyOvertime':
        // Overtime calculated per day (already done in the day processing)
        regularHours = processedDays.reduce((sum, day) => sum + (day.decimalHours - day.overtimeHours), 0);
        overtimeHours = processedDays.reduce((sum, day) => sum + day.overtimeHours, 0);
        break;
        
      case 'weeklyOvertime':
        // Overtime after weekly threshold
        if (totalHours > formData.overtimeWeeklyThreshold) {
          regularHours = formData.overtimeWeeklyThreshold;
          overtimeHours = totalHours - formData.overtimeWeeklyThreshold;
        }
        break;
        
      default:
        break;
    }
    
    // Format regular and overtime hours for display
    const regHoursFormatted = formatTimeFromHours(regularHours);
    const otHoursFormatted = formatTimeFromHours(overtimeHours);
    const totalHoursFormatted = formatTimeFromHours(totalHours);
    
    // Calculate pay amounts
    const hourlyRate = parseFloat(formData.hourlyRate);
    const regularPay = regularHours * hourlyRate;
    const overtimePay = overtimeHours * hourlyRate * formData.overtimeMultiplier;
    const totalPay = regularPay + overtimePay;
    
    // Additional analysis
    const workDaysCount = processedDays.filter(day => day.totalMinutes > 0).length;
    const avgHoursPerDay = workDaysCount > 0 ? parseFloat((totalHours / workDaysCount).toFixed(2)) : 0;
    
    // Find shortest and longest days
    const workingDays = processedDays.filter(day => day.totalMinutes > 0);
    let shortestDay = { day: 'None', hours: 0 };
    let longestDay = { day: 'None', hours: 0 };
    
    if (workingDays.length > 0) {
      shortestDay = workingDays.reduce((min, day) => 
        day.decimalHours < min.hours ? { day: day.day, hours: day.decimalHours } : min, 
        { day: workingDays[0].day, hours: workingDays[0].decimalHours }
      );
      
      longestDay = workingDays.reduce((max, day) => 
        day.decimalHours > max.hours ? { day: day.day, hours: day.decimalHours } : max, 
        { day: workingDays[0].day, hours: workingDays[0].decimalHours }
      );
    }
    
    // Monthly projection (4 weeks)
    const monthlyRegularHours = regularHours * 4;
    const monthlyOvertimeHours = overtimeHours * 4;
    const monthlyTotalHours = totalHours * 4;
    const monthlyPay = totalPay * 4;
    
    // Prepare results
    const results = {
      processedDays,
      regularHours,
      overtimeHours,
      totalHours,
      regHoursFormatted,
      otHoursFormatted,
      totalHoursFormatted,
      regularPay,
      overtimePay,
      totalPay,
      avgHoursPerDay,
      shortestDay,
      longestDay,
      monthlyRegularHours,
      monthlyOvertimeHours,
      monthlyTotalHours,
      monthlyPay
    };
    
    setCalculationResults(results);
    setIsCalculated(true);
  };
  
  // Helper function to format decimal hours as hours:minutes
  const formatTimeFromHours = (decimalHours) => {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="work-hours-calculator">
      {!isCalculated ? (
        <form onSubmit={calculateTimeCard} className="time-card-form">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Employee Name */}
            <div className="lg:col-span-12">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Employee Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter name"
              />
            </div>
            
            {/* Time Entry Table */}
            <div className="lg:col-span-12">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Weekly Time Entries</h3>
                <button
                  type="button"
                  onClick={copyFirstRowDown}
                  className="bg-gradient-to-br from-green-500 to-emerald-500 hover:bg-purple-100 text-gray-700 py-1 px-3 rounded border border-purple-100"
                >
                  Copy Mon-Fri from Monday
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-emerald-50">
                      <th className="p-2 border text-left">Day</th>
                      <th className="p-2 border text-left">Start Time</th>
                      <th className="p-2 border text-left">End Time</th>
                      <th className="p-2 border text-left">Break (minutes)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.days.map((dayData, index) => (
                      <tr key={dayData.day}>
                        <td className="p-2 border font-medium">{dayData.day}</td>
                        <td className="p-2 border">
                          <input
                            type="time"
                            value={dayData.start}
                            onChange={(e) => handleDayChange(index, 'start', e.target.value)}
                            className="p-1 border rounded w-full"
                          />
                        </td>
                        <td className="p-2 border">
                          <input
                            type="time"
                            value={dayData.end}
                            onChange={(e) => handleDayChange(index, 'end', e.target.value)}
                            className="p-1 border rounded w-full"
                          />
                        </td>
                        <td className="p-2 border">
                          <input
                            type="number"
                            value={dayData.break}
                            onChange={(e) => handleDayChange(index, 'break', parseInt(e.target.value) || 0)}
                            className="p-1 border rounded w-20"
                            min="0"
                            max="480"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Pay Settings */}
            <div className="lg:col-span-6">
              <h3 className="text-lg font-medium mb-3">Pay Settings</h3>
              
              <div className="mb-4">
                <label htmlFor="hourlyRate" className="block text-gray-700 mb-1">
                  Pay per Hour ($)
                </label>
                <input
                  type="number"
                  id="hourlyRate"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="p-2 border rounded w-32"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="overtimeMultiplier" className="block text-gray-700 mb-1">
                  Overtime Rate Multiplier
                </label>
                <input
                  type="number"
                  id="overtimeMultiplier"
                  name="overtimeMultiplier"
                  value={formData.overtimeMultiplier}
                  onChange={handleInputChange}
                  step="0.1"
                  min="1"
                  className="p-2 border rounded w-32"
                />
              </div>
            </div>
            
            {/* Overtime Options */}
            <div className="lg:col-span-6">
              <h3 className="text-lg font-medium mb-3">Overtime Options</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="noOvertime"
                    name="noOvertime"
                    checked={formData.overtimeOption === 'noOvertime'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor="noOvertime">
                    No overtime rate, pay base rate for overtime worked
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="dailyMax"
                    name="dailyMax"
                    checked={formData.overtimeOption === 'dailyMax'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor="dailyMax" className="flex items-center">
                    No overtime pay, pay max
                    <input
                      type="number"
                      value={formData.overtimeDailyThreshold}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        overtimeDailyThreshold: parseInt(e.target.value) || 8
                      }))}
                      className="mx-2 p-1 border rounded w-16 text-center"
                      min="1"
                      max="24"
                    />
                    hours per day
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="weeklyMax"
                    name="weeklyMax"
                    checked={formData.overtimeOption === 'weeklyMax'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor="weeklyMax" className="flex items-center">
                    No overtime pay, pay max
                    <input
                      type="number"
                      value={formData.overtimeWeeklyThreshold}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        overtimeWeeklyThreshold: parseInt(e.target.value) || 40
                      }))}
                      className="mx-2 p-1 border rounded w-16 text-center"
                      min="1"
                      max="168"
                    />
                    hours per week
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="dailyOvertime"
                    name="dailyOvertime"
                    checked={formData.overtimeOption === 'dailyOvertime'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor="dailyOvertime" className="flex items-center">
                    Overtime pay after
                    <input
                      type="number"
                      value={formData.overtimeDailyThreshold}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        overtimeDailyThreshold: parseInt(e.target.value) || 8
                      }))}
                      className="mx-2 p-1 border rounded w-16 text-center"
                      min="1"
                      max="24"
                    />
                    hours per day
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="weeklyOvertime"
                    name="weeklyOvertime"
                    checked={formData.overtimeOption === 'weeklyOvertime'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor="weeklyOvertime" className="flex items-center">
                    Overtime pay after
                    <input
                      type="number"
                      value={formData.overtimeWeeklyThreshold}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        overtimeWeeklyThreshold: parseInt(e.target.value) || 40
                      }))}
                      className="mx-2 p-1 border rounded w-16 text-center"
                      min="1"
                      max="168"
                    />
                    hours per week
                  </label>
                </div>
              </div>
            </div>
            
            {/* Display Options */}
            <div className="lg:col-span-12">
              <h3 className="text-lg font-medium mb-3">Display Options</h3>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showBlankDays"
                  name="showBlankDays"
                  checked={formData.showBlankDays}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    showBlankDays: e.target.checked
                  }))}
                  className="mr-2"
                />
                <label htmlFor="showBlankDays">
                  Show blank days in report
                </label>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="lg:col-span-12 flex justify-center space-x-4">
              <button
                type="submit"
                className="bg-gradient-to-br from-green-300 to-emerald-300 hover:bg-emerald-100 text-emerald-700 py-2 px-6 rounded-lg text-lg font-medium border-2 border-emerald-500"
              >
                Calculate
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-skin-red-light hover:bg-slate-100 text-slate-700 py-2 px-6 rounded-lg text-lg font-medium border-2 border-slate-300"
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="results-container">
          <TimeCardDisplay 
            name={formData.name}
            results={calculationResults}
            formData={formData}
            onBack={() => setIsCalculated(false)}
          />
        </div>
      )}
    </div>
  );
}