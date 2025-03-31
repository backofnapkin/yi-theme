import React from 'react';
import InputField from '../InputField';

/**
 * Property details form section component
 * Enhanced with better visual styling
 */
const PropertyDetailsSection = ({ propertyName, onChange }) => {
  return (
    <div className="mb-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <InputField
          label="Property Name (Optional)"
          value={propertyName}
          onChange={(value) => onChange({ 
            target: { name: 'propertyName', value: value }
          })}
          type="text"
          name="propertyName"
          id="propertyName"
          placeholder="Your Property"
          helpText="Enter a name for this property (e.g., 'Home', 'Rental Property')"
        />
      </div>
    </div>
  );
};

export default PropertyDetailsSection;