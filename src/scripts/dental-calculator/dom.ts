import type { Employee, OverheadCost, CalculatorInputs } from './types';

export function addEmployee(container: HTMLElement, title = '', salary = 0) {
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
  employeeDiv.querySelector('.remove-btn')?.addEventListener('click', () => employeeDiv.remove());
  container.appendChild(employeeDiv);
}

export function addOverheadCost(container: HTMLElement, name = '', amount = 0) {
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
  costDiv.querySelector('.remove-btn')?.addEventListener('click', () => costDiv.remove());
  container.appendChild(costDiv);
}

export function getInputs() {
  const employees = Array.from(document.querySelectorAll<HTMLElement>('.employee-row')).map(row => ({
    title: (row.querySelector('.employee-title') as HTMLInputElement).value,
    monthlySalary: Number((row.querySelector('.employee-salary') as HTMLInputElement).value)
  }));

  const overheadCosts = Array.from(document.querySelectorAll<HTMLElement>('.overhead-row')).map(row => ({
    name: (row.querySelector('.overhead-name') as HTMLInputElement).value,
    monthlyAmount: Number((row.querySelector('.overhead-amount') as HTMLInputElement).value)
  }));

  return {
    practiceName: (document.getElementById('practice-name') as HTMLInputElement)?.value || '',
    dentalChairs: Number((document.getElementById('dental-chairs') as HTMLInputElement)?.value || 0),
    patientsPerChair: Number((document.getElementById('patients-per-chair') as HTMLInputElement)?.value || 0),
    revenuePerPatient: Number((document.getElementById('revenue-per-patient') as HTMLInputElement)?.value || 0),
    daysPerWeek: Number((document.getElementById('days-per-week') as HTMLInputElement)?.value || 0),
    startupCosts: Number((document.getElementById('startup-costs') as HTMLInputElement)?.value || 0),
    employees,
    overhead: overheadCosts
  };
}
