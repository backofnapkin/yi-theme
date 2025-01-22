import React from 'react';
import { Trash2, Info } from 'lucide-react';
import type { Employee } from './types';
import { BorderContainer } from '../../ui/BorderContainer';
import { DecimalInput } from '../../ui/DecimalInput';
import { Tooltip } from '../../ui/Tooltip';

interface EmployeeInputProps {
  employee: Employee;
  onUpdate: (updatedEmployee: Employee) => void;
  onRemove: () => void;
  isRemoveDisabled: boolean;
}

const JOB_ROLES = [
  'Server',
  'Bartender',
  'Cook',
  'Manager',
  'Busser',
  'Host',
  'Dish Washer',
  'Other',
];

export const EmployeeInput: React.FC<EmployeeInputProps> = ({
  employee,
  onUpdate,
  onRemove,
  isRemoveDisabled,
}) => {
  return (
    <BorderContainer contentClassName="flex flex-wrap gap-4 items-center">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
          Employee Name
          <Tooltip content="Enter the employee's name">
            <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
          </Tooltip>
        </label>
        <div className="mt-1 relative flex items-center">
          <input
            type="text"
            value={employee.name}
            onChange={(e) => onUpdate({ ...employee, name: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 pr-8"
            placeholder="Employee name"
          />
          <button
            onClick={onRemove}
            disabled={isRemoveDisabled}
            className="absolute right-2 p-1 text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:hover:text-gray-400 disabled:cursor-not-allowed"
            title={isRemoveDisabled ? "Can't remove last employee" : 'Remove employee'}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
          Job Role
          <Tooltip content="Select the employee's job role">
            <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
          </Tooltip>
        </label>
        <select
          value={employee.role}
          onChange={(e) => onUpdate({ ...employee, role: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:ring-2 focus:ring-offset-0"
        >
          {JOB_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <DecimalInput
        label={
          <span className="flex items-center gap-1">
            Hours Worked
            <Tooltip content="Enter the number of hours worked">
              <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
            </Tooltip>
          </span>
        }
        value={employee.hoursWorked}
        onChange={(value) => onUpdate({ ...employee, hoursWorked: value })}
        min={0}
        step={0.5}
        className="flex-1 min-w-[150px]"
      />

      <DecimalInput
        label={
          <span className="flex items-center gap-1">
            Custom %
            <Tooltip content="Optional: Enter a custom tip percentage for this employee">
              <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
            </Tooltip>
          </span>
        }
        value={employee.customPercentage || 0}
        onChange={(value) => onUpdate({ ...employee, customPercentage: value || undefined })}
        min={0}
        max={100}
        suffix="%"
        className="flex-1 min-w-[150px]"
      />
    </BorderContainer>
  );
};