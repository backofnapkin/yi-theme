import { defaultEmployees, defaultOverhead, scenarioDetails } from './constants';
import { calculateFinancials, calculateScenarios } from './calculations';
import { formatCurrency } from './formatters';
import { createSalaryChart, createProjectionChart } from './charts';
import { addEmployee, addOverheadCost, getInputs } from './dom';
import { downloadCSV } from './export';
import { validateInputs } from './validation';
import type { Scenarios } from './types';

let currentScenarios: Scenarios | null = null;
let salaryChart: Chart | null = null;
let roiChart: Chart | null = null;
let scenarioChart: Chart | null = null;

document.addEventListener('DOMContentLoaded', function() {
  initializeCalculator();
});

function initializeCalculator() {
  const employeesContainer = document.getElementById('employees-container');
  const overheadContainer = document.getElementById('overhead-container');

  if (!employeesContainer || !overheadContainer) return;

  // Initialize default values
  initializeDefaultValues(employeesContainer, overheadContainer);

  // Set up event listeners
  setupEventListeners(employeesContainer, overheadContainer);
}

function initializeDefaultValues(employeesContainer: HTMLElement, overheadContainer: HTMLElement) {
  defaultEmployees.forEach(emp => addEmployee(employeesContainer, emp.title, emp.monthlySalary));
  defaultOverhead.forEach(cost => addOverheadCost(overheadContainer, cost.name, cost.monthlyAmount));
}

function setupEventListeners(employeesContainer: HTMLElement, overheadContainer: HTMLElement) {
  // Add employee and overhead buttons
  document.getElementById('add-employee')?.addEventListener('click', () => 
    addEmployee(employeesContainer));
  document.getElementById('add-overhead')?.addEventListener('click', () => 
    addOverheadCost(overheadContainer));

  // Calculate, print, and export buttons
  document.getElementById('calculate-btn')?.addEventListener('click', calculateResults);
  document.getElementById('print-btn')?.addEventListener('click', () => window.print());
  document.getElementById('download-csv')?.addEventListener('click', handleExport);

  // Scenario tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => handleScenarioChange(tab));
  });
}

function handleScenarioChange(tab: Element) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  updateScenario(tab.getAttribute('data-scenario') as 'current' | 'best' | 'worst' || 'current');
}

function handleExport() {
  const inputs = getInputs();
  const projections = calculateFinancials(inputs);
  downloadCSV(inputs, projections);
}

function calculateResults() {
  const inputs = getInputs();
  
  // Validate inputs
  const errors = validateInputs(inputs);
  if (errors.length > 0) {
    alert('Please correct the following errors:\n\n' + errors.join('\n'));
    return;
  }

  // Calculate projections and scenarios
  const projections = calculateFinancials(inputs);
  currentScenarios = calculateScenarios(inputs);

  // Update UI
  showResults();
  updatePracticeName(inputs.practiceName);
  updateMetrics(projections);
  updateCharts(projections, inputs.employees);
  updateScenario('current');
}

function showResults() {
  const resultsElement = document.getElementById('results');
  if (resultsElement) {
    resultsElement.classList.remove('hidden');
  }
}

function updatePracticeName(name: string) {
  const practiceNameElement = document.getElementById('results-practice-name');
  if (practiceNameElement) {
    practiceNameElement.textContent = name;
  }
}

// ... rest of your existing update functions (updateMetrics, updateCharts, updateScenario) ...

// Add error handling wrapper
function safeExecute<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch (error) {
    console.error('Error in calculator:', error);
    return fallback;
  }
}