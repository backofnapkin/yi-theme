import React, { forwardRef } from 'react';
import { 
  formatCurrency, 
  getSoilTypeLabel, 
  getLawnConditionLabel, 
  getSlopeLabel,
  getSquareFeet,
  generateRecommendations,
  formatPercentage,
  getPercentageFromFactor
} from '../utils/calculationUtils';
import { generateAerationPDF } from '../utils/PDFGenerator';
import { 
  SOIL_TYPE_ADJUSTMENTS, 
  LAWN_CONDITION_ADJUSTMENTS, 
  SLOPE_ADJUSTMENTS,
  ADDITIONAL_SERVICES_PRICING,
  SQFT_PER_ACRE
} from '../utils/constants';

/**
 * Results display component for showing the calculation results
 * With filled green button
 */
const ResultsDisplay = forwardRef(({ estimate, formData, onRecalculate }, ref) => {
  // Handle PDF download
  const handleDownloadPDF = () => {
    generateAerationPDF(formData, estimate);
  };

  // Get recommendations based on user inputs
  const recommendations = generateRecommendations(formData);
  
  return (
    <div 
      ref={ref}
      className="mt-10 bg-white p-8 rounded-lg shadow-md border border-gray-200"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        {formData.propertyName ? `${formData.propertyName} - ` : ''}Lawn Aeration Estimate
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      
      {/* Lawn Details Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Lawn Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
          <div>
            <strong>Yard Size:</strong> {formData.yardSize} {formData.sizeUnit}
            {formData.sizeUnit === 'acres' && (
              <span className="text-sm text-gray-500 ml-1">
                ({(formData.yardSize * SQFT_PER_ACRE).toLocaleString()} sq. ft.)
              </span>
            )}
            {formData.sizeUnit === 'sqft' && (
              <span className="text-sm text-gray-500 ml-1">
                ({(formData.yardSize / SQFT_PER_ACRE).toFixed(3)} acres)
              </span>
            )}
          </div>
          <div><strong>Soil Type:</strong> {getSoilTypeLabel(formData.soilType)}</div>
          <div><strong>Lawn Condition:</strong> {getLawnConditionLabel(formData.lawnCondition)}</div>
          <div><strong>Lawn Slope:</strong> {getSlopeLabel(formData.slope)}</div>
        </div>
      </div>
      
      {/* Cost Breakdown Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Cost Breakdown</h3>
        <div className="mb-4 space-y-2 text-gray-700">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span><strong>Base Aeration Cost:</strong></span>
            <span>{formatCurrency(estimate.basePrice)}</span>
          </div>
          
          {estimate.soilAdjustment > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span>
                <strong>Soil Type Adjustment:</strong>
                <span className="text-sm text-gray-500 ml-1">
                  {`(${formatPercentage(getPercentageFromFactor(SOIL_TYPE_ADJUSTMENTS[formData.soilType]))} for ${getSoilTypeLabel(formData.soilType).toLowerCase()} soil)`}
                </span>
              </span>
              <span>{formatCurrency(estimate.soilAdjustment)}</span>
            </div>
          )}
          
          {estimate.conditionAdjustment > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span>
                <strong>Lawn Condition Adjustment:</strong>
                <span className="text-sm text-gray-500 ml-1">
                  {`(${formatPercentage(getPercentageFromFactor(LAWN_CONDITION_ADJUSTMENTS[formData.lawnCondition]))} for ${getLawnConditionLabel(formData.lawnCondition).toLowerCase()} condition)`}
                </span>
              </span>
              <span>{formatCurrency(estimate.conditionAdjustment)}</span>
            </div>
          )}
          
          {estimate.slopeAdjustment > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span>
                <strong>Slope Adjustment:</strong>
                <span className="text-sm text-gray-500 ml-1">
                  {`(${formatPercentage(getPercentageFromFactor(SLOPE_ADJUSTMENTS[formData.slope]))} for ${getSlopeLabel(formData.slope).toLowerCase()})`}
                </span>
              </span>
              <span>{formatCurrency(estimate.slopeAdjustment)}</span>
            </div>
          )}
          
          {formData.additionalServices.fertilization && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span><strong>Fertilization:</strong></span>
              <span>{formatCurrency(getSquareFeet(formData.yardSize, formData.sizeUnit) * ADDITIONAL_SERVICES_PRICING.fertilization)}</span>
            </div>
          )}
          
          {formData.additionalServices.overseeding && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span><strong>Overseeding:</strong></span>
              <span>{formatCurrency(getSquareFeet(formData.yardSize, formData.sizeUnit) * ADDITIONAL_SERVICES_PRICING.overseeding)}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between py-3 px-4 bg-emerald-50 border border-emerald-200 rounded text-lg font-bold text-gray-900">
          <span>Total Estimated Cost:</span>
          <span>{formatCurrency(estimate.totalPrice)}</span>
        </div>
      </div>
      
      {/* Recommendations Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Recommendations</h3>
        <div className="bg-emerald-50 p-5 rounded border border-emerald-100">
          {recommendations.map((rec, index) => (
            <p key={index} className="mb-3 text-gray-700">{rec}</p>
          ))}
        </div>
      </div>
      
      {/* Contact Information Section (if provided) */}
      {(formData.name || formData.email || formData.phone || formData.address) && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
            {formData.name && <div><strong>Name/Business:</strong> {formData.name}</div>}
            {formData.email && <div><strong>Email:</strong> {formData.email}</div>}
            {formData.phone && <div><strong>Phone:</strong> {formData.phone}</div>}
            {formData.address && <div><strong>Address:</strong> {formData.address}</div>}
          </div>
        </div>
      )}
      
      {/* Action Buttons - Updated with new background colors */}
      <div className="flex flex-wrap gap-4 mt-6">
        <button
          onClick={handleDownloadPDF}
          className="inline-flex items-center bg-gradient-to-br from-green-50 to-emerald-50 text-gray-700 font-bold py-2 px-6 rounded transition-colors border border-emerald-200 hover:border-emerald-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF Estimate
        </button>
        <button
          onClick={onRecalculate}
          className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-colors border border-red-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Recalculate
        </button>
      </div>
    </div>
  );
});

export default ResultsDisplay;