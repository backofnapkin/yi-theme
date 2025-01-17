import React from 'react';
import { Trash2 } from 'lucide-react';
import type { UnitConfiguration } from './types';
import { InfoTooltip } from './InfoTooltip';
import { EnhancedInput } from './EnhancedInput';

interface UnitConfigurationInputProps {
  config: UnitConfiguration;
  onUpdate: (updatedConfig: UnitConfiguration) => void;
  onDelete: () => void;
}

export const UnitConfigurationInput: React.FC<UnitConfigurationInputProps> = ({
  config,
  onUpdate,
  onDelete,
}) => {
  const handleInputChange = (field: keyof UnitConfiguration, value: number) => {
    const numValue = Math.min(Math.max(value || 0, 1), 999);
    onUpdate({ ...config, [field]: numValue });
  };

  return (
    <div className="bg-skin-card p-4 rounded-lg shadow-sm border border-skin-base mb-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium text-skin-base">
          Unit Configuration
          <InfoTooltip text="Enter the dimensions and pricing for this unit type" />
        </h4>
        <button
          onClick={onDelete}
          className="text-skin-red-text hover:text-custom-active transition-colors"
          aria-label="Delete configuration"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-skin-base">
            Width (ft)
            <InfoTooltip text="Enter unit width in feet (1-999)" />
          </label>
          <EnhancedInput
            value={config.width}
            onChange={(value) => handleInputChange('width', value)}
            label="Width"
            placeholder="Enter width"
            min={1}
            max={999}
            suffix=" ft"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-skin-base">
            Depth (ft)
            <InfoTooltip text="Enter unit depth in feet (1-999)" />
          </label>
          <EnhancedInput
            value={config.depth}
            onChange={(value) => handleInputChange('depth', value)}
            label="Depth"
            placeholder="Enter depth"
            min={1}
            max={999}
            suffix=" ft"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-skin-base">
            Number of Units
            <InfoTooltip text="Enter total number of units of this size (1-999)" />
          </label>
          <EnhancedInput
            value={config.numberOfUnits}
            onChange={(value) => handleInputChange('numberOfUnits', value)}
            label="Number of Units"
            placeholder="Enter quantity"
            min={1}
            max={999}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-skin-base">
            Monthly Rent/Unit ($)
            <InfoTooltip text="Enter monthly rent per unit ($1-$999)" />
          </label>
          <EnhancedInput
            value={config.monthlyRentPerUnit}
            onChange={(value) => handleInputChange('monthlyRentPerUnit', value)}
            label="Monthly Rent per Unit"
            placeholder="Enter amount"
            min={1}
            max={999}
            prefix="$"
          />
        </div>
      </div>
    </div>
  );
};