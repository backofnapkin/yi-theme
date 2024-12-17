import type { Employee, FinancialProjections } from './types';
import { formatCurrency } from './formatters';

export function createSalaryChart(ctx: CanvasRenderingContext2D, employees: Employee[]) {
  return new Chart(ctx, {
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

export function createProjectionChart(ctx: CanvasRenderingContext2D, projections: FinancialProjections) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
      datasets: [{
        label: 'Projected Annual Profit',
        data: projections.yearlyProjections,
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => formatCurrency(Number(value))
          }
        }
      }
    }
  });
}
