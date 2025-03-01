import React from 'react';
import { Wallet, Plus, Trash2, HelpCircle } from 'lucide-react';
import type { TowTruckBusinessData, TruckFinancing } from '../types';
import { Tooltip } from '../../../ui/Tooltip';

interface FinancialDetailsStepProps {
  data: TowTruckBusinessData;
  onInputChange: (field: keyof TowTruckBusinessData, value: any) => void;
}

export function FinancialDetailsStep({ data, onInputChange }: FinancialDetailsStepProps) {
  const handleTruckFinancingChange = (index: number, field: keyof TruckFinancing, value: number) => {
    const updatedFinancing = [...data.truckFinancing];
    updatedFinancing[index] = {
      ...updatedFinancing[index],
      [field]: value
    };
    onInputChange('truckFinancing', updatedFinancing);
  };

  const addTruckFinancing = () => {
    if (data.truckFinancing.length < 5) {
      const newFinancing = {
        truckPrice: 100000,
        downPayment: 20000,
        interestRate: 10,
        loanTerm: 5
      };
      onInputChange('truckFinancing', [...data.truckFinancing, newFinancing]);
    }
  };

  const removeTruckFinancing = (index: number) => {
    const updatedFinancing = data.truckFinancing.filter((_, i) => i !== index);
    onInputChange('truckFinancing', updatedFinancing);
  };

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
          <Wallet className="h-8 w-8 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900">Financial Details</h2>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Enter financing information for each of your tow trucks.
        </p>
      </div>

      <div className="space-y-4">
        {data.truckFinancing.map((financing, index) => (
          <div key={index} className="relative bg-gray-50 rounded-lg overflow-visible p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Truck {index + 1} Financing
              </h3>
              {index > 0 && (
                <button
                  onClick={() => removeTruckFinancing(index)}
                  className="p-1.5 bg-red-600 border border-solid border-red-700 hover:bg-red-700 hover:border-red-800 text-white rounded-full shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <label className={labelClasses}>
                      Tow Truck Purchase Price
                      <span className="text-gray-500 ml-1">($)</span>
                    </label>
                    <Tooltip content="The total purchase price of the tow truck, including all equipment and accessories.">
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
                      value={financing.truckPrice || ''}
                      onChange={e => {
                        const value = e.target.value.replace(/[^\d.]/g, '');
                        if (/^\d*\.?\d*$/.test(value)) {
                          handleTruckFinancingChange(index, 'truckPrice', parseFloat(value) || 0);
                        }
                      }}
                      onWheel={e => e.currentTarget.blur()}
                      className={`${inputClasses} pl-7`}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <label className={labelClasses}>
                      Down Payment
                      <span className="text-gray-500 ml-1">($)</span>
                    </label>
                    <Tooltip content="The initial payment you make toward the purchase of the truck. A larger down payment typically results in lower monthly payments.">
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
                      value={financing.downPayment || ''}
                      onChange={e => {
                        const value = e.target.value.replace(/[^\d.]/g, '');
                        if (/^\d*\.?\d*$/.test(value)) {
                          handleTruckFinancingChange(index, 'downPayment', parseFloat(value) || 0);
                        }
                      }}
                      onWheel={e => e.currentTarget.blur()}
                      className={`${inputClasses} pl-7`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <label className={labelClasses}>
                      Interest Rate
                      <span className="text-gray-500 ml-1">(%)</span>
                    </label>
                    <Tooltip content="The annual interest rate on your loan. Commercial vehicle loans typically range from 5% to 15% depending on credit history and market conditions.">
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </Tooltip>
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={financing.interestRate || ''}
                    onChange={e => {
                      const value = e.target.value.replace(/[^\d.]/g, '');
                      if (/^\d*\.?\d*$/.test(value)) {
                        handleTruckFinancingChange(index, 'interestRate', parseFloat(value) || 0);
                      }
                    }}
                    onWheel={e => e.currentTarget.blur()}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <label className={labelClasses}>
                      Loan Term
                      <span className="text-gray-500 ml-1">(years)</span>
                    </label>
                    <Tooltip content="The length of time over which you'll repay the loan. Longer terms mean lower monthly payments but more interest paid over time.">
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </Tooltip>
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={financing.loanTerm || ''}
                    onChange={e => {
                      const value = e.target.value.replace(/[^\d.]/g, '');
                      if (/^\d*\.?\d*$/.test(value)) {
                        handleTruckFinancingChange(index, 'loanTerm', parseFloat(value) || 0);
                      }
                    }}
                    onWheel={e => e.currentTarget.blur()}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {data.truckFinancing.length < 5 && (
          <button
            onClick={addTruckFinancing}
            className="w-full py-3 border-2 border-dashed border-emerald-300 rounded-lg text-emerald-600 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Another Truck
          </button>
        )}
      </div>

      <div className="relative bg-gray-50 rounded-lg overflow-visible p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Fuel Information</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <label className={labelClasses}>
                  Average Cost per Gallon
                  <span className="text-gray-500 ml-1">($)</span>
                </label>
                <Tooltip content="The average price you pay for fuel. Consider using a slightly higher estimate than current prices to account for potential increases.">
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
                  value={data.fuelCostPerGallon.toFixed(2)}
                  onChange={e => {
                    const value = e.target.value.replace(/[^\d.]/g, '');
                    if (/^\d*\.?\d*$/.test(value)) {
                      onInputChange('fuelCostPerGallon', parseFloat(value) || 0);
                    }
                  }}
                  placeholder="3.55"
                  onWheel={e => e.currentTarget.blur()}
                  className={`${inputClasses} pl-7`}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <label className={labelClasses}>Average Miles per Gallon</label>
                <Tooltip content="The fuel efficiency of your tow trucks. Heavy-duty tow trucks typically get between 8-12 MPG depending on load and driving conditions.">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
                </Tooltip>
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={data.milesPerGallon || ''}
                onChange={e => {
                  const value = e.target.value.replace(/[^\d.]/g, '');
                  if (/^\d*\.?\d*$/.test(value)) {
                    onInputChange('milesPerGallon', parseFloat(value) || 0);
                  }
                }}
                onWheel={e => e.currentTarget.blur()}
                className={inputClasses}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}