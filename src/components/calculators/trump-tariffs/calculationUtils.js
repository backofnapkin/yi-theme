/**
 * Utility functions for tariff impact calculations
 */

// Study definitions with multipliers and URLs
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
  
  // Constants for tariff calculations
  export const CONSTANTS = {
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
  
  /**
   * Calculate tariff impacts based on user inputs
   * 
   * @param {Object} formValues - User input values from the form
   * @returns {Object} - Results of tariff impact calculations
   */
  export const calculateTariffImpacts = (formValues) => {
    // Food tariff calculation
    const foodImportAmount = formValues.monthlyFoodSpend * CONSTANTS.FOOD_IMPORT_PERCENTAGE;
    const foodTariffMin = foodImportAmount * CONSTANTS.CHINA_TARIFF_RATE * CONSTANTS.PASS_THROUGH_RATE;
    const foodTariffMax = foodImportAmount * CONSTANTS.CANADA_MEXICO_TARIFF_RATE * CONSTANTS.PASS_THROUGH_RATE;
    const foodTariffAvg = (foodTariffMin + foodTariffMax) / 2;
  
    // Fuel tariff calculation
    const fuelImportMinAmount = formValues.monthlyFuelSpend * CONSTANTS.FUEL_IMPORT_MIN_PERCENTAGE;
    const fuelImportMaxAmount = formValues.monthlyFuelSpend * CONSTANTS.FUEL_IMPORT_MAX_PERCENTAGE;
    const fuelTariffMin = fuelImportMinAmount * CONSTANTS.CANADA_MEXICO_TARIFF_RATE * CONSTANTS.PASS_THROUGH_RATE;
    const fuelTariffMax = fuelImportMaxAmount * CONSTANTS.CANADA_MEXICO_TARIFF_RATE * CONSTANTS.PASS_THROUGH_RATE;
    const fuelTariffAvg = (fuelTariffMin + fuelTariffMax) / 2;
  
    // Clothing tariff calculation
    const clothingImportMinAmount = formValues.monthlyClothingSpend * CONSTANTS.CLOTHING_IMPORT_MIN_PERCENTAGE;
    const clothingImportMaxAmount = formValues.monthlyClothingSpend * CONSTANTS.CLOTHING_IMPORT_MAX_PERCENTAGE;
    const clothingTariffMin = clothingImportMinAmount * CONSTANTS.CHINA_TARIFF_RATE * CONSTANTS.PASS_THROUGH_RATE;
    const clothingTariffMax = clothingImportMaxAmount * CONSTANTS.CANADA_MEXICO_TARIFF_RATE * CONSTANTS.PASS_THROUGH_RATE;
    const clothingTariffAvg = (clothingTariffMin + clothingTariffMax) / 2;
  
    // Calculate study-specific impacts
    const studyImpacts = {};
    
    Object.keys(studyDefinitions).forEach(studyKey => {
      const study = studyDefinitions[studyKey];
      const impact = formValues.totalMonthlySpend * study.multiplier;
      studyImpacts[`${studyKey}Impact`] = impact;
      studyImpacts[`${studyKey}Total`] = formValues.totalMonthlySpend + impact;
    });
  
    // Total monthly impact (based on categories)
    const totalMonthlyImpact = foodTariffAvg + fuelTariffAvg + clothingTariffAvg;
    const totalAnnualImpact = totalMonthlyImpact * 12;
  
    // Prepare chart data
    const chartData = [
      {
        name: 'Annual Expenses',
        Before: formValues.totalMonthlySpend * 12,
        After: (formValues.totalMonthlySpend + totalMonthlyImpact) * 12,
      }
    ];
  
    // Return all calculated results
    return {
      foodTariffMonthly: foodTariffAvg,
      foodTariffAnnual: foodTariffAvg * 12,
      fuelTariffMonthly: fuelTariffAvg,
      fuelTariffAnnual: fuelTariffAvg * 12,
      clothingTariffMonthly: clothingTariffAvg,
      clothingTariffAnnual: clothingTariffAvg * 12,
      totalMonthlyImpact,
      totalAnnualImpact,
      purchaseAutomobile: formValues.purchaseAutomobile,
      chartData,
      ...studyImpacts
    };
  };
  
  /**
   * Get breakdown of tariff impacts by category
   * 
   * @param {Object} results - Calculation results
   * @returns {Array} - Array of impact breakdowns by category
   */
  export const getTariffBreakdown = (results) => {
    return [
      {
        category: "Food & Groceries",
        monthlyImpact: results.foodTariffMonthly,
        annualImpact: results.foodTariffAnnual,
        percentage: (results.foodTariffMonthly / results.totalMonthlyImpact) * 100
      },
      {
        category: "Fuel & Gasoline",
        monthlyImpact: results.fuelTariffMonthly,
        annualImpact: results.fuelTariffAnnual,
        percentage: (results.fuelTariffMonthly / results.totalMonthlyImpact) * 100
      },
      {
        category: "Clothing & Apparel",
        monthlyImpact: results.clothingTariffMonthly,
        annualImpact: results.clothingTariffAnnual,
        percentage: (results.clothingTariffMonthly / results.totalMonthlyImpact) * 100
      }
    ];
  };