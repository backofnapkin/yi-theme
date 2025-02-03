import React from 'react';
import { Rocket, Plus, X } from 'lucide-react';
import { Tooltip } from '../../ui/Tooltip';
import { DecimalInput } from '../../ui/DecimalInput';
import type { CalculatorState, CustomCost } from './types';

interface StartupCostsProps {
  state: CalculatorState;
  onChange: (updates: Partial<CalculatorState>) => void;
}

export function StartupCosts({ state, onChange }: StartupCostsProps) {
  const addCustomCost = () => {
    if (state.additionalStartupCosts.length >= 10) return;
    onChange({
      additionalStartupCosts: [
        ...state.additionalStartupCosts,
        { name: '', amount: 0 }
      ]
    });
  };

  const removeCustomCost = (index: number) => {
    onChange({
      additionalStartupCosts: state.additionalStartupCosts.filter((_, i) => i !== index)
    });
  };

  const updateCustomCost = (index: number, updates: Partial<CustomCost>) => {
    onChange({
      additionalStartupCosts: state.additionalStartupCosts.map((cost, i) => 
        i === index ? { ...cost, ...updates } : cost
      )
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Rocket className="w-6 h-6 text-blue-600" />
        Startup Costs
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        <DecimalInput
          label={
            <div className="flex items-center gap-2">
              Number of Roll Off Trucks
              <Tooltip content="Enter the number of trucks you plan to start with">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </button>
              </Tooltip>
            </div>
          }
          value={state.rollOffTrucks}
          onChange={(value) => onChange({ rollOffTrucks: Math.min(100, Math.max(1, value)) })}
          min={1}
          max={100}
          step={1}
        />

        <DecimalInput
          label={
            <div className="flex items-center gap-2">
              Roll Off Truck Cost
              <Tooltip content="Average cost per truck">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </button>
              </Tooltip>
            </div>
          }
          value={state.rollOffTruckCost}
          onChange={(value) => onChange({ rollOffTruckCost: value })}
          min={0}
          prefix="$"
        />

        <DecimalInput
          label={
            <div className="flex items-center gap-2">
              Number of Dumpsters
              <Tooltip content="Enter the number of dumpsters in your initial inventory">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </button>
              </Tooltip>
            </div>
          }
          value={state.dumpsterCount}
          onChange={(value) => onChange({ dumpsterCount: Math.min(200, Math.max(1, value)) })}
          min={1}
          max={200}
          step={1}
        />

        <DecimalInput
          label={
            <div className="flex items-center gap-2">
              Dumpster Cost (per unit)
              <Tooltip content="Average cost per dumpster">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </button>
              </Tooltip>
            </div>
          }
          value={state.dumpsterCost}
          onChange={(value) => onChange({ dumpsterCost: value })}
          min={0}
          prefix="$"
        />

        <DecimalInput
          label={
            <div className="flex items-center gap-2">
              Weekly Rental Price
              <Tooltip content="Average weekly rental price per dumpster">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </button>
              </Tooltip>
            </div>
          }
          value={state.rentalPricePerWeek}
          onChange={(value) => onChange({ rentalPricePerWeek: value })}
          min={0}
          prefix="$"
        />

        <DecimalInput
          label={
            <div className="flex items-center gap-2">
              Rentals Per Month
              <Tooltip content="Average number of rentals per dumpster per month">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </button>
              </Tooltip>
            </div>
          }
          value={state.rentalsPerMonth}
          onChange={(value) => onChange({ rentalsPerMonth: Math.min(30, Math.max(1, value)) })}
          min={1}
          max={30}
          step={1}
        />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Additional Startup Costs</h3>
          {state.additionalStartupCosts.length < 10 && (
            <button
              onClick={addCustomCost}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-skin-emerald-text hover:text-emerald-700"
            >
              <Plus className="w-4 h-4" />
              Add Cost
            </button>
          )}
        </div>

        {state.additionalStartupCosts.map((cost, index) => (
          <div key={index} className="flex gap-4 items-center mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={cost.name}
                onChange={(e) => updateCustomCost(index, { name: e.target.value })}
                placeholder="Cost name"
                className="w-full px-4 py-2 border border-emerald-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
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