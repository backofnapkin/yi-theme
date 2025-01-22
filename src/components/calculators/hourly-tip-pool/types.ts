export interface Employee {
  id: string;
  name: string;
  role: string;
  hoursWorked: number;
  customPercentage?: number;
}

export interface TipCalculationResult {
  employeeId: string;
  name: string;
  role: string;
  tipAmount: number;
  percentage: number;
}

export const DEFAULT_ROLE_PERCENTAGES: Record<string, number> = {
  Server: 25,
  Bartender: 25,
  Cook: 15,
  Manager: 10,
  Busser: 10,
  Host: 7.5,
  'Dish Washer': 5,
  Other: 2.5,
};