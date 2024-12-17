import { defaultEmployees, defaultOverhead, scenarioDetails } from './constants';
import { calculateFinancials, calculateScenarios } from './calculations';
import { formatCurrency } from './formatters';
import { createSalaryChart, createProjectionChart } from './charts';
import { addEmployee, addOverheadCost, getInputs } from './dom';
import { downloadCSV } from './export';
import type { Scenarios } from './types';

let currentScenarios: Scenarios | null = null;
let salaryChart: Chart | null = null;
let roiChart: Chart | null = null;
let scenarioChart: Chart | null = null;

document.addEventListener('DOMContentLoaded', function() {
  const employeesContainer = document.getElementById('employees-container');
  const overheadContainer = document.getElementById('overhead-container');

  if (employeesContainer && overheadContainer) {
    // Initialize default values
    defaultEmployees.forEach(emp => addEmployee(employeesContainer, emp.title, emp.monthlySalary));
    defaultOverhead.forEach(cost => addOverheadCost(overheadContainer, cost.name, cost.monthlyAmount));

    // Add event listeners
    document.getElementById('add-employee')?.addEventListener('click', () => addEmployee(employeesContainer));
    document.getElementById('add-overhead')?.addEventListener('click', () => addOverheadCost(overheadContainer));
    document.getElementById('calculate-btn')?.addEventListener('click', calculateResults);
    document.getElementById('print-btn')?.addEventListener('click', () => window.print());
    document.getElementById('download-csv')?.addEventListener('click', () => {
      const inputs = getInputs();
      const projections = calculateFinancials(inputs);
      downloadCSV(inputs, projections);
    });

    // Scenario tabs
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        updateScenario(tab.dataset.scenario || 'current');
      });
    });
  }
});

function calculateResults() {
  const inputs = getInputs();
  const projections = calculateFinancials(inputs);
  currentScenarios = calculateScenarios(inputs);

  // Show results section
  const resultsElement = document.getElementById('results');
  if (resultsElement) {
    resultsElement.classList.remove('hidden');
  }

  // Update practice name
  const practiceNameElement = document.getElementById('results-practice-name');
  if (practiceNameElement) {
    practiceNameElement.textContent = inputs.practiceName;
  }

  // Update metrics
  updateMetrics(projections);

  // Update charts
  updateCharts(projections, inputs.employees);

  // Update scenario
  updateScenario('current');
}

function updateMetrics(projections) {
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
}

function updateCharts(projections, employees) {
  const salaryCtx = document.getElementById('salary-chart')?.getContext('2d');
  const roiCtx = document.getElementById('roi-chart')?.getContext('2d');

  if (salaryCtx) {
    if (salaryChart) salaryChart.destroy();
    salaryChart = createSalaryChart(salaryCtx, employees);
  }

  if (roiCtx) {
    if (roiChart) roiChart.destroy();
    roiChart = createProjectionChart(roiCtx, projections);
  }
}

function updateScenario(type: 'current' | 'best' | 'worst') {
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

  const ctx = document.getElementById('scenario-chart')?.getContext('2d');
  if (ctx) {
    if (scenarioChart) scenarioChart.destroy();
    scenarioChart = createProjectionChart(ctx, scenario);
  }

  const detailsList = document.getElementById('scenario-details');
  if (detailsList) {
    detailsList.innerHTML = scenarioDetails[type].map(detail => 
      `<li class="flex items-center gap-2">
        <span class="text-custom-active">•</span>
        ${detail}
      </li>`
    ).join('');
  }
}
