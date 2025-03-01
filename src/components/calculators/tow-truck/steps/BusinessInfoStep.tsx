import React from 'react';
import { Truck, HelpCircle } from 'lucide-react';
import type { TowTruckBusinessData } from '../types';
import { Tooltip } from '../../../ui/Tooltip';

interface BusinessInfoStepProps {
  data: TowTruckBusinessData;
  onInputChange: (field: keyof TowTruckBusinessData, value: any) => void;
}

export function BusinessInfoStep({ data, onInputChange }: BusinessInfoStepProps) {
  // Generate options for dropdowns
  const daysOptions = Array.from({ length: 30 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} day${i === 0 ? '' : 's'}`
  }));
  
  const towsOptions = Array.from({ length: 20 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} tow${i === 0 ? '' : 's'}`
  }));

  const inputClasses = `
    w-full px-4 py-2 text-sm
    border rounded-lg
    border-gray-300 focus:ring-emerald-500 focus:border-emerald-500
    hover:border-emerald-200
    transition-shadow duration-200
    focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:border-2
    disabled:bg-gray-100 disabled:cursor-not-allowed
  `;

  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Truck className="h-8 w-8 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900">Business Details</h2>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Let's start with some basic information about your towing business.
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative bg-gray-50 rounded-lg overflow-visible p-4">
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <label className={labelClasses}>Company Name</label>
                <Tooltip content="Enter your company's legal name or DBA (Doing Business As) name.">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                </Tooltip>
              </div>
              <input
                type="text"
                value={data.companyName}
                onChange={e => onInputChange('companyName', e.target.value)}
                placeholder="e.g., Quick Tow Services"
                className={inputClasses}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <label className={labelClasses}>Number of Tow Trucks</label>
                  <Tooltip content="The total number of tow trucks in your fleet that are actively generating revenue.">
                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={data.numTrucks || ''}
                  onChange={e => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    if (/^\d*$/.test(value)) {
                      onInputChange('numTrucks', value === '' ? 0 : parseInt(value, 10));
                    }
                  }}
                  min={1}
                  max={5}
                  className={inputClasses}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <label className={labelClasses}>
                    Average Fee per Tow
                    <span className="text-gray-500 ml-1">($)</span>
                  </label>
                  <Tooltip content="The average amount you charge per tow. This should include all fees and surcharges typically collected.">
                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </Tooltip>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={data.feePerTow || ''}
                    onChange={e => {
                      const value = e.target.value.replace(/[^\d.]/g, '');
                      if (/^\d*\.?\d*$/.test(value)) {
                        onInputChange('feePerTow', value === '' ? 0 : parseFloat(value));
                      }
                    }}
                    min={0}
                    className={`${inputClasses} pl-7`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <label className={labelClasses}>Operating Days per Month</label>
                  <Tooltip content="The number of days per month your business operates. Most towing businesses operate 20-26 days per month.">
                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </Tooltip>
                </div>
                <select
                  value={data.operatingDays}
                  onChange={e => onInputChange('operatingDays', Number(e.target.value))}
                  className={inputClasses}
                >
                  {daysOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <label className={labelClasses}>Average Tows per Day</label>
                  <Tooltip content="The average number of tows each truck completes in a typical day. This varies by market and business model.">
                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </Tooltip>
                </div>
                <select
                  value={data.towsPerDay}
                  onChange={e => onInputChange('towsPerDay', Number(e.target.value))}
                  className={inputClasses}
                >
                  {towsOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <label className={labelClasses}>
                  Monthly Growth Rate
                  <span className="text-gray-500 ml-1">(%)</span>
                </label>
                <Tooltip content="Expected monthly growth in revenue. For established businesses, 0-2% is typical. For new businesses, 3-5% might be achievable as you build your customer base. You can enter precise values like 0.01% for very small growth rates.">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                </Tooltip>
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={data.monthlyGrowthRate || ''}
                onChange={e => {
                  const value = e.target.value.replace(/[^\d.]/g, '');
                  if (/^\d*\.?\d{0,2}$/.test(value)) {
                    onInputChange('monthlyGrowthRate', parseFloat(value) || 0);
                  }
                }}
                onWheel={e => e.currentTarget.blur()}
                className={inputClasses}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}