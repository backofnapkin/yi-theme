import React from 'react';
import { Plus, X, TrendingUp } from 'lucide-react';
import { Tooltip } from '../../ui/Tooltip';
import { DecimalInput } from '../../ui/DecimalInput';
import type { CalculatorState } from './types';

interface AdditionalRevenueProps {
  state: CalculatorState;
  onChange: (updates: Partial<CalculatorState>) => void;
}

export function AdditionalRevenue({ state, onChange }: AdditionalRevenueProps) {
  const addService = () => {
    onChange({
      additionalServices: [
        ...state.additionalServices,
        { name: '', revenuePerMonth: 0 }
      ]
    });
  };

  const removeService = (index: number) => {
    onChange({
      additionalServices: state.additionalServices.filter((_, i) => i !== index)
    });
  };

  const updateService = (index: number, updates: Partial<typeof state.additionalServices[0]>) => {
    onChange({
      additionalServices: state.additionalServices.map((service, i) => 
        i === index ? { ...service, ...updates } : service
      )
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-blue-600" />
        Additional Revenue Streams
      </h2>
      
      <div className="space-y-6">
        <DecimalInput
          label={
            <div className="flex items-center gap-2">
              Monthly Junk Removal Revenue
              <Tooltip content="Monthly revenue from junk removal services">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </button>
              </Tooltip>
            </div>
          }
          value={state.junkRemovalRevenue}
          onChange={(value) => onChange({ junkRemovalRevenue: value })}
          min={0}
          prefix="$"
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Additional Services</h3>
            <button
              onClick={addService}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-skin-emerald-text hover:text-emerald-700"
            >
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          </div>

          {state.additionalServices.map((service, index) => (
            <div key={index} className="flex gap-4 items-center">
              <div className="flex-1">
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) => updateService(index, { name: e.target.value })}
                  placeholder="Service name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                />
              </div>
              <div className="flex-1">
                <DecimalInput
                  value={service.revenuePerMonth}
                  onChange={(value) => updateService(index, { revenuePerMonth: value })}
                  placeholder="Monthly revenue"
                  min={0}
                  prefix="$"
                  label=""
                />
              </div>
              <button
                onClick={() => removeService(index)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}