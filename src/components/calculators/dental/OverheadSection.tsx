import React from 'react';
import { useDentalContext } from './DentalContext';
import { PlusCircle } from 'lucide-react';

export const OverheadSection = () => {
  const { state, addOverheadCost, updateOverheadCost, removeOverheadCost } = useDentalContext();
  const { overhead } = state;

  return (
    <div className="bg-skin-card p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-skin-base">Overhead Costs</h2>
        <button
          onClick={addOverheadCost}
          className="flex items-center gap-2 px-4 py-2 bg-custom-active text-white rounded-md hover:bg-custom-hover transition-colors"
        >
          <PlusCircle size={20} />
          Add Cost
        </button>
      </div>
      
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
                type="number"
                value={cost.amount}
                onChange={(e) => updateOverheadCost(cost.id, 'amount', Number(e.target.value))}
                min="0"
                step="100"
                className="mt-1 block w-full rounded-md border-skin-base shadow-sm focus:border-custom-active focus:ring-custom-active"
              />
            </div>
            <button
              onClick={() => removeOverheadCost(cost.id)}
              className="p-2 text-red-500 hover:text-red-700"
              aria-label="Remove overhead cost"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
