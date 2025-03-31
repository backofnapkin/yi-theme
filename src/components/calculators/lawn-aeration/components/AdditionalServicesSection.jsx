import React from 'react';

/**
 * Additional services form section component
 * With standard checkboxes and emerald green accents
 */
const AdditionalServicesSection = ({ additionalServices, onChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Additional Services</h3>
      <div className="space-y-4">
        <div className="flex items-start">
          <input
            id="fertilization"
            name="additionalServices.fertilization"
            type="checkbox"
            checked={additionalServices.fertilization}
            onChange={onChange}
            className="h-4 w-4 mt-1 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <div className="ml-2">
            <label htmlFor="fertilization" className="text-sm font-medium text-gray-700">
              Apply Fertilization
            </label>
            <p className="text-xs text-gray-500">
              Recommended after aeration to maximize nutrient absorption
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <input
            id="overseeding"
            name="additionalServices.overseeding"
            type="checkbox"
            checked={additionalServices.overseeding}
            onChange={onChange}
            className="h-4 w-4 mt-1 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <div className="ml-2">
            <label htmlFor="overseeding" className="text-sm font-medium text-gray-700">
              Apply Overseeding
            </label>
            <p className="text-xs text-gray-500">
              Best time to seed is right after aeration for optimal seed-to-soil contact
            </p>
          </div>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Adding these services during aeration maximizes results and saves on separate service calls.
      </p>
    </div>
  );
};

export default AdditionalServicesSection;