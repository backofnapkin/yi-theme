import React, { useState } from 'react';
import { useDentalContext } from './DentalContext';
import { PlusCircle, Info, XCircle } from 'lucide-react';
import { formatNumber, parseFormattedNumber } from '../../../scripts/dental-calculator/formatters';

export const OverheadSection = () => {
  const { state, addOverheadCost, updateOverheadCost, removeOverheadCost } = useDentalContext();
  const { overhead } = state;
  const [showInfo, setShowInfo] = useState(false);

  const handleAmountChange = (id: number, value: string) => {
    const numberValue = parseFormattedNumber(value);
    updateOverheadCost(id, 'amount', numberValue);
  };

  return (
    <div className="bg-skin-card p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-skin-base">Overhead Costs</h2>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1 text-skin-base hover:text-skin-active transition-colors"
            aria-label="Information about overhead costs"
          >
            <Info size={20} />
          </button>
        </div>
        <button
          onClick={addOverheadCost}
          className="flex items-center gap-2 px-4 py-2 bg-custom-active text-white rounded-md hover:bg-custom-hover transition-colors"
        >
          <PlusCircle size={20} />
          Add Cost
        </button>
      </div>

      {showInfo && (
        <div className="mb-4 p-4 rounded-lg bg-skin-fill border border-skin-border">
          <p className="text-sm text-skin-base">
            Enter all monthly operating expenses such as lease, utilities, supplies, marketing, and loan payments.
          </p>
        </div>
      )}
     
      <div className="space-y-4">
        {overhead.map(cost => (
          <div key={cost.id} className="grid grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-skin-base">Expense Name</label>
              <input
                type="text"
                value={cost.name}
                onChange={(e) => updateOverheadCost(cost.id, 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active"
                placeholder="Enter expense name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-skin-base">Monthly Amount ($)</label>
              <input
                type="text"
                value={formatNumber(cost.amount)}
                onChange={(e) => handleAmountChange(cost.id, e.target.value)}
                className="mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active"
              />
            </div>
            <button
              onClick={() => removeOverheadCost(cost.id)}
              className="p-2 text-red-500 hover:text-red-700"
              aria-label="Remove overhead cost"
            >
              <XCircle size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
