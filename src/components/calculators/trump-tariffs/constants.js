/**
 * Constants used in the Trump Tariff Calculator
 */

/**
 * List of all US states
 */
export const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", 
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", 
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", 
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", 
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", 
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", 
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];
  
  /**
   * Default form values
   */
  export const defaultFormValues = {
    totalMonthlySpend: 6440,
    monthlyFoodSpend: 862,
    monthlyFuelSpend: 204,
    monthlyClothingSpend: 62,
    purchaseAutomobile: "No",
    state: "",
    studies: {
      taxFoundation: true,
      piie: true,
      jointEconomicCommittee: true,
      budgetLabMidpoint: true
    }
  };
  
  /**
   * Tooltip descriptions for form fields
   */
  export const tooltips = {
    totalMonthlySpend: "Enter your total monthly household expenditure across all categories",
    monthlyFoodSpend: "Enter your monthly spending on groceries and food",
    monthlyFuelSpend: "Enter your monthly spending on gasoline, diesel, and other fuel",
    monthlyClothingSpend: "Enter your monthly spending on clothing and apparel", 
    purchaseAutomobile: "Select 'Yes' if you plan to purchase a vehicle this year",
    state: "Select your state of residence to see regional impacts",
    studies: "Select expert studies estimating tariff impacts on households"
  };
  
  /**
   * Study definitions with multipliers and URLs
   */
  export const studyDefinitions = {
    taxFoundation: {
      name: "Tax Foundation",
      multiplier: 0.0139,
      url: "https://taxfoundation.org/research/all/federal/trump-tariffs-trade-war/"
    },
    piie: {
      name: "PIIE",
      multiplier: 0.01552,
      url: "https://www.piie.com/blogs/realtime-economics/trumps-bigger-tariff-proposals-would-cost-typical-american-household-over"
    },
    jointEconomicCommittee: {
      name: "Joint Economic Committee",
      multiplier: 0.03363,
      url: "https://www.jec.senate.gov/public/index.cfm/democrats/2024/12/trump-s-tariff-plans-would-drive-up-costs-for-families-and-shrink-the-economy"
    },
    budgetLabMidpoint: {
      name: "Budget Lab Midpoint",
      multiplier: 0.0146,
      url: "https://budgetlab.yale.edu/research/fiscal-economic-and-distributional-effects-20-tariffs-china-and-25-tariffs-canada-and-mexico"
    }
  };
  
  /**
   * Fixed calculation constants
   */
  export const CALCULATION_CONSTANTS = {
    // Percentage of spending that goes to imports
    FOOD_IMPORT_PERCENTAGE: 0.3,
    FUEL_IMPORT_MIN_PERCENTAGE: 0.4,
    FUEL_IMPORT_MAX_PERCENTAGE: 0.6,
    CLOTHING_IMPORT_MIN_PERCENTAGE: 0.4,
    CLOTHING_IMPORT_MAX_PERCENTAGE: 0.5,
    
    // Tariff rates
    CHINA_TARIFF_RATE: 0.2,     // 20% tariff on Chinese imports
    CANADA_MEXICO_TARIFF_RATE: 0.25, // 25% tariff on Canadian/Mexican imports
    
    // Pass-through rate (how much of tariff cost is passed to consumers)
    PASS_THROUGH_RATE: 0.9,     // 90% pass-through rate
  
    // Auto purchase impact estimates
    AUTO_PURCHASE_MIN_IMPACT: 5000,  // $5,000 minimum impact
    AUTO_PURCHASE_MAX_IMPACT: 15000  // $15,000 maximum impact
  };