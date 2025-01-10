import React from 'react';
import type { TableOption } from './types';

interface SeatingSelectorProps {
  options: TableOption[];
  onQuantityChange: (id: string, quantity: number) => void;
}

export const SeatingSelector: React.FC<SeatingSelectorProps> = ({
  options,
  onQuantityChange,
}) => {
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.id} className="flex items-center space-x-4 p-3 bg-white rounded-lg border border-[rgb(104,157,106)] shadow-sm">
          <div className="flex-grow">
            <span className="font-medium text-[rgb(80,73,69)]">{option.name}</span>
            <div className="text-sm text-[rgb(80,73,69)] mt-1 space-y-1 opacity-80">
              <p>Table Size: {option.dimensions.width}"x{option.dimensions.depth}"</p>
              <p>Space Required: {option.spaceRequired.width}"x{option.spaceRequired.depth}"</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor={`quantity-${option.id}`} className="sr-only">Quantity</label>
            <input
              type="number"
              id={`quantity-${option.id}`}
              min="0"
              placeholder="0"
              value={option.quantity || ''}
              onChange={(e) => onQuantityChange(option.id, parseInt(e.target.value) || 0)}
              onFocus={handleFocus}
              onWheel={handleWheel}
              className="w-20 px-3 py-2 border border-[rgb(104,157,106)] rounded-md focus:ring-2 focus:ring-[rgb(14,192,124)] focus:border-[rgb(14,192,124)] bg-white"
            />
          </div>
        </div>
      ))}
    </div>
  );
};