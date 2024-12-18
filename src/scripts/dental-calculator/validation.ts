import type { CalculatorInputs } from './types';

export function validateInputs(inputs: Partial<CalculatorInputs>): string[] {
  const errors: string[] = [];

  if (!inputs.practiceName?.trim()) {
    errors.push('Practice name is required');
  }

  if (!inputs.dentalChairs || inputs.dentalChairs < 1) {
    errors.push('Number of dental chairs must be at least 1');
  }

  if (!inputs.patientsPerChair || inputs.patientsPerChair < 1) {
    errors.push('Patients per chair must be at least 1');
  }

  if (!inputs.revenuePerPatient || inputs.revenuePerPatient < 0) {
    errors.push('Revenue per patient must be a positive number');
  }

  if (!inputs.daysPerWeek || inputs.daysPerWeek < 1 || inputs.daysPerWeek > 7) {
    errors.push('Days per week must be between 1 and 7');
  }

  if (!inputs.employees?.length) {
    errors.push('At least one employee is required');
  }

  return errors;
}
