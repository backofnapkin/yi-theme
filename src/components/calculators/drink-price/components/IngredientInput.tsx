import React from 'react';
import type { Ingredient } from '../hooks/useDrinkPriceCalculator';

interface IngredientInputProps {
  ingredient: Ingredient;
  onUpdate: (field: keyof Ingredient, value: any) => void;
  onRemove: () => void;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ ingredient, onUpdate, onRemove }) => {
  // Calculate the cost of this ingredient
  const calculateIngredientCost = (): number => {
    if (!ingredient.amount || !ingredient.packageSize || !ingredient.packagePrice) {
      return 0;
    }
    
    return (ingredient.amount / ingredient.packageSize) * ingredient.packagePrice;
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Ingredient Name
          </label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={ingredient.name}
            onChange={(e) => onUpdate('name', e.target.value)}
            placeholder="e.g., Tequila"
          />
        </div>
        
        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Amount Used
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={ingredient.amount || ''}
              onChange={(e) => onUpdate('amount', e.target.value)}
              placeholder="1.5"
            />
          </div>
          <div className="w-20">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Unit
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={ingredient.unit}
              onChange={(e) => onUpdate('unit', e.target.value)}
            >
              <option value="oz">oz</option>
              <option value="ml">ml</option>
              <option value="dash">dash</option>
              <option value="tbsp">tbsp</option>
              <option value="tsp">tsp</option>
              <option value="count">count</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Ingredient Cost
          </label>
          <div className="text-gray-700 py-2">
            ${calculateIngredientCost().toFixed(2)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Package Size
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={ingredient.packageSize || ''}
              onChange={(e) => onUpdate('packageSize', e.target.value)}
              placeholder="750"
            />
          </div>
          <div className="w-20">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Unit
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={ingredient.packageUnit}
              onChange={(e) => onUpdate('packageUnit', e.target.value)}
            >
              <option value="oz">oz</option>
              <option value="ml">ml</option>
              <option value="count">count</option>
              <option value="lb">lb</option>
              <option value="kg">kg</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Package Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={ingredient.packagePrice || ''}
            onChange={(e) => onUpdate('packagePrice', e.target.value)}
            placeholder="25.99"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onRemove}
            className="bg-red-500 hover:bg-red-700 text-skin-red-text font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border border-red-600"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default IngredientInput;