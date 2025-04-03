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
    budgetLabYale: { 
      name: "Budget Lab at Yale", 
      multiplier: 0.0146, 
      url: "https://budgetlab.yale.edu/research/fiscal-economic-and-distributional-effects-20-tariffs-china-and-25-tariffs-canada-and-mexico" 
    },
    liberationDay: { 
      name: "Liberation Day Tariffs", 
      multiplier: 0.10, 
      url: "https://www.npr.org/2025/04/02/nx-s1-5345802/trump-tariffs-liberation-day" // Updated hyperlink
    }
  };
  
  export const calculateTariffImpact = (formValues) => {
    const totalMonthlySpend = Number(formValues.totalMonthlySpend) || 0;
    const monthlyFoodSpend = Number(formValues.monthlyFoodSpend) || 0;
    const monthlyFuelSpend = Number(formValues.monthlyFuelSpend) || 0;
    const monthlyClothingSpend = Number(formValues.monthlyClothingSpend) || 0;
  
    // Base category tariffs
    const foodImportPercentage = 0.3;
    const foodImportAmount = monthlyFoodSpend * foodImportPercentage;
    const foodTariffMin = foodImportAmount * 0.2 * 0.9;
    const foodTariffMax = foodImportAmount * 0.25 * 0.9;
    let foodTariffAvg = (foodTariffMin + foodTariffMax) / 2;
  
    const fuelImportMinPercentage = 0.4;
    const fuelImportMaxPercentage = 0.6;
    const fuelImportMinAmount = monthlyFuelSpend * fuelImportMinPercentage;
    const fuelImportMaxAmount = monthlyFuelSpend * fuelImportMaxPercentage;
    const fuelTariffMin = fuelImportMinAmount * 0.25 * 0.9;
    const fuelTariffMax = fuelImportMaxAmount * 0.25 * 0.9;
    let fuelTariffAvg = (fuelTariffMin + fuelTariffMax) / 2;
  
    const clothingImportMinPercentage = 0.4;
    const clothingImportMaxPercentage = 0.5;
    const clothingImportMinAmount = monthlyClothingSpend * clothingImportMinPercentage;
    const clothingImportMaxAmount = monthlyClothingSpend * clothingImportMaxPercentage;
    const clothingTariffMin = clothingImportMinAmount * 0.2 * 0.9;
    const clothingTariffMax = clothingImportMaxAmount * 0.25 * 0.9;
    let clothingTariffAvg = (clothingTariffMin + clothingTariffMax) / 2;
  
    let autoTariffImpact = 0;
  
    // Liberation Day adjustments (if selected)
    if (formValues.studies.liberationDay) {
      const chinaFoodTariff = foodImportAmount * 0.54 * 0.9;
      const euFoodTariff = foodImportAmount * 0.30 * 0.9;
      foodTariffAvg = (chinaFoodTariff + euFoodTariff) / 2;
  
      const chinaFuelTariff = fuelImportMaxAmount * 0.54 * 0.9;
      const euFuelTariff = fuelImportMaxAmount * 0.30 * 0.9;
      fuelTariffAvg = (chinaFuelTariff + euFuelTariff) / 2;
  
      const chinaClothingTariff = clothingImportMaxAmount * 0.54 * 0.9;
      const euClothingTariff = clothingImportMaxAmount * 0.30 * 0.9;
      clothingTariffAvg = (chinaClothingTariff + euClothingTariff) / 2;
  
      if (formValues.purchaseAutomobile === "Yes") {
        autoTariffImpact = 7500;
      }
    }
  
    // Category totals (shared across all scenarios)
    const categoryMonthlyImpact = foodTariffAvg + fuelTariffAvg + clothingTariffAvg;
    const categoryAnnualImpact = categoryMonthlyImpact * 12;
  
    // Calculate impacts for each selected study independently
    const studyImpacts = {};
    const annualImpacts = [];
    Object.keys(studyDefinitions).forEach(studyKey => {
      if (formValues.studies[studyKey]) {
        const studyMonthlyImpact = totalMonthlySpend * studyDefinitions[studyKey].multiplier;
        studyImpacts[`${studyKey}Impact`] = studyMonthlyImpact;
        studyImpacts[`${studyKey}Total`] = totalMonthlySpend + studyMonthlyImpact;
        const totalAnnual = (studyMonthlyImpact + categoryMonthlyImpact) * 12 + (studyKey === 'liberationDay' ? autoTariffImpact : 0);
        annualImpacts.push(totalAnnual);
      }
    });
  
    // Default to Tax Foundation if no studies selected
    if (annualImpacts.length === 0) {
      const defaultMonthlyImpact = totalMonthlySpend * studyDefinitions.taxFoundation.multiplier;
      annualImpacts.push((defaultMonthlyImpact + categoryMonthlyImpact) * 12);
    }
  
    // Determine range
    const lowEnd = Math.min(...annualImpacts);
    const highEnd = Math.max(...annualImpacts);
  
    return {
      foodTariffMonthly: foodTariffAvg,
      foodTariffAnnual: foodTariffAvg * 12,
      fuelTariffMonthly: fuelTariffAvg,
      fuelTariffAnnual: fuelTariffAvg * 12,
      clothingTariffMonthly: clothingTariffAvg,
      clothingTariffAnnual: clothingTariffAvg * 12,
      categoryMonthlyImpact,
      categoryAnnualImpact,
      lowEndAnnualImpact: lowEnd,
      highEndAnnualImpact: highEnd,
      purchaseAutomobile: formValues.purchaseAutomobile,
      autoTariffImpact: autoTariffImpact || null,
      ...studyImpacts
    };
  };