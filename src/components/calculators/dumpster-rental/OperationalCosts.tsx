import React from 'react';
import { Settings, Plus, X } from 'lucide-react';
import { Tooltip } from '../../ui/Tooltip';
import { DecimalInput } from '../../ui/DecimalInput';
import type { CalculatorState, CustomCost } from './types';

interface OperationalCostsProps {
  state: CalculatorState;
  onChange: (updates: Partial<CalculatorState>) => void;
}

export function OperationalCosts({ state, onChange }: OperationalCostsProps) {
  const addCustomCost = () => {
    if (state.additionalOperationalCosts.length >= 10) return;
    onChange({
      additionalOperationalCosts: [
        ...state.additionalOperationalCosts,
        { name: '', amount: 0 }
      ]
    });
  };

  const removeCustomCost = (index: number) => {
    onChange({
      additionalOperationalCosts: state.additionalOperationalCosts.filter((_, i) => i !== index)
    });
  };

  const updateCustomCost = (index: number, updates: Partial<CustomCost>) => {
    onChange({
      additionalOperationalCosts: state.additionalOperationalCosts.map((cost, i) => 
        i === index ? { ...cost, ...updates } : cost
      )
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Settings className="w-6 h-6 text-blue-600" />
        Operational Costs
      </h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <DecimalInput
          label={
            <div className="flex items-center gap-2">
              Maintenance Per Dumpster (Yearly)
              <Tooltip content="Annual maintenance cost per dumpster">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </button>
              </Tooltip>
            </div>
          }
          value={state.maintenanceCostPerYear}
          onChange={(value) => onChange({ maintenanceCostPerYear: value })}
          min={0}
          prefix="$"
        />

        <DecimalInput
          label={
            <div className="flex items-center gap-2">
              Number of Full-time Drivers
              <Tooltip content="Number of full-time drivers employed">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </button>
              </Tooltip>
            </div>
          }
          value={state.fullTimeDrivers}
          onChange={(value) => onChange({ fullTimeDrivers: Math.min(100, Math.max(1, value)) })}
          min={1}
          max={100}
          step={1}
        />

        <DecimalInput
          label={
            <div className="flex items-center gap-2">
              Driver Wage (per hour)
              <Tooltip content="Hourly wage for drivers (40 hours/week, 52 weeks/year)">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </button>
              </Tooltip>
            </div>
          }
          value={state.driverWagePerHour}
          onChange={(value) => onChange({ driverWagePerHour: value })}
          min={0}
          prefix="$"
        />

        <DecimalInput
          label={
            <div className="flex items-center gap-2">
              Monthly Fuel Cost
              <Tooltip content="Average monthly fuel expenses">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </button>
              </Tooltip>
            </div>
          }
          value={state.fuelCostPerMonth}
          onChange={(value) => onChange({ fuelCostPerMonth: value })}
          min={0}
          prefix="$"
        />

        <DecimalInput
          label={
            <div className="flex items-center gap-2">
              Monthly Marketing Cost
              <Tooltip content="Monthly marketing and advertising expenses">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </button>
              </Tooltip>
            </div>
          }
          value={state.marketingCostsPerMonth}
          onChange={(value) => onChange({ marketingCostsPerMonth: value })}
          min={0}
          prefix="$"
        />

        <DecimalInput
          label={
            <div className="flex items-center gap-2">
              Monthly Insurance Cost
              <Tooltip content="Monthly insurance expenses">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </button>
              </Tooltip>
            </div>
          }
          value={state.insuranceCostPerMonth}
          onChange={(value) => onChange({ insuranceCostPerMonth: value })}
          min={0}
          prefix="$"
        />

        <DecimalInput
          label={
            <div className="flex items-center gap-2">
              Monthly Loan Payment
              <Tooltip content="Monthly loan repayment amount">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </button>
              </Tooltip>
            </div>
          }
          value={state.loanRepaymentPerMonth}
          onChange={(value) => onChange({ loanRepaymentPerMonth: value })}
          min={0}
          prefix="$"
        />

        <DecimalInput
          label={
            <div className="flex items-center gap-2">
              Monthly Software Cost
              <Tooltip content="Monthly software and technology expenses">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </button>
              </Tooltip>
            </div>
          }
          value={state.softwareCostsPerMonth}
          onChange={(value) => onChange({ softwareCostsPerMonth: value })}
          min={0}
          prefix="$"
        />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Additional Operational Costs</h3>
          {state.additionalOperationalCosts.length < 10 && (
            <button
              onClick={addCustomCost}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-skin-emerald-text hover:text-emerald-700"
            >
              <Plus className="w-4 h-4" />
              Add Cost
            </button>
          )}
        </div>

        {state.additionalOperationalCosts.map((cost, index) => (
          <div key={index} className="flex gap-4 items-center mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={cost.name}
                onChange={(e) => updateCustomCost(index, { name: e.target.value })}
                placeholder="Cost name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
              />
            </div>
            <div className="flex-1">
              <DecimalInput
                value={cost.amount}
                onChange={(value) => updateCustomCost(index, { amount: value })}
                placeholder="Amount"
                min={0}
                prefix="$"
                label=""
              />
            </div>
            <button
              onClick={() => removeCustomCost(index)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}