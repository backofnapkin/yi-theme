// Constants
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  const ampm = i < 12 ? 'AM' : 'PM';
  return `${hour}:00 ${ampm}`;
});

// Utility functions
const parseTime = (timeStr) => {
  if (!timeStr) return 0;
  const [time, period] = timeStr.split(' ');
  let [hours] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours;
};

const formatTime = (hours) => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours}:${minutes.toString().padStart(2, '0')}`;
};

const getDefaultEntry = (day) => {
  if (day === 'Saturday' || day === 'Sunday') {
    return {
      from: '',
      to: '',
      breakMinutes: 0,
    };
  }
  return {
    from: '9:00 AM',
    to: '5:00 PM',
    breakMinutes: 30,
  };
};

// State management
let state = {
  name: '',
  entries: DAYS.map(day => ({ ...getDefaultEntry(day), day })),
  basePayRate: 35.00,
  overtimeRate: 1.5,
  showBlankDays: true,
  showMonthly: false,
  summary: null
};

// DOM Elements
const calculator = document.createElement('div');
calculator.className = 'time-card-calculator';

// Initialize calculator
const initializeCalculator = () => {
  calculator.innerHTML = `
    <div class="header">
      <h1>Time Card Calculator</h1>
      <button class="btn btn-secondary" id="resetButton">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
        </svg>
        Reset
      </button>
    </div>

    <div class="form-group">
      <label for="name">Name</label>
      <input type="text" id="name" value="${state.name}" />
    </div>

    <table>
      <thead>
        <tr>
          <th>Day</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Break</th>
        </tr>
      </thead>
      <tbody>
        ${DAYS.map((day, index) => `
          <tr class="${index >= 5 ? 'weekend' : ''}">
            <td>${day.slice(0, 3)}</td>
            <td>
              <select class="time-select" data-day="${index}" data-type="from">
                <option value="">No hours</option>
                ${TIME_OPTIONS.map(time => `
                  <option value="${time}" ${state.entries[index].from === time ? 'selected' : ''}>
                    ${time}
                  </option>
                `).join('')}
              </select>
            </td>
            <td>
              <select class="time-select" data-day="${index}" data-type="to">
                <option value="">No hours</option>
                ${TIME_OPTIONS.map(time => `
                  <option value="${time}" ${state.entries[index].to === time ? 'selected' : ''}>
                    ${time}
                  </option>
                `).join('')}
              </select>
            </td>
            <td>
              <input type="number" class="break-input" data-day="${index}"
                value="${state.entries[index].breakMinutes}" min="0" />
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <button class="btn btn-secondary mb-4" id="copyWeekday">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      Copy Monday to Friday
    </button>

    <div class="grid">
      <div class="form-group">
        <h3>Payment Settings</h3>
        <label>Base Pay Rate</label>
        <div class="input-group">
          <span class="currency">$</span>
          <input type="number" id="basePayRate" value="${state.basePayRate}" min="0" max="100" step="0.01" />
          <span class="suffix">/hr</span>
        </div>

        <label>Overtime Rate Multiplier</label>
        <input type="number" id="overtimeRate" value="${state.overtimeRate}" step="0.1" min="1" />
      </div>

      <div class="form-group">
        <h3>Display Options</h3>
        <label class="checkbox-label">
          <input type="checkbox" id="showBlankDays" ${state.showBlankDays ? 'checked' : ''} />
          <span>Show blank days in report</span>
        </label>

        <label class="checkbox-label">
          <input type="checkbox" id="showMonthly" ${state.showMonthly ? 'checked' : ''} />
          <span>Show monthly summary</span>
        </label>
      </div>
    </div>

    <button class="btn btn-primary" id="calculateButton">Calculate</button>

    <div id="summary"></div>
  `;

  // Attach event listeners
  attachEventListeners();
};

// Event listeners
const attachEventListeners = () => {
  // Name input
  calculator.querySelector('#name').addEventListener('input', (e) => {
    state.name = e.target.value;
  });

  // Time selects
  calculator.querySelectorAll('.time-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const day = parseInt(e.target.dataset.day);
      const type = e.target.dataset.type;
      state.entries[day][type] = e.target.value;
    });
  });

  // Break inputs
  calculator.querySelectorAll('.break-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const day = parseInt(e.target.dataset.day);
      state.entries[day].breakMinutes = parseInt(e.target.value) || 0;
    });
  });

  // Copy weekday button
  calculator.querySelector('#copyWeekday').addEventListener('click', () => {
    const mondayData = state.entries[0];
    for (let i = 1; i < 5; i++) {
      state.entries[i] = { ...mondayData, day: DAYS[i] };
    }
    initializeCalculator();
  });

  // Calculate button
  calculator.querySelector('#calculateButton').addEventListener('click', calculateHours);

  // Reset button
  calculator.querySelector('#resetButton').addEventListener('click', () => {
    state = {
      name: '',
      entries: DAYS.map(day => ({ ...getDefaultEntry(day), day })),
      basePayRate: 35.00,
      overtimeRate: 1.5,
      showBlankDays: true,
      showMonthly: false,
      summary: null
    };
    initializeCalculator();
  });

  // Settings inputs
  calculator.querySelector('#basePayRate').addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      state.basePayRate = Math.min(Math.max(0, value), 100);
    }
  });

  calculator.querySelector('#overtimeRate').addEventListener('input', (e) => {
    state.overtimeRate = parseFloat(e.target.value) || 1.5;
  });

  calculator.querySelector('#showBlankDays').addEventListener('change', (e) => {
    state.showBlankDays = e.target.checked;
  });

  calculator.querySelector('#showMonthly').addEventListener('change', (e) => {
    state.showMonthly = e.target.checked;
  });
};

// Calculate hours
const calculateHours = () => {
  const dailyHours = state.entries.map(entry => {
    if (!entry.from || !entry.to) {
      return {
        day: entry.day,
        startTime: '-',
        endTime: '-',
        breakTime: '-',
        totalTime: '0:00',
        totalDecimal: 0
      };
    }

    const startHour = parseTime(entry.from);
    const endHour = parseTime(entry.to);
    let totalHours = endHour - startHour;
    
    // Adjust for overnight shifts
    if (totalHours < 0) {
      totalHours += 24;
    }

    // Subtract break time
    const breakHours = entry.breakMinutes / 60;
    totalHours -= breakHours;

    return {
      day: entry.day,
      startTime: entry.from,
      endTime: entry.to,
      breakTime: entry.breakMinutes ? `${entry.breakMinutes}min` : '-',
      totalTime: formatTime(totalHours),
      totalDecimal: Number(totalHours.toFixed(2))
    };
  });

  const totalRegularHours = dailyHours.reduce((sum, day) => sum + day.totalDecimal, 0);
  const regularHours = Math.min(totalRegularHours, 40);
  const overtimeHours = Math.max(0, totalRegularHours - 40);

  state.summary = {
    regularHours: Number(regularHours.toFixed(2)),
    overtimeHours: Number(overtimeHours.toFixed(2)),
    totalHours: Number((regularHours + overtimeHours).toFixed(2)),
    regularPay: Number((regularHours * state.basePayRate).toFixed(2)),
    overtimePay: Number((overtimeHours * state.basePayRate * state.overtimeRate).toFixed(2)),
    totalPay: Number(((regularHours * state.basePayRate) + (overtimeHours * state.basePayRate * state.overtimeRate)).toFixed(2)),
    averageHoursPerDay: Number((totalRegularHours / dailyHours.filter(day => day.totalDecimal > 0).length || 0).toFixed(2)),
    shortestDay: Number((Math.min(...dailyHours.filter(day => day.totalDecimal > 0).map(day => day.totalDecimal)) || 0).toFixed(2)),
    longestDay: Number((Math.max(...dailyHours.map(day => day.totalDecimal))).toFixed(2)),
    daysWithOvertime: dailyHours.filter(day => day.totalDecimal > 8).map(day => day.day),
    dailyHours
  };

  displaySummary();
};

// Display summary
const displaySummary = () => {
  if (!state.summary) return;

  const summaryDiv = calculator.querySelector('#summary');
  summaryDiv.innerHTML = `
    <div class="mt-8 bg-white rounded-lg p-6 border border-gray-200">
      <div class="flex flex-col gap-4 mb-4">
        <h2 class="text-xl font-bold">
          ${state.name ? `${state.name}'s ` : ''}Weekly Time Card
        </h2>
        <div class="flex flex-col sm:flex-row gap-2">
          <button class="btn btn-secondary" id="downloadTxt">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Download TXT
          </button>
          <button class="btn btn-primary" id="downloadPdf">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      <div class="overflow-x-auto mb-6">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Day</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Start Time</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">End Time</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Break</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Time</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Hours</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            ${state.summary.dailyHours.map((day) => `
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm">${day.day}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">${day.startTime}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">${day.endTime}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">${day.breakTime}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">${day.totalTime}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">${day.totalDecimal}</td>
              </tr>
            `).join('')}
            <tr class="bg-gray-50">
              <td colspan="4" class="px-6 py-4 whitespace-nowrap text-sm font-medium">Regular Hours</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">${formatTime(state.summary.regularHours)}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">${state.summary.regularHours}</td>
            </tr>
            <tr class="bg-gray-50">
              <td colspan="4" class="px-6 py-4 whitespace-nowrap text-sm font-medium">Overtime Hours</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">${formatTime(state.summary.overtimeHours)}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">${state.summary.overtimeHours}</td>
            </tr>
            <tr class="bg-gray-100">
              <td colspan="4" class="px-6 py-4 whitespace-nowrap text-sm font-bold">Total Hours</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold">${formatTime(state.summary.totalHours)}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold">${state.summary.totalHours}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 class="font-medium mb-2">Hours Summary</h3>
          <dl class="space-y-1">
            <div class="flex justify-between">
              <dt>Regular Hours:</dt>
              <dd>${state.summary.regularHours}</dd>
            </div>
            <div class="flex justify-between">
              <dt>Overtime Hours:</dt>
              <dd>${state.summary.overtimeHours}</dd>
            </div>
            <div class="flex justify-between font-medium">
              <dt>Total Hours:</dt>
              <dd>${state.summary.totalHours}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 class="font-medium mb-2">Payment Summary</h3>
          <dl class="space-y-1">
            <div class="flex justify-between">
              <dt>Regular Pay:</dt>
              <dd>$${state.summary.regularPay.toFixed(2)}</dd>
            </div>
            <div class="flex justify-between">
              <dt>Overtime Pay:</dt>
              <dd>$${state.summary.overtimePay.toFixed(2)}</dd>
            </div>
            <div class="flex justify-between font-medium">
              <dt>Total Pay:</dt>
              <dd>$${state.summary.totalPay.toFixed(2)}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 class="font-medium mb-2">Time Analysis</h3>
          <dl class="space-y-1">
            <div class="flex justify-between">
              <dt>Average Hours/Day:</dt>
              <dd>${state.summary.averageHoursPerDay.toFixed(1)}</dd>
            </div>
            <div class="flex justify-between">
              <dt>Shortest Day:</dt>
              <dd>${state.summary.shortestDay} hours</dd>
            </div>
            <div class="flex justify-between">
              <dt>Longest Day:</dt>
              <dd>${state.summary.longestDay} hours</dd>
            </div>
          </dl>
        </div>
      </div>

      ${state.showMonthly ? `
        <div class="mt-6 pt-6 border-t border-gray-200">
          <h3 class="font-medium mb-2">Monthly Projection (4 weeks)</h3>
          <dl class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex justify-between">
              <dt>Regular Hours:</dt>
              <dd>${(state.summary.regularHours * 4).toFixed(1)}</dd>
            </div>
            <div class="flex justify-between">
              <dt>Overtime Hours:</dt>
              <dd>${(state.summary.overtimeHours * 4).toFixed(1)}</dd>
            </div>
            <div class="flex justify-between font-medium">
              <dt>Total Pay:</dt>
              <dd>$${(state.summary.totalPay * 4).toFixed(2)}</dd>
            </div>
          </dl>
        </div>
      ` : ''}
    </div>
  `;

  // Attach download handlers
  summaryDiv.querySelector('#downloadTxt').addEventListener('click', downloadTxtReport);
  summaryDiv.querySelector('#downloadPdf').addEventListener('click', downloadPdfReport);
};

// Download functions
const downloadTxtReport = () => {
  if (!state.summary) return;

  let content = `Time Card Report - ${new Date().toLocaleDateString()}\n`;
  content += `Employee: ${state.name || 'Not Specified'}\n\n`;
  
  content += 'Daily Hours:\n';
  content += '----------------------------------------\n';
  state.summary.dailyHours.forEach(day => {
    content += `${day.day.padEnd(10)}\t`;
    content += `${day.startTime.padEnd(8)}\t`;
    content += `${day.endTime.padEnd(8)}\t`;
    content += `${day.breakTime.padEnd(6)}\t`;
    content += `${day.totalTime.padEnd(5)}\t`;
    content += `${day.totalDecimal}\n`;
  });
  
  content += '\nSummary:\n';
  content += '----------------------------------------\n';
  content += `Regular Hours: ${state.summary.regularHours}\n`;
  content += `Overtime Hours: ${state.summary.overtimeHours}\n`;
  content += `Total Hours: ${state.summary.totalHours}\n\n`;
  
  content += 'Payment Details:\n';
  content += '----------------------------------------\n';
  content += `Regular Pay: $${state.summary.regularPay.toFixed(2)}\n`;
  content += `Overtime Pay: $${state.summary.overtimePay.toFixed(2)}\n`;
  content += `Total Pay: $${state.summary.totalPay.toFixed(2)}\n\n`;
  
  content += 'Time Analysis:\n';
  content += '----------------------------------------\n';
  content += `Average Hours/Day: ${state.summary.averageHoursPerDay.toFixed(1)}\n`;
  content += `Shortest Day: ${state.summary.shortestDay} hours\n`;
  content += `Longest Day: ${state.summary.longestDay} hours\n`;

  if (state.showMonthly) {
    content += '\nMonthly Projection (4 weeks):\n';
    content += '----------------------------------------\n';
    content += `Regular Hours: ${(state.summary.regularHours * 4).toFixed(1)}\n`;
    content += `Overtime Hours: ${(state.summary.overtimeHours * 4).toFixed(1)}\n`;
    content += `Total Pay: $${(state.summary.totalPay * 4).toFixed(2)}\n`;
  }

  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `timecard-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

const downloadPdfReport = () => {
  if (!state.summary) return;
  
  // Check if jsPDF is available in the global scope
  if (typeof window.jspdf === 'undefined') {
    console.error('jsPDF library not loaded');
    return;
  }

  // Create new document
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(16);
  doc.text(`Time Card Report - ${new Date().toLocaleDateString()}`, 20, 20);
  
  // Employee name
  doc.setFontSize(12);
  doc.text(`Employee: ${state.name || 'Not Specified'}`, 20, 30);
  
  // Daily hours table
  let y = 50;
  doc.setFontSize(10);
  
  // Table headers
  const headers = ['Day', 'Start', 'End', 'Break', 'Total'];
  const colWidths = [25, 25, 25, 25, 25];
  let x = 20;
  
  headers.forEach((header, i) => {
    doc.text(header, x, y);
    x += colWidths[i];
  });
  
  y += 10;
  
  // Table rows
  state.summary.dailyHours.forEach(day => {
    x = 20;
    doc.text(day.day, x, y);
    x += colWidths[0];
    doc.text(day.startTime, x, y);
    x += colWidths[1];
    doc.text(day.endTime, x, y);
    x += colWidths[2];
    doc.text(day.breakTime, x, y);
    x += colWidths[3];
    doc.text(day.totalTime, x, y);
    y += 7;
  });
  
  y += 10;
  
  // Summary section
  doc.setFontSize(12);
  doc.text('Summary', 20, y);
  y += 7;
  doc.setFontSize(10);
  doc.text(`Regular Hours: ${state.summary.regularHours}`, 20, y);
  y += 7;
  doc.text(`Overtime Hours: ${state.summary.overtimeHours}`, 20, y);
  y += 7;
  doc.text(`Total Hours: ${state.summary.totalHours}`, 20, y);
  
  y += 15;
  
  // Payment section
  doc.setFontSize(12);
  doc.text('Payment Details', 20, y);
  y += 7;
  doc.setFontSize(10);
  doc.text(`Regular Pay: $${state.summary.regularPay.toFixed(2)}`, 20, y);
  y += 7;
  doc.text(`Overtime Pay: $${state.summary.overtimePay.toFixed(2)}`, 20, y);
  y += 7;
  doc.text(`Total Pay: $${state.summary.totalPay.toFixed(2)}`, 20, y);
  
  if (state.showMonthly) {
    y += 15;
    doc.setFontSize(12);
    doc.text('Monthly Projection (4 weeks)', 20, y);
    y += 7;
    doc.setFontSize(10);
    doc.text(`Regular Hours: ${(state.summary.regularHours * 4).toFixed(1)}`, 20, y);
    y += 7;
    doc.text(`Overtime Hours: ${(state.summary.overtimeHours * 4).toFixed(1)}`, 20, y);
    y += 7;
    doc.text(`Total Pay: $${(state.summary.totalPay * 4).toFixed(2)}`, 20, y);
  }

  doc.save('timecard-report.pdf');
};

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('timeCardCalculator');
  if (container) {
    container.appendChild(calculator);
    initializeCalculator();
  }
});