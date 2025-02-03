import React from 'react';
import { Info, Plus, Trash2, DollarSign } from 'lucide-react';
import { InputButton } from '../../ui/InputButton';
import { Tooltip } from '../../ui/Tooltip';
import { DecimalInput } from '../../ui/DecimalInput';

interface OperatingCostsProps {
  formData: {
    utilityCost: number;
    rent: number;
    laborCosts: number;
    maintenanceCost: number;
    additionalCosts: Array<{ name: string; amount: number }>;
  };
  onChange: (field: 'utilityCost' | 'rent' | 'laborCosts' | 'maintenanceCost' | 'additionalCosts', value: any) => void;
}

export const OperatingCosts: React.FC<OperatingCostsProps> = ({ formData, onChange }) => {
  const handleAddCost = () => {
    onChange('additionalCosts', [
      ...formData.additionalCosts,
      { name: '', amount: 0 }
    ]);
  };

  const handleRemoveCost = (index: number) => {
    const newCosts = formData.additionalCosts.filter((_, i) => i !== index);
    onChange('additionalCosts', newCosts);
  };

  const handleCostChange = (index: number, field: 'name' | 'amount', value: string | number) => {
    const newCosts = [...formData.additionalCosts];
    newCosts[index] = {
      ...newCosts[index],
      [field]: value
    };
    onChange('additionalCosts', newCosts);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <DollarSign className="w-5 h-5" />
        Operating Costs
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <DecimalInput
            label={
              <div className="flex items-center gap-2">
                <span>Monthly Utility Cost</span>
                <Tooltip content="Monthly cost for electricity, water, and other utilities">
                  <Info className="w-4 h-4 text-gray-400" />
                </Tooltip>
              </div>
            }
            value={formData.utilityCost}
            onChange={(value) => onChange('utilityCost', value)}
            prefix="$"
            min={0}
            step={100}
          />
        </div>

        <div>
          <DecimalInput
            label={
              <div className="flex items-center gap-2">
                <span>Monthly Rent</span>
                <Tooltip content="Monthly rental cost for the laundromat space">
                  <Info className="w-4 h-4 text-gray-400" />
                </Tooltip>
              </div>
            }
            value={formData.rent}
            onChange={(value) => onChange('rent', value)}
            prefix="$"
            min={0}
            step={100}
          />
        </div>

        <div>
          <DecimalInput
            label={
              <div className="flex items-center gap-2">
                <span>Labor Costs per Month</span>
                <Tooltip content="Monthly cost for employee wages and benefits">
                  <Info className="w-4 h-4 text-gray-400" />
                </Tooltip>
              </div>
            }
            value={formData.laborCosts}
            onChange={(value) => onChange('laborCosts', value)}
            prefix="$"
            min={0}
            step={100}
          />
        </div>

        <div>
          <DecimalInput
            label={
              <div className="flex items-center gap-2">
                <span>Average Monthly Maintenance Cost</span>
                <Tooltip content="Monthly cost for equipment maintenance and repairs">
                  <Info className="w-4 h-4 text-gray-400" />
                </Tooltip>
              </div>
            }
            value={formData.maintenanceCost}
            onChange={(value) => onChange('maintenanceCost', value)}
            prefix="$"
            min={0}
            step={50}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-800">Additional Operating Costs</h3>
          <InputButton
            onClick={handleAddCost}
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
          >
            Add Operating Cost
          </InputButton>
        </div>

        {formData.additionalCosts.map((cost, index) => (
          <div key={index} className="flex items-center space-x-4">
            <input
              type="text"
              value={cost.name}
              onChange={(e) => handleCostChange(index, 'name', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Cost name"
            />
            <DecimalInput
              value={cost.amount}
              onChange={(value) => handleCostChange(index, 'amount', value)}
              prefix="$"
              min={0}
              step={10}
              className="w-32"
            />
            <button
              onClick={() => handleRemoveCost(index)}
              className="p-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};