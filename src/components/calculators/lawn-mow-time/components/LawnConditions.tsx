import React from 'react';
import { Trees as Tree, Check } from 'lucide-react';
import { DecimalInput } from '../../../ui/DecimalInput';
import type { LawnConditions as LawnConditionsType } from '../types';

interface Props {
  conditions: LawnConditionsType;
  onChange: (conditions: LawnConditionsType) => void;
}

export const LawnConditions: React.FC<Props> = ({ conditions, onChange }) => {
  const handleChange = (key: keyof LawnConditionsType, value: boolean | number) => {
    onChange({ ...conditions, [key]: value });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Tree className="w-5 h-5" />
        Lawn Conditions
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <DecimalInput
            label="Number of Trees"
            value={conditions.trees}
            onChange={(value) => handleChange('trees', value)}
            min={0}
            step={1}
          />
        </div>

        {[
          { key: 'hasParkway', label: 'Parkway between Sidewalk and Street' },
          { key: 'hasFlowerBeds', label: 'Curved Flower Beds' },
          { key: 'hasFence', label: 'Fence Line' },
          { key: 'isOvergrown', label: 'Overgrown Grass (6+ inches)' },
          { key: 'isSloped', label: 'Sloped / Uneven Terrain' },
          { key: 'isWet', label: 'Wet Grass' },
          { key: 'hasPetWaste', label: 'Pet Waste' },
          { key: 'hasPlaysets', label: 'Kids Toys or Play Sets' },
          { key: 'hasOther', label: 'Other Obstacles' }
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={key}
              checked={conditions[key as keyof LawnConditionsType] as boolean}
              onChange={(e) => handleChange(key as keyof LawnConditionsType, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 
                text-emerald-600 
                checked:bg-emerald-600 
                checked:border-emerald-600 
                checked:hover:bg-emerald-700 
                checked:hover:border-emerald-700 
                hover:border-emerald-500 
                focus:ring-2 
                focus:ring-emerald-500 
                focus:ring-offset-0 
                transition-colors"
            />
            <label htmlFor={key} className="text-sm text-gray-700 select-none">
              {label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};