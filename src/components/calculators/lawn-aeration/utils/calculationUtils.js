/**
 * Utility functions for the Lawn Aeration Calculator
 * Contains calculation logic, formatting, and recommendation generation
 */

import {
  SQFT_PER_ACRE,
  MINIMUM_CHARGE,
  SOIL_TYPE_ADJUSTMENTS,
  LAWN_CONDITION_ADJUSTMENTS,
  SLOPE_ADJUSTMENTS,
  ADDITIONAL_SERVICES_PRICING
} from './constants';

/**
 * Convert yard size to square feet based on the selected unit
 * @param {number} yardSize - Size value
 * @param {string} sizeUnit - Unit ('sqft' or 'acres')
 * @return {number} Size in square feet
 */
export const getSquareFeet = (yardSize, sizeUnit) => {
  return sizeUnit === 'acres' ? Number(yardSize) * SQFT_PER_ACRE : Number(yardSize);
};

/**
 * Calculate the complete aeration cost estimate
 * @param {Object} formData - The form data object
 * @return {Object} The complete cost estimate
 */
export const calculateAerationCost = (formData) => {
  const squareFeet = getSquareFeet(formData.yardSize, formData.sizeUnit);
  
  // Base price calculation
  let basePrice;
  if (formData.priceUnit === 'sqft') {
    basePrice = squareFeet * Number(formData.pricePerUnit);
  } else {
    // Price per acre
    basePrice = (squareFeet / SQFT_PER_ACRE) * Number(formData.pricePerUnit);
  }
  
  basePrice = Math.max(basePrice, MINIMUM_CHARGE); // Apply minimum charge
  
  // Apply adjustments
  const soilFactor = SOIL_TYPE_ADJUSTMENTS[formData.soilType];
  const conditionFactor = LAWN_CONDITION_ADJUSTMENTS[formData.lawnCondition];
  const slopeFactor = SLOPE_ADJUSTMENTS[formData.slope];
  
  const soilAdjustment = basePrice * (soilFactor - 1);
  const conditionAdjustment = basePrice * (conditionFactor - 1);
  const slopeAdjustment = basePrice * (slopeFactor - 1);
  
  // Calculate additional services
  let additionalServicesTotal = 0;
  const additionalServices = {};
  
  if (formData.additionalServices.fertilization) {
    const fertilizationCost = squareFeet * ADDITIONAL_SERVICES_PRICING.fertilization;
    additionalServices.fertilization = fertilizationCost;
    additionalServicesTotal += fertilizationCost;
  }
  
  if (formData.additionalServices.overseeding) {
    const overseedingCost = squareFeet * ADDITIONAL_SERVICES_PRICING.overseeding;
    additionalServices.overseeding = overseedingCost;
    additionalServicesTotal += overseedingCost;
  }
  
  // Calculate total
  const totalPrice = basePrice + soilAdjustment + conditionAdjustment + slopeAdjustment + additionalServicesTotal;
  
  return {
    basePrice,
    soilAdjustment,
    conditionAdjustment,
    slopeAdjustment,
    additionalServices,
    totalPrice
  };
};

/**
 * Generate personalized recommendations based on user inputs
 * @param {Object} formData - The form data object
 * @return {string[]} Array of recommendation strings
 */
export const generateRecommendations = (formData) => {
  const recommendations = [];
  
  // Soil type recommendations
  switch (formData.soilType) {
    case 'clay':
      recommendations.push("Hard clay soil benefits greatly from aeration to reduce compaction and improve drainage.");
      break;
    case 'rocky':
      recommendations.push("Rocky soil may require multiple passes with the aerator for optimal results.");
      break;
    case 'wet':
      recommendations.push("WARNING: Aeration is not recommended until muddy or wet soil dries. Consider rescheduling if soil is saturated.");
      break;
    case 'sandy':
      recommendations.push("Sandy soil may benefit from adding organic matter after aeration to improve water retention.");
      break;
    case 'loam':
      recommendations.push("Loam soil is ideal for aeration and will show excellent results.");
      break;
    default:
      recommendations.push("Regular aeration helps prevent soil compaction and promotes healthy root growth.");
  }
  
  // Lawn condition recommendations
  switch (formData.lawnCondition) {
    case 'debris':
      recommendations.push("Remove debris before aeration for best results.");
      break;
    case 'weedy':
      recommendations.push("Consider weed treatment before or after aeration for optimal lawn health.");
      break;
    case 'drought':
      recommendations.push("Water thoroughly 1-2 days before aeration for drought-stressed lawns.");
      break;
    case 'thatch':
      recommendations.push("Consider dethatching alongside aeration for thatch-heavy lawns.");
      break;
    case 'disease':
      recommendations.push("Treating disease or pest issues in conjunction with aeration will improve recovery.");
      break;
    default:
      recommendations.push("Aeration helps maintain the good condition of your lawn by improving air, water, and nutrient flow.");
  }
  
  // Slope recommendations
  if (formData.slope === 'steep' || formData.slope === 'very-steep') {
    recommendations.push("Steep slopes may require extra care to prevent erosion. Consider applying a light layer of compost after aeration.");
  }
  
  // Additional services recommendations
  if (formData.additionalServices.fertilization) {
    recommendations.push("Fertilization after aeration is highly effective as nutrients can reach deeper into the soil profile.");
  } else {
    recommendations.push("Consider adding fertilization to maximize the benefits of aeration.");
  }
  
  if (formData.additionalServices.overseeding) {
    recommendations.push("Overseeding after aeration promotes thicker turf as seeds have direct soil contact in aeration holes.");
  } else {
    recommendations.push("Overseeding after aeration is an excellent time to introduce new grass varieties or thicken thin areas.");
  }
  
  return recommendations;
};

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @return {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a percentage value with fewer decimal places
 * @param {number} value - The percentage value to format
 * @return {string} Formatted percentage string
 */
export const formatPercentage = (value) => {
  return Number(value).toFixed(0) + '%';
};

/**
 * Get percentage adjustment value from the adjustment factor
 * @param {number} factor - The adjustment factor
 * @return {number} Percentage value
 */
export const getPercentageFromFactor = (factor) => {
  return (factor - 1) * 100;
};

/**
 * Get human-readable label for soil type
 * @param {string} value - Soil type value
 * @return {string} Human-readable label
 */
export const getSoilTypeLabel = (value) => {
  const labels = {
    'loam': 'Loam (Ideal)',
    'clay': 'Hard Clay',
    'rocky': 'Rocky',
    'sandy': 'Sandy',
    'wet': 'Muddy or Wet'
  };
  return labels[value] || value;
};

/**
 * Get human-readable label for lawn condition
 * @param {string} value - Lawn condition value
 * @return {string} Human-readable label
 */
export const getLawnConditionLabel = (value) => {
  const labels = {
    'normal': 'Normal',
    'debris': 'Heavy Debris',
    'weedy': 'Weedy',
    'drought': 'Drought Stressed',
    'thatch': 'Thatch Heavy',
    'disease': 'Disease/Pest Issues'
  };
  return labels[value] || value;
};

/**
 * Get human-readable label for slope
 * @param {string} value - Slope value
 * @return {string} Human-readable label
 */
export const getSlopeLabel = (value) => {
  const labels = {
    'flat': 'Flat (0-2%)',
    'gentle': 'Gentle (2-5%)',
    'moderate': 'Moderate (5-10%)',
    'steep': 'Steep (10-20%)',
    'very-steep': 'Very Steep (>20%)'
  };
  return labels[value] || value;
};