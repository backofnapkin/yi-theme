import React from 'react';
import PropertyDetailsSection from './PropertyDetailsSection';
import YardDetailsSection from './YardDetailsSection';
import SoilTypeSection from './SoilTypeSection';
import LawnConditionSection from './LawnConditionSection';
import SlopeSection from './SlopeSection';
import AdditionalServicesSection from './AdditionalServicesSection';
import ContactInfoSection from './ContactInfoSection';

/**
 * Form container component for the Lawn Aeration Calculator
 * With filled green button
 */
const CalculatorForm = ({ formData, setFormData, onSubmit }) => {
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      // Handle nested properties (for additionalServices)
      const [parent, child] = name.split('.');
      setFormData(prevData => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      // Handle regular inputs
      const newValue = type === 'checkbox' ? checked : value;
      
      setFormData(prevData => {
        const updatedData = {
          ...prevData,
          [name]: newValue
        };
        
        // Special handling for sizeUnit changes
        if (name === 'sizeUnit') {
          const SQFT_PER_ACRE = 43560;
          
          if (value === 'acres') {
            updatedData.yardSize = prevData.yardSize / SQFT_PER_ACRE < 0.01 ? 0.15 : (prevData.yardSize / SQFT_PER_ACRE).toFixed(2);
            updatedData.priceUnit = 'acre';
            updatedData.pricePerUnit = 800;
          } else {
            updatedData.yardSize = prevData.sizeUnit === 'acres' ? Math.round(prevData.yardSize * SQFT_PER_ACRE) : prevData.yardSize;
            updatedData.priceUnit = 'sqft';
            updatedData.pricePerUnit = 0.08;
          }
        }
        
        // If changing priceUnit, adjust price per unit
        if (name === 'priceUnit') {
          if (value === 'acre') {
            updatedData.pricePerUnit = 800;
          } else {
            updatedData.pricePerUnit = 0.08;
          }
        }
        
        return updatedData;
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="bg-emerald-600 p-4">
        <h2 className="text-xl font-bold text-white">Lawn Aeration Cost Calculator</h2>
      </div>
      
      <form onSubmit={onSubmit} className="p-6 space-y-6">
        {/* Property Details Section */}
        <PropertyDetailsSection 
          propertyName={formData.propertyName}
          onChange={handleInputChange}
        />
        
        {/* Yard Details Section */}
        <YardDetailsSection 
          yardSize={formData.yardSize}
          sizeUnit={formData.sizeUnit}
          pricePerUnit={formData.pricePerUnit}
          priceUnit={formData.priceUnit}
          onChange={handleInputChange}
        />
        
        {/* Soil Type Section */}
        <SoilTypeSection 
          soilType={formData.soilType}
          onChange={handleInputChange}
        />
        
        {/* Lawn Condition Section */}
        <LawnConditionSection 
          lawnCondition={formData.lawnCondition}
          onChange={handleInputChange}
        />
        
        {/* Slope Section */}
        <SlopeSection 
          slope={formData.slope}
          onChange={handleInputChange}
        />
        
        {/* Additional Services Section */}
        <AdditionalServicesSection
          additionalServices={formData.additionalServices}
          onChange={handleInputChange}
        />
        
        {/* Contact Information Section */}
        <ContactInfoSection
          name={formData.name}
          email={formData.email}
          phone={formData.phone}
          address={formData.address}
          onChange={handleInputChange}
        />
        
        {/* Submit Button - Updated with gradient background */}
        <button
          type="submit"
          className="w-full bg-gradient-to-br from-green-50 to-emerald-50 text-gray-700 font-bold py-3 px-4 rounded-lg transition-colors border border-emerald-200 hover:border-emerald-300"
        >
          Calculate Lawn Aeration Cost
        </button>
      </form>
    </div>
  );
};

export default CalculatorForm;