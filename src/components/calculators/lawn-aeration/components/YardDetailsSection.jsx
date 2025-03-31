import React from 'react';
import InputField from '../InputField';

/**
 * Yard details form section component
 * Enhanced with better visual styling
 */
const YardDetailsSection = ({ yardSize, sizeUnit, pricePerUnit, priceUnit, onChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Yard Size and Pricing</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Yard Size with Unit Selection */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <InputField
            label="Yard Size"
            value={yardSize}
            onChange={(value) => onChange({ 
              target: { name: 'yardSize', value: value }
            })}
            type="number"
            name="yardSize"
            min={sizeUnit === 'acres' ? '0.01' : '100'}
            step={sizeUnit === 'acres' ? '0.01' : '100'}
            required={true}
            helpText="Enter the approximate size of your lawn."
            className="mb-3"
          />
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size Unit
            </label>
            <select
              id="sizeUnit"
              name="sizeUnit"
              value={sizeUnit}
              onChange={onChange}
              className="block w-full py-3 px-4 rounded-md border border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 bg-white text-base"
            >
              <option value="sqft">Square Feet</option>
              <option value="acres">Acres</option>
            </select>
          </div>
        </div>
        
        {/* Price Per Unit with Selection */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <InputField
            label="Price Per Unit"
            value={pricePerUnit}
            onChange={(value) => onChange({ 
              target: { name: 'pricePerUnit', value: value }
            })}
            type="number"
            name="pricePerUnit"
            min="0.01"
            step="0.01"
            prefix="$"
            helpText="Typical pricing: $800/acre or $0.15/sq. ft."
            className="mb-3"
          />
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Unit
            </label>
            <select
              id="priceUnit"
              name="priceUnit"
              value={priceUnit}
              onChange={onChange}
              className="block w-full py-3 px-4 rounded-md border border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 bg-white text-base"
            >
              <option value="sqft">Per Sq. Ft</option>
              <option value="acre">Per Acre</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YardDetailsSection;