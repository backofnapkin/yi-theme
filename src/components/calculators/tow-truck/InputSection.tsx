import React from 'react';
import { HelpCircle, Plus, Trash2 } from 'lucide-react';
import type { TowTruckBusinessData } from './types';
import { Tooltip } from '../../ui/Tooltip';

interface InputSectionProps {
  data: TowTruckBusinessData;
  onInputChange: (field: keyof TowTruckBusinessData, value: any) => void;
  onAddCustomExpense: () => void;
  onRemoveCustomExpense: (index: number) => void;
  onUpdateCustomExpense: (index: number, field: 'name' | 'amount', value: string | number) => void;
}

export function InputSection({
  data,
  onInputChange,
  onAddCustomExpense,
  onRemoveCustomExpense,
  onUpdateCustomExpense
}: InputSectionProps) {
  const handleTruckFinancingChange = (index: number, field: string, value: number) => {
    const updatedFinancing = [...data.truckFinancing];
    updatedFinancing[index] = {
      ...updatedFinancing[index],
      [field]: value
    };
    onInputChange('truckFinancing', updatedFinancing);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Company Name"
            value={data.companyName}
            onChange={(value) => onInputChange('companyName', value)}
            type="text"
          />
          <InputField
            label="Number of Tow Trucks"
            value={data.numTrucks}
            onChange={(value) => onInputChange('numTrucks', Number(value))}
            type="number"
            min={1}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Initial Investment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField
            label="Tow Truck Purchase Price"
            value={data.truckFinancing[0]?.truckPrice || 0}
            onChange={(value) => handleTruckFinancingChange(0, 'truckPrice', Number(value))}
            type="number"
            prefix="$"
          />
          <InputField
            label="Down Payment"
            value={data.truckFinancing[0]?.downPayment || 0}
            onChange={(value) => handleTruckFinancingChange(0, 'downPayment', Number(value))}
            type="number"
            prefix="$"
          />
          <InputField
            label="Interest Rate"
            value={data.truckFinancing[0]?.interestRate || 0}
            onChange={(value) => handleTruckFinancingChange(0, 'interestRate', Number(value))}
            type="number"
            suffix="%"
          />
          <InputField
            label="Loan Term"
            value={data.truckFinancing[0]?.loanTerm || 0}
            onChange={(value) => handleTruckFinancingChange(0, 'loanTerm', Number(value))}
            type="number"
            suffix="years"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Operating Assumptions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField
            label="Operating Days per Month"
            value={data.operatingDays}
            onChange={(value) => onInputChange('operatingDays', Number(value))}
            type="number"
            min={1}
            max={30}
          />
          <InputField
            label="Average Tows per Day"
            value={data.towsPerDay}
            onChange={(value) => onInputChange('towsPerDay', Number(value))}
            type="number"
          />
          <InputField
            label="Average Fee per Tow"
            value={data.feePerTow}
            onChange={(value) => onInputChange('feePerTow', Number(value))}
            type="number"
            prefix="$"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Fuel Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Average Cost per Gallon"
            value={data.fuelCostPerGallon}
            onChange={(value) => onInputChange('fuelCostPerGallon', Number(value))}
            type="number"
            step="0.01"
            prefix="$"
          />
          <InputField
            label="Average Miles per Gallon"
            value={data.milesPerGallon}
            onChange={(value) => onInputChange('milesPerGallon', Number(value))}
            type="number"
            step="0.1"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Expenses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField
            label="Insurance Costs"
            value={data.monthlyInsurance}
            onChange={(value) => onInputChange('monthlyInsurance', Number(value))}
            type="number"
            prefix="$"
          />
          <InputField
            label="Maintenance and Repair"
            value={data.monthlyMaintenance}
            onChange={(value) => onInputChange('monthlyMaintenance', Number(value))}
            type="number"
            prefix="$"
          />
          <InputField
            label="Broker Fees"
            value={data.monthlyBrokerFees}
            onChange={(value) => onInputChange('monthlyBrokerFees', Number(value))}
            type="number"
            prefix="$"
          />
          <InputField
            label="Labor Costs"
            value={data.monthlyLaborCosts}
            onChange={(value) => onInputChange('monthlyLaborCosts', Number(value))}
            type="number"
            prefix="$"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Custom Expenses</h2>
          <button
            onClick={onAddCustomExpense}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </button>
        </div>
        <div className="space-y-4">
          {data.customExpenses.map((expense, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={expense.name}
                  onChange={(e) => onUpdateCustomExpense(index, 'name', e.target.value)}
                  placeholder="Expense name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex-1">
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    value={expense.amount}
                    onChange={(e) => onUpdateCustomExpense(index, 'amount', Number(e.target.value))}
                    placeholder="Amount"
                    className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <button
                onClick={() => onRemoveCustomExpense(index)}
                className="mt-1 p-2 text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type: string;
  min?: number;
  max?: number;
  step?: string;
  prefix?: string;
  suffix?: string;
}

function InputField({
  label,
  value,
  onChange,
  type,
  min,
  max,
  step,
  prefix,
  suffix
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
            ${prefix ? 'pl-7' : ''}
            ${suffix ? 'pr-12' : ''}
          `}
        />
        {suffix && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
}