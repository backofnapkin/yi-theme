import React from 'react';
import { formatTimeForDisplay, formatCurrency } from './utils';
import './print-styles.css';

export function TimeCardDisplay({ name, results, formData, onBack }) {
  // Function to print the timecard using browser's print functionality
  const printTimeCard = () => {
    const printWindow = window.open('', '_blank');
    const today = new Date().toLocaleDateString();
    
    // Determine which days to show based on settings
    const daysToShow = formData.showBlankDays 
      ? results.processedDays 
      : results.processedDays.filter(day => day.totalMinutes > 0);
      
    printWindow.document.write(`
      <html>
        <head>
          <title>${name ? `${name}'s Time Card` : 'Time Card'}</title>
          <style>
            /* Base styles */
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              color: #000;
              line-height: 1.4;
            }
            
            h1, h2, h3 {
              margin-top: 0;
              font-weight: bold;
            }
            
            h1 { font-size: 22px; }
            h2 { font-size: 20px; }
            h3 { font-size: 16px; }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 25px;
            }
            
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            
            th {
              background-color: #ecfdf5; /* emerald-50 */
              font-weight: bold;
            }
            
            .summary-section {
              border: 1px solid #ccc;
              padding: 15px;
              margin-bottom: 20px;
            }
            
            .summary-header {
              border-bottom: 1px solid #ccc;
              margin-bottom: 15px;
              padding-bottom: 5px;
              font-weight: bold;
            }
            
            .data-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              border-bottom: 1px dotted #eee;
              padding-bottom: 5px;
            }
            
            .total-row {
              font-weight: bold;
              margin-top: 10px;
              border-top: 1px solid #000;
              padding-top: 5px;
            }
            
            .grid-container {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
            }
            
            .overtime-row { background-color: #fef3c7; } /* amber-50 */
            .summary-row { font-weight: bold; }
            .total-row-highlight { background-color: #d1fae5; } /* emerald-100 */
            
            .monthly-tile {
              border: 1px solid #ccc;
              padding: 10px;
            }
            
            .monthly-tile-label {
              font-size: 12px;
              color: #666;
              margin-bottom: 5px;
            }
            
            .monthly-tile-value {
              font-size: 18px;
              font-weight: bold;
            }
            
            .footer {
              margin-top: 30px;
              padding-top: 10px;
              border-top: 1px solid #ccc;
              font-size: 12px;
              text-align: center;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="timecard-container">
            <h1>${name ? `${name}'s Weekly Time Card` : 'Weekly Time Card'}</h1>
            <p>Generated: ${today}</p>
            
            <!-- Time Card Table -->
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Break</th>
                  <th>Total Time</th>
                  <th>Total Hours</th>
                </tr>
              </thead>
              <tbody>
                ${daysToShow.map(day => `
                  <tr class="${day.isOvertime ? 'overtime-row' : ''}">
                    <td>${day.day}</td>
                    <td>${day.start ? formatTimeForDisplay(day.start) : '-'}</td>
                    <td>${day.end ? formatTimeForDisplay(day.end) : '-'}</td>
                    <td>${day.break ? `${day.break}min` : '-'}</td>
                    <td>${day.formattedTime || '0:00'}</td>
                    <td>${day.decimalHours.toFixed(1)}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr class="summary-row">
                  <td colspan="4" style="text-align: right;">Regular Hours:</td>
                  <td>${results.regHoursFormatted}</td>
                  <td>${results.regularHours.toFixed(1)}</td>
                </tr>
                <tr class="summary-row">
                  <td colspan="4" style="text-align: right;">Overtime Hours:</td>
                  <td>${results.otHoursFormatted}</td>
                  <td>${results.overtimeHours.toFixed(1)}</td>
                </tr>
                <tr class="total-row total-row-highlight">
                  <td colspan="4" style="text-align: right;">Total Hours:</td>
                  <td>${results.totalHoursFormatted}</td>
                  <td>${results.totalHours.toFixed(1)}</td>
                </tr>
              </tfoot>
            </table>
            
            <!-- Weekly Summary & Financial Calculations -->
            <div class="grid-container">
              <div class="summary-section">
                <h3 class="summary-header">Weekly Summary</h3>
                <div class="data-row">
                  <span>Total Regular Hours:</span>
                  <span>${results.regularHours.toFixed(2)}</span>
                </div>
                <div class="data-row">
                  <span>Total Overtime Hours:</span>
                  <span>${results.overtimeHours.toFixed(2)}</span>
                </div>
                <div class="data-row total-row">
                  <span>Total Hours Worked:</span>
                  <span>${results.totalHours.toFixed(2)}</span>
                </div>
                
                <h4 style="margin-top: 20px;">Time Analysis</h4>
                <div class="data-row">
                  <span>Average Hours Per Day:</span>
                  <span>${results.avgHoursPerDay.toFixed(2)}</span>
                </div>
                <div class="data-row">
                  <span>Shortest Work Day:</span>
                  <span>${results.shortestDay.day} (${results.shortestDay.hours.toFixed(2)} hrs)</span>
                </div>
                <div class="data-row">
                  <span>Longest Work Day:</span>
                  <span>${results.longestDay.day} (${results.longestDay.hours.toFixed(2)} hrs)</span>
                </div>
              </div>
              
              ${formData.hourlyRate > 0 ? `
                <div class="summary-section">
                  <h3 class="summary-header">Financial Calculations</h3>
                  <div class="data-row">
                    <span>Regular Pay (${results.regularHours.toFixed(2)} hrs @ ${formatCurrency(formData.hourlyRate)}/hr):</span>
                    <span>${formatCurrency(results.regularPay)}</span>
                  </div>
                  
                  ${results.overtimeHours > 0 ? `
                    <div class="data-row">
                      <span>Overtime Pay (${results.overtimeHours.toFixed(2)} hrs @ ${formatCurrency(formData.hourlyRate * formData.overtimeMultiplier)}/hr):</span>
                      <span>${formatCurrency(results.overtimePay)}</span>
                    </div>
                  ` : ''}
                  
                  <div class="data-row total-row">
                    <span>Total Pay:</span>
                    <span>${formatCurrency(results.totalPay)}</span>
                  </div>
                  
                  ${results.overtimeHours > 0 ? `
                    <p style="font-size: 12px; color: #666; margin-top: 15px;">
                      Overtime calculated at ${formData.overtimeMultiplier}x regular rate
                    </p>
                  ` : ''}
                </div>
              ` : ''}
            </div>
            
            <!-- Monthly Projection -->
            ${formData.hourlyRate > 0 ? `
              <div class="summary-section">
                <h3 class="summary-header">Monthly Summary (4 weeks)</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                  <div class="monthly-tile" style="background-color: #ecfdf5; border: 1px solid #a7f3d0;">
                    <div class="monthly-tile-label">Regular Hours</div>
                    <div class="monthly-tile-value">${results.monthlyRegularHours.toFixed(2)}</div>
                  </div>
                  
                  <div class="monthly-tile" style="background-color: #ecfdf5; border: 1px solid #a7f3d0;">
                    <div class="monthly-tile-label">Overtime Hours</div>
                    <div class="monthly-tile-value">${results.monthlyOvertimeHours.toFixed(2)}</div>
                  </div>
                  
                  <div class="monthly-tile" style="background-color: #ecfdf5; border: 1px solid #a7f3d0;">
                    <div class="monthly-tile-label">Total Hours</div>
                    <div class="monthly-tile-value">${results.monthlyTotalHours.toFixed(2)}</div>
                  </div>
                  
                  <div class="monthly-tile" style="background-color: #fffbeb; border: 1px solid #fcd34d;">
                    <div class="monthly-tile-label">Monthly Pay</div>
                    <div class="monthly-tile-value">${formatCurrency(results.monthlyPay)}</div>
                  </div>
                </div>
              </div>
            ` : ''}
            
            <div class="footer">
              This time card was generated on ${today} • ${name ? name : 'Employee'} Work Hours Calculator
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Give the browser a moment to load the content before printing
    setTimeout(() => {
      printWindow.print();
      // Some browsers will close the window after printing, some won't
      // We can either leave it open or attempt to close it after a delay
      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.close();
        }
      }, 1000);
    }, 500);
  };

  // Generate TXT timecard
  const generateTXT = () => {
    if (!results) return;
    
    const title = name ? `${name}'s Weekly Time Card` : 'Weekly Time Card';
    const today = new Date();
    
    let content = `${title}\n`;
    content += `Generated: ${today.toLocaleDateString()}\n\n`;
    
    // Header
    content += 'Day        Start    End      Break    Total Time  Hours\n';
    content += '-----------------------------------------------------------\n';
    
    // Days
    const daysToShow = formData.showBlankDays 
      ? results.processedDays 
      : results.processedDays.filter(day => day.totalMinutes > 0);
    
    daysToShow.forEach(day => {
      content += `${day.day.padEnd(10)} `;
      content += `${day.start ? formatTimeForDisplay(day.start).padEnd(8) : '-'.padEnd(8)} `;
      content += `${day.end ? formatTimeForDisplay(day.end).padEnd(8) : '-'.padEnd(8)} `;
      content += `${day.break ? (day.break + 'min').padEnd(8) : '-'.padEnd(8)} `;
      content += `${day.formattedTime.padEnd(11)} `;
      content += `${day.decimalHours.toFixed(1)}\n`;
    });
    
    content += '-----------------------------------------------------------\n';
    content += `Regular Hours:                      ${results.regHoursFormatted.padEnd(11)} ${results.regularHours.toFixed(1)}\n`;
    content += `Overtime Hours:                     ${results.otHoursFormatted.padEnd(11)} ${results.overtimeHours.toFixed(1)}\n`;
    content += `TOTAL HOURS:                        ${results.totalHoursFormatted.padEnd(11)} ${results.totalHours.toFixed(1)}\n\n`;
    
    // Financial summary
    if (formData.hourlyRate) {
      content += 'FINANCIAL SUMMARY\n';
      content += '-----------------------------------------------------------\n';
      content += `Regular Pay (${results.regularHours.toFixed(2)} hrs @ $${formData.hourlyRate}/hr): $${results.regularPay.toFixed(2)}\n`;
      
      if (results.overtimeHours > 0) {
        content += `Overtime Pay (${results.overtimeHours.toFixed(2)} hrs @ $${(formData.hourlyRate * formData.overtimeMultiplier).toFixed(2)}/hr): $${results.overtimePay.toFixed(2)}\n`;
      }
      
      content += `TOTAL PAY: $${results.totalPay.toFixed(2)}\n\n`;
      
      // Monthly projection
      content += 'MONTHLY PROJECTION (4 weeks)\n';
      content += '-----------------------------------------------------------\n';
      content += `Regular Hours: ${results.monthlyRegularHours.toFixed(2)}\n`;
      content += `Overtime Hours: ${results.monthlyOvertimeHours.toFixed(2)}\n`;
      content += `Total Hours: ${results.monthlyTotalHours.toFixed(2)}\n`;
      content += `Projected Monthly Pay: $${results.monthlyPay.toFixed(2)}\n`;
    }
    
    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = name 
      ? `${name.replace(/\s+/g, '_')}_timecard.txt` 
      : 'timecard.txt';
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Determine which days to show based on settings
  const daysToShow = formData.showBlankDays 
    ? results.processedDays 
    : results.processedDays.filter(day => day.totalMinutes > 0);

  return (
    <div className="time-card-display">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-3">
          {name ? `${name}'s Weekly Time Card` : 'Weekly Time Card'}
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={printTimeCard}
            className="bg-gradient-to-br from-green-300 to-emerald-300 hover:bg-emerald-100 text-emerald-700 py-1 px-4 rounded border-2 border-emerald-500"
          >
            Print / Save as PDF
          </button>
          <button
            onClick={generateTXT}
            className="bg-skin-red-bg hover:bg-amber-100 text-amber-700 py-1 px-4 rounded border-2 border-amber-500"
          >
            Download TXT
          </button>
        </div>
      </div>

      {/* Time Card Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-4 overflow-x-auto border border-gray-200">
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="bg-emerald-50">
              <th className="p-3 border text-left font-semibold">Day</th>
              <th className="p-3 border text-left font-semibold">Start Time</th>
              <th className="p-3 border text-left font-semibold">End Time</th>
              <th className="p-3 border text-left font-semibold">Break</th>
              <th className="p-3 border text-left font-semibold">Total Time</th>
              <th className="p-3 border text-left font-semibold">Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {daysToShow.map((day, index) => (
              <tr 
                key={day.day} 
                className={`${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } ${
                  day.isOvertime ? 'bg-yellow-50' : ''
                }`}
              >
                <td className="p-3 border font-medium">{day.day}</td>
                <td className="p-3 border">{day.start ? formatTimeForDisplay(day.start) : '-'}</td>
                <td className="p-3 border">{day.end ? formatTimeForDisplay(day.end) : '-'}</td>
                <td className="p-3 border">{day.break ? `${day.break}min` : '-'}</td>
                <td className="p-3 border">{day.formattedTime || '0:00'}</td>
                <td className="p-3 border">{day.decimalHours.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 font-semibold">
            <tr>
              <td colSpan="4" className="p-3 border text-right">Regular Hours:</td>
              <td className="p-3 border">{results.regHoursFormatted}</td>
              <td className="p-3 border">{results.regularHours.toFixed(1)}</td>
            </tr>
            <tr>
              <td colSpan="4" className="p-3 border text-right">Overtime Hours:</td>
              <td className="p-3 border">{results.otHoursFormatted}</td>
              <td className="p-3 border">{results.overtimeHours.toFixed(1)}</td>
            </tr>
            <tr className="bg-emerald-100">
              <td colSpan="4" className="p-3 border text-right font-bold">Total Hours:</td>
              <td className="p-3 border font-bold">{results.totalHoursFormatted}</td>
              <td className="p-3 border font-bold">{results.totalHours.toFixed(1)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      {/* Back to Calculator Button - Below timesheet */}
      <div className="flex justify-center mb-6">
        <button
          onClick={onBack}
          className="bg-skin-red-light hover:bg-slate-100 text-slate-700 py-2 px-6 rounded border-2 border-slate-300"
        >
          Back to Calculator
        </button>
      </div>

      {/* Weekly Summary & Financial Calculations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Weekly Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Regular Hours:</span>
              <span className="font-medium">{results.regularHours.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Overtime Hours:</span>
              <span className="font-medium">{results.overtimeHours.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600 font-medium">Total Hours Worked:</span>
              <span className="font-bold">{results.totalHours.toFixed(2)}</span>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Time Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Hours Per Day:</span>
                  <span>{results.avgHoursPerDay.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shortest Work Day:</span>
                  <span>{results.shortestDay.day} ({results.shortestDay.hours.toFixed(2)} hrs)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Longest Work Day:</span>
                  <span>{results.longestDay.day} ({results.longestDay.hours.toFixed(2)} hrs)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {formData.hourlyRate > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Financial Calculations</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Regular Pay ({results.regularHours.toFixed(2)} hrs @ {formatCurrency(formData.hourlyRate)}/hr):
                </span>
                <span className="font-medium">{formatCurrency(results.regularPay)}</span>
              </div>
              
              {results.overtimeHours > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Overtime Pay ({results.overtimeHours.toFixed(2)} hrs @ {formatCurrency(formData.hourlyRate * formData.overtimeMultiplier)}/hr):
                  </span>
                  <span className="font-medium">{formatCurrency(results.overtimePay)}</span>
                </div>
              )}
              
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600 font-medium">Total Pay:</span>
                <span className="font-bold">{formatCurrency(results.totalPay)}</span>
              </div>
              
              {results.overtimeHours > 0 && (
                <div className="mt-4 text-sm text-gray-500">
                  Overtime calculated at {formData.overtimeMultiplier}x regular rate
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Monthly Projection */}
      {formData.hourlyRate > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Monthly Summary (4 weeks)</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-emerald-50 p-4 rounded">
              <div className="text-gray-500 text-sm">Regular Hours</div>
              <div className="text-2xl font-semibold">{results.monthlyRegularHours.toFixed(2)}</div>
            </div>
            
            <div className="bg-emerald-50 p-4 rounded">
              <div className="text-gray-500 text-sm">Overtime Hours</div>
              <div className="text-2xl font-semibold">{results.monthlyOvertimeHours.toFixed(2)}</div>
            </div>
            
            <div className="bg-emerald-50 p-4 rounded">
              <div className="text-gray-500 text-sm">Total Hours</div>
              <div className="text-2xl font-semibold">{results.monthlyTotalHours.toFixed(2)}</div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded border border-amber-100">
              <div className="text-gray-500 text-sm">Monthly Pay</div>
              <div className="text-2xl font-semibold">{formatCurrency(results.monthlyPay)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}