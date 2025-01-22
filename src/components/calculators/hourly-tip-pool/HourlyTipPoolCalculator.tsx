import React, { useState } from 'react';
import { PlusCircle, Calculator, Info } from 'lucide-react';
import type { Employee, TipCalculationResult } from './types';
import { EmployeeInput } from './EmployeeInput';
import { Results } from './Results';
import { BorderContainer } from '../../ui/BorderContainer';
import { DecimalInput } from '../../ui/DecimalInput';
import { InputButton } from '../../ui/InputButton';
import { ResetButton } from '../../ui/ResetButton';
import { Tooltip } from '../../ui/Tooltip';

const DEFAULT_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Jane', role: 'Server', hoursWorked: 4 },
  { id: '2', name: 'Bob', role: 'Server', hoursWorked: 8 },
  { id: '3', name: 'Mary P.', role: 'Server', hoursWorked: 8 },
];

export const HourlyTipPoolCalculator: React.FC = () => {
  const [tipPool, setTipPool] = useState(200);
  const [employees, setEmployees] = useState<Employee[]>(DEFAULT_EMPLOYEES);
  const [equalDistribution, setEqualDistribution] = useState(true);
  const [deductionPercentage, setDeductionPercentage] = useState(0);
  const [results, setResults] = useState<TipCalculationResult[]>([]);
  const [deductionAmount, setDeductionAmount] = useState(0);

  const handleAddEmployee = () => {
    if (employees.length < 12) {
      const newEmployee: Employee = {
        id: String(Date.now()),
        name: `Employee ${employees.length + 1}`,
        role: 'Server',
        hoursWorked: 4,
      };
      setEmployees([...employees, newEmployee]);
    }
  };

  const handleRemoveEmployee = (index: number) => {
    const newEmployees = employees.filter((_, i) => i !== index);
    setEmployees(newEmployees);
  };

  const handleUpdateEmployee = (index: number, updatedEmployee: Employee) => {
    const newEmployees = [...employees];
    newEmployees[index] = updatedEmployee;
    setEmployees(newEmployees);
  };

  const calculateTips = () => {
    // Validate inputs
    if (tipPool <= 0) {
      alert('Please enter a valid tip pool amount greater than 0');
      return;
    }

    if (employees.length === 0) {
      alert('Please add at least one employee');
      return;
    }

    if (!equalDistribution && employees.some(emp => emp.customPercentage === undefined)) {
      alert('Please enter custom percentages for all employees when not using equal distribution');
      return;
    }

    const deduction = (tipPool * deductionPercentage) / 100;
    const availableTipPool = tipPool - deduction;

    let results: TipCalculationResult[];

    if (equalDistribution) {
      const totalHours = employees.reduce((sum, emp) => sum + emp.hoursWorked, 0);
      
      if (totalHours <= 0) {
        alert('Total hours worked must be greater than 0');
        return;
      }

      results = employees.map((emp) => ({
        employeeId: emp.id,
        name: emp.name,
        role: emp.role,
        tipAmount: (availableTipPool * (emp.hoursWorked / totalHours)),
        percentage: (emp.hoursWorked / totalHours) * 100,
      }));
    } else {
      const totalCustomPercentage = employees.reduce(
        (sum, emp) => sum + (emp.customPercentage || 0),
        0
      );

      if (totalCustomPercentage > 100) {
        alert('Total custom percentages cannot exceed 100%');
        return;
      }

      if (totalCustomPercentage === 0) {
        alert('Total custom percentages must be greater than 0%');
        return;
      }

      results = employees.map((emp) => {
        const percentage = emp.customPercentage || 0;
        return {
          employeeId: emp.id,
          name: emp.name,
          role: emp.role,
          tipAmount: (availableTipPool * percentage) / 100,
          percentage,
        };
      });
    }

    setResults(results);
    setDeductionAmount(deduction);
  };

  const handleReset = () => {
    setTipPool(200);
    setEmployees(DEFAULT_EMPLOYEES);
    setEqualDistribution(true);
    setDeductionPercentage(0);
    setResults([]);
    setDeductionAmount(0);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <BorderContainer title="Hourly Tip Pool Calculator">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <DecimalInput
              label={
                <span className="flex items-center gap-1">
                  Total Tip Pool
                  <Tooltip content="Enter the total amount of tips collected that need to be distributed among employees">
                    <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </Tooltip>
                </span>
              }
              value={tipPool}
              onChange={setTipPool}
              prefix="$"
              min={0}
              className="flex-1 min-w-[200px]"
            />

            <DecimalInput
              label={
                <span className="flex items-center gap-1">
                  Deduction Percentage
                  <Tooltip content="Optional: Specify a percentage to be deducted from the total tip pool before distribution (e.g., for credit card fees, house fees, or charitable contributions)">
                    <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </Tooltip>
                </span>
              }
              value={deductionPercentage}
              onChange={setDeductionPercentage}
              suffix="%"
              min={0}
              max={100}
              className="flex-1 min-w-[200px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="equalDistribution"
              checked={equalDistribution}
              onChange={(e) => setEqualDistribution(e.target.checked)}
              className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 focus:ring-2 focus:ring-offset-0"
            />
            <label htmlFor="equalDistribution" className="text-sm text-gray-700 flex items-center gap-1">
              Equal distribution based on hours worked
              <Tooltip content={
                <div className="space-y-2">
                  <p>When checked: Tips are distributed proportionally based on hours worked</p>
                  <p>When unchecked: Use custom percentages for each employee</p>
                  <p>Example: If an employee works 8 hours out of a total of 24 hours, they receive 33.3% of the tip pool</p>
                </div>
              }>
                <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </Tooltip>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          {employees.map((employee, index) => (
            <EmployeeInput
              key={employee.id}
              employee={employee}
              onUpdate={(updated) => handleUpdateEmployee(index, updated)}
              onRemove={() => handleRemoveEmployee(index)}
              isRemoveDisabled={employees.length <= 1}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <InputButton
            onClick={handleAddEmployee}
            disabled={employees.length >= 12}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            Add Employee
          </InputButton>

          <InputButton
            onClick={calculateTips}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Calculator className="h-5 w-5" />
            Calculate Tips
          </InputButton>

          <ResetButton onClick={handleReset} />
        </div>
      </BorderContainer>

      {results.length > 0 && (
        <Results results={results} deductionAmount={deductionAmount} />
      )}
    </div>
  );
};