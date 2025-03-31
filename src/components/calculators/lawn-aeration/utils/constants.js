/**
 * Constants for the Lawn Aeration Calculator
 * Contains pricing information, adjustment factors, and initial form state
 */

// Conversion constants
export const SQFT_PER_ACRE = 43560;

// Pricing constants
export const BASE_RATE_PER_SQFT = 0.08;
export const MINIMUM_CHARGE = 150;

// Soil type adjustments (percentages)
export const SOIL_TYPE_ADJUSTMENTS = {
  'loam': 1.0,        // No adjustment for loam
  'clay': 1.05,       // 5% increase for clay
  'rocky': 1.05,      // 5% increase for rocky
  'sandy': 1.05,      // 5% increase for sandy
  'wet': 1.05         // 5% increase for wet/muddy
};

// Lawn condition adjustments (percentages)
export const LAWN_CONDITION_ADJUSTMENTS = {
  'normal': 1.0,      // No adjustment for normal
  'debris': 1.05,     // 5% increase for debris
  'weedy': 1.03,      // 3% increase for weedy
  'drought': 1.02,    // 2% increase for drought stressed
  'thatch': 1.05,     // 5% increase for thatch heavy
  'disease': 1.05     // 5% increase for disease/pest
};

// Slope adjustments (percentages)
export const SLOPE_ADJUSTMENTS = {
  'flat': 1.0,        // No adjustment for flat
  'gentle': 1.02,     // 2% increase for gentle slope
  'moderate': 1.05,   // 5% increase for moderate slope
  'steep': 1.10,      // 10% increase for steep slope
  'very-steep': 1.15  // 15% increase for very steep slope
};

// Additional services pricing
export const ADDITIONAL_SERVICES_PRICING = {
  'fertilization': 0.03,  // $0.03 per sq ft for fertilization
  'overseeding': 0.05     // $0.05 per sq ft for overseeding
};

// Form fields and options
export const SOIL_TYPE_OPTIONS = {
  'loam': 'Loam (Ideal)',
  'clay': 'Clay (Hard)',
  'rocky': 'Rocky',
  'sandy': 'Sandy',
  'wet': 'Wet/Muddy'
};

export const LAWN_CONDITION_OPTIONS = {
  'normal': 'Normal',
  'debris': 'Heavy Debris',
  'weedy': 'Weedy',
  'drought': 'Drought Stressed',
  'thatch': 'Thatch Heavy',
  'disease': 'Disease/Pest Issues'
};

export const SLOPE_OPTIONS = {
  'flat': 'Flat (0-2%)',
  'gentle': 'Gentle (2-5%)',
  'moderate': 'Moderate (5-10%)',
  'steep': 'Steep (10-20%)',
  'very-steep': 'Very Steep (>20%)'
};

// Initial form state
export const INITIAL_FORM_STATE = {
  propertyName: "",
  yardSize: 5000,
  sizeUnit: 'sqft',
  pricePerUnit: 0.08,
  priceUnit: 'sqft',
  soilType: 'loam',
  lawnCondition: 'normal',
  slope: 'flat',
  additionalServices: {
    fertilization: false,
    overseeding: false
  },
  name: '',
  email: '',
  phone: '',
  address: ''
};