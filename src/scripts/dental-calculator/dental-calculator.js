document.addEventListener('DOMContentLoaded', function() {
  // Initialize default employees and overhead costs
  const defaultEmployees = [
    { title: 'Dentist', monthlySalary: 19141 },
    { title: 'Hygienist', monthlySalary: 8164.80 },
    { title: 'Certified Dental Assistant', monthlySalary: 4160 },
    { title: 'Administrative Staff', monthlySalary: 3360 }
  ];

  const defaultOverhead = [
    { name: 'Monthly Lease/Mortgage', monthlyAmount: 5000 },
    { name: 'Utilities', monthlyAmount: 800 },
    { name: 'Supplies', monthlyAmount: 2000 },
    { name: 'Marketing Budget', monthlyAmount: 3500 },
    { name: 'Monthly Loan Repayment', monthlyAmount: 5000 }
  ];

  let currentScenarios = null;
  let salaryChart = null;
  let roiChart = null;
  let scenarioChart = null;

  // Initialize employees
  defaultEmployees.forEach(employee => addEmployee(employee.title, employee.monthlySalary));

  // Initialize overhead costs
  defaultOverhead.forEach(cost => addOverheadCost(cost.name, cost.monthlyAmount));

  // Event Listeners
  document.getElementById('add-employee')?.addEventListener('click', () => addEmployee());
  document.getElementById('add-overhead')?.addEventListener('click', () => addOverheadCost());
  document.getElementById('calculate-btn')?.addEventListener('click', calculateResults);
  document.getElementById('print-btn')?.addEventListener('click', () => window.print());
  document.getElementById('download-csv')?.addEventListener('click', downloadCSV);

  // Scenario tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      updateScenario(tab.dataset.scenario);
    });
  });

  function addEmployee(title = '', salary = 0) {
    const employeeDiv = document.createElement('div');
    employeeDiv.className = 'employee-row grid grid-cols-3 gap-4 items-end';
    employeeDiv.innerHTML = `
      <div>
        <label class="block text-sm font-medium text-skin-base">Title</label>
        <input type="text" class="employee-title mt-1 block w-full rounded-md border-skin-base" value="${title}">
      </div>
      <div>
        <label class="block text-sm font-medium text-skin-base">Monthly Salary ($)</label>
        <input type="number" class="employee-salary mt-1 block w-full rounded-md border-skin-base" value="${salary}" min="0">
      </div>
      <button type="button" class="remove-btn p-2 text-red-500 hover:text-red-700">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
      </button>
    `;
    employeeDiv.querySelector('.remove-btn').addEventListener('click', () => employeeDiv.remove());
    document.getElementById('employees-container')?.appendChild(employeeDiv);
  }

  function addOverheadCost(name = '', amount = 0) {
    const costDiv = document.createElement('div');
    costDiv.className = 'overhead-row grid grid-cols-3 gap-4 items-end';
    costDiv.innerHTML = `
      <div>
        <label class="block text-sm font-medium text-skin-base">Expense Name</label>
        <input type="text" class="overhead-name mt-1 block w-full rounded-md border-skin-base" value="${name}">
      </div>
      <div>
        <label class="block text-sm font-medium text-skin-base">Monthly Amount ($)</label>
        <input type="number" class="overhead-amount mt-1 block w-full rounded-md border-skin-base" value="${amount}" min="0">
      </div>
      <button type="button" class="remove-btn p-2 text-red-500 hover:text-red-700">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
      </button>
    `;
    costDiv.querySelector('.remove-btn').addEventListener('click', () => costDiv.remove());
    document.getElementById('overhead-container')?.appendChild(costDiv);
  }

  function getInputs() {
    const employees = Array.from(document.querySelectorAll('.employee-row')).map(row => ({
      title: row.querySelector('.employee-title').value,
      monthlySalary: Number(row.querySelector('.employee-salary').value)
    }));

    const overheadCosts = Array.from(document.querySelectorAll('.overhead-row')).map(row => ({
      name: row.querySelector('.overhead-name').value,
      monthlyAmount: Number(row.querySelector('.overhead-amount').value)
    }));

    return {
      practiceName: document.getElementById('practice-name')?.value || '',
      dentalChairs: Number(document.getElementById('dental-chairs')?.value || 0),
      patientsPerChair: Number(document.getElementById('patients-per-chair')?.value || 0),
      revenuePerPatient: Number(document.getElementById('revenue-per-patient')?.value || 0),
      daysPerWeek: Number(document.getElementById('days-per-week')?.value || 0),
      startupCosts: Number(document.getElementById('startup-costs')?.value || 0),
      employees,
      overheadCosts
    };
  }

  function calculateFinancials(inputs) {
    const monthlyPatientsPerChair = inputs.patientsPerChair * inputs.daysPerWeek * 4;
    const totalMonthlyPatients = monthlyPatientsPerChair * inputs.dentalChairs;
    const monthlyRevenue = totalMonthlyPatients * inputs.revenuePerPatient;
    
    const totalMonthlySalaries = inputs.employees.reduce((sum, emp) => sum + emp.monthlySalary, 0);
    const totalMonthlyOverhead = inputs.overheadCosts.reduce((sum, cost) => sum + cost.monthlyAmount, 0);
    
    const monthlyOverhead = totalMonthlySalaries + totalMonthlyOverhead;
    const monthlyNetIncome = monthlyRevenue - monthlyOverhead;
    
    const annualRevenue = monthlyRevenue * 12;
    const annualOverhead = monthlyOverhead * 12;
    const profitMargin = (monthlyNetIncome / monthlyRevenue) * 100;

    return {
      monthlyRevenue,
      annualRevenue,
      monthlyOverhead,
      annualOverhead,
      netIncome: monthlyNetIncome,
      profitMargin,
      yearlyProjections: Array(5).fill(0).map((_, i) => monthlyNetIncome * 12 * (1 + (i * 0.1)))
    };
  }

  function calculateScenarios(inputs) {
    const current = calculateFinancials(inputs);
    
    const bestCase = calculateFinancials({
      ...inputs,
      patientsPerChair: inputs.patientsPerChair + 2,
      daysPerWeek: Math.min(inputs.daysPerWeek + 1, 7)
    });

    const worstCase = calculateFinancials({
      ...inputs,
      patientsPerChair: Math.ceil(inputs.patientsPerChair * 0.75),
      revenuePerPatient: inputs.revenuePerPatient * 0.75
    });

    return { current, bestCase, worstCase };
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  function updateCharts(projections, employees) {
    const salaryCtx = document.getElementById('salary-chart')?.getContext('2d');
    if (salaryChart) salaryChart.destroy();
    if (salaryCtx) {
      salaryChart = new Chart(salaryCtx, {
        type: 'pie',
        data: {
          labels: employees.map(emp => emp.title),
          datasets: [{
            data: employees.map(emp => emp.monthlySalary),
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56',
              '#4BC0C0', '#9966FF', '#FF9F40'
            ]
          }]
        }
      });
    }

    const roiCtx = document.getElementById('roi-chart')?.getContext('2d');
    if (roiChart) roiChart.destroy();
    if (roiCtx) {
      roiChart = new Chart(roiCtx, {
        type: 'line',
        data: {
          labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
          datasets: [{
            label: 'Projected Annual Profit',
            data: projections.yearlyProjections,
            borderColor: '#4BC0C0',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: value => formatCurrency(value)
              }
            }
          }
        }
      });
    }
  }

  function updateScenarioChart(scenario) {
    const ctx = document.getElementById('scenario-chart')?.getContext('2d');
    if (scenarioChart) scenarioChart.destroy();
    if (ctx) {
      scenarioChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
          datasets: [{
            label: 'Projected Annual Profit',
            data: scenario.yearlyProjections,
            borderColor: '#4BC0C0',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: value => formatCurrency(value)
              }
            }
          }
        }
      });
    }
  }

  function updateScenario(type) {
    if (!currentScenarios) return;
    
    const scenario = currentScenarios[type === 'best' ? 'bestCase' : 
                     type === 'worst' ? 'worstCase' : 'current'];
                     
    const metricsContainer = document.querySelector('.scenario-metrics');
    if (metricsContainer) {
      metricsContainer.innerHTML = `
        <div class="p-4 bg-skin-secondary rounded-lg">
          <h3 class="text-lg font-semibold text-skin-base">Monthly Revenue</h3>
          <p class="text-2xl font-bold text-custom-active">${formatCurrency(scenario.monthlyRevenue)}</p>
        </div>
        <div class="p-4 bg-skin-secondary rounded-lg">
          <h3 class="text-lg font-semibold text-skin-base">Net Income</h3>
          <p class="text-2xl font-bold text-custom-active">${formatCurrency(scenario.netIncome)}</p>
        </div>
        <div class="p-4 bg-skin-secondary rounded-lg">
          <h3 class="text-lg font-semibold text-skin-base">Profit Margin</h3>
          <p class="text-2xl font-bold text-custom-active">${scenario.profitMargin.toFixed(1)}%</p>
        </div>
      `;
    }

    updateScenarioChart(scenario);
    updateScenarioDetails(type);
  }

  function updateScenarioDetails(type) {
    const details = {
      current: [
        'Based on current inputs and operational parameters',
        'Standard market conditions',
        'Current patient volume levels'
      ],
      best: [
        'Additional 2 patients per chair per day',
        'Operating 6 days per week (if possible)',
        'Maximum capacity utilization'
      ],
      worst: [
        '25% reduction in patient volume',
        '25% reduction in revenue per patient',
        'Conservative market estimates'
      ]
    };

    const detailsList = document.getElementById('scenario-details');
    if (detailsList) {
      detailsList.innerHTML = details[type].map(detail => 
        `<li class="flex items-center gap-2">
          <span class="text-custom-active">•</span>
          ${detail}
        </li>`
      ).join('');
    }
  }

  function calculateResults() {
    const inputs = getInputs();
    const projections = calculateFinancials(inputs);
    currentScenarios = calculateScenarios(inputs);

    const resultsElement = document.getElementById('results');
    if (resultsElement) {
      resultsElement.classList.remove('hidden');
    }

    const practiceNameElement = document.getElementById('results-practice-name');
    if (practiceNameElement) {
      practiceNameElement.textContent = inputs.practiceName;
    }

    const metricsContainer = document.querySelector('#results .grid');
    if (metricsContainer) {
      metricsContainer.innerHTML = `
        <div class="p-4 bg-skin-secondary rounded-lg">
          <h3 class="text-lg font-semibold text-skin-base">Monthly Revenue</h3>
          <p class="text-2xl font-bold text-custom-active">${formatCurrency(projections.monthlyRevenue)}</p>
        </div>
        <div class="p-4 bg-skin-secondary rounded-lg">
          <h3 class="text-lg font-semibold text-skin-base">Annual Revenue</h3>
          <p class="text-2xl font-bold text-custom-active">${formatCurrency(projections.annualRevenue)}</p>
        </div>
        <div class="p-4 bg-skin-secondary rounded-lg">
          <h3 class="text-lg font-semibold text-skin-base">Net Income (Monthly)</h3>
          <p class="text-2xl font-bold text-custom-active">${formatCurrency(projections.netIncome)}</p>
        </div>
        <div class="p-4 bg-skin-secondary rounded-lg">
          <h3 class="text-lg font-semibold text-skin-base">Monthly Overhead</h3>
          <p class="text-2xl font-bold text-custom-active">${formatCurrency(projections.monthlyOverhead)}</p>
        </div>
        <div class="p-4 bg-skin-secondary rounded-lg">
          <h3 class="text-lg font-semibold text-skin-base">Annual Overhead</h3>
          <p class="text-2xl font-bold text-custom-active">${formatCurrency(projections.annualOverhead)}</p>
        </div>
        <div class="p-4 bg-skin-secondary rounded-lg">
          <h3 class="text-lg font-semibold text-skin-base">Profit Margin</h3>
          <p class="text-2xl font-bold text-custom-active">${projections.profitMargin.toFixed(1)}%</p>
        </div>
      `;
    }

    updateCharts(projections, inputs.employees);
    updateScenario('current');
  }

  function downloadCSV() {
    const inputs = getInputs();
    const projections = calculateFinancials(inputs);
    
    const rows = [
      ['Dental Practice Financial Report'],
      [`Practice Name: ${inputs.practiceName}`],
      [''],
      ['Financial Metrics'],
      ['Metric,Value'],
      [`Monthly Revenue,${projections.monthlyRevenue}`],
      [`Annual Revenue,${projections.annualRevenue}`],
      [`Monthly Overhead,${projections.monthlyOverhead}`],
      [`Annual Overhead,${projections.annualOverhead}`],
      [`Net Income (Monthly),${projections.netIncome}`],
      [`Profit Margin,${projections.profitMargin.toFixed(1)}%`],
      [''],
      ['Employee Salaries'],
      ['Title,Monthly Salary'],
      ...inputs.employees.map(emp => `${emp.title},${emp.monthlySalary}`),
      [''],
      ['Overhead Costs'],
      ['Expense,Monthly Amount'],
      ...inputs.overheadCosts.map(cost => `${cost.name},${cost.monthlyAmount}`),
      [''],
      ['5 Year Projections'],
      ['Year,Projected Profit'],
      ...projections.yearlyProjections.map((profit, i) => `Year ${i + 1},${profit}`)
    ];

    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, 'dental-practice-projections.csv');
    } else {
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'dental-practice-projections.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
});
