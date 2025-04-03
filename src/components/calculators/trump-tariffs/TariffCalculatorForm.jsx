import React, { useState } from 'react';
import { Info } from 'lucide-react';
import TooltipInfo from './TooltipInfo';
import { usStates } from './constants';

// Study definitions with multipliers and URLs
const studyDefinitions = {
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
  budgetLabMidpoint: { // Note: Align with TrumpTariffCalculator.jsx’s budgetLabYale if intended to be the same
    name: "Budget Lab Midpoint",
    multiplier: 0.0146,
    url: "https://budgetlab.yale.edu/research/fiscal-economic-and-distributional-effects-20-tariffs-china-and-25-tariffs-canada-and-mexico"
  },
  liberationDay: { // Added for Liberation Day Tariffs
    name: "Liberation Day Tariffs",
    multiplier: 0.10,
    url: "https://www.whitehouse.gov/briefing-room/statements-releases/2025/04/02/liberation-day-tariffs" // Placeholder
  }
};

// Tooltip descriptions
const tooltips = {
  totalMonthlySpend: "Enter your total monthly household expenditure across all categories",
  monthlyFoodSpend: "Enter your monthly spending on groceries and food",
  monthlyFuelSpend: "Enter your monthly spending on gasoline, diesel, and other fuel",
  monthlyClothingSpend: "Enter your monthly spending on clothing and apparel", 
  purchaseAutomobile: "Select 'Yes' if you plan to purchase a vehicle this year",
  state: "Select your state of residence to see regional impacts",
  studies: "Select expert studies or tariff policies estimating household cost impacts, including Liberation Day Tariffs (April 2, 2025)"
};

const TariffCalculatorForm = ({ initialValues, onCalculate }) => {
  // Default form values with Liberation Day if not provided
  const defaultValues = {
    totalMonthlySpend: initialValues.totalMonthlySpend || "",
    monthlyFoodSpend: initialValues.monthlyFoodSpend || "",
    monthlyFuelSpend: initialValues.monthlyFuelSpend || "",
    monthlyClothingSpend: initialValues.monthlyClothingSpend || "",
    purchaseAutomobile: initialValues.purchaseAutomobile || "No",
    state: initialValues.state || "",
    studies: {
      taxFoundation: initialValues.studies?.taxFoundation ?? false,
      piie: initialValues.studies?.piie ?? false,
      jointEconomicCommittee: initialValues.studies?.jointEconomicCommittee ?? false,
      budgetLabMidpoint: initialValues.studies?.budgetLabMidpoint ?? false,
      liberationDay: initialValues.studies?.liberationDay ?? false // Added
    }
  };
  const [formValues, setFormValues] = useState(defaultValues);
  const [activeTooltip, setActiveTooltip] = useState(null);
  
  // Toggle tooltip visibility
  const toggleTooltip = (tooltipId) => {
    if (activeTooltip === tooltipId) {
      setActiveTooltip(null);
    } else {
      setActiveTooltip(tooltipId);
    }
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('studies.')) {
      const studyName = name.split('.')[1];
      setFormValues({
        ...formValues,
        studies: {
          ...formValues.studies,
          [studyName]: checked
        }
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(formValues);
  };
  
  return (
    <section className="bg-gray-50 p-6 rounded-lg mb-8">
      <form onSubmit={handleSubmit} aria-labelledby="calculator-form-heading">
        <h3 id="calculator-form-heading" className="text-xl font-bold mb-6">Enter Your Monthly Expenses</h3>
        
        {/* Total Monthly Spend */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <label htmlFor="totalMonthlySpend" className="font-medium text-lg">Total Monthly Spend</label>
            <TooltipInfo 
              id="totalMonthlySpend"
              active={activeTooltip === 'totalMonthlySpend'}
              toggle={() => toggleTooltip('totalMonthlySpend')}
              text={tooltips.totalMonthlySpend}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              id="totalMonthlySpend"
              name="totalMonthlySpend"
              value={formValues.totalMonthlySpend}
              onChange={handleInputChange}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md"
              min="0"
              step="1"
              required
              aria-describedby="totalMonthlySpend-description"
            />
          </div>
          <p id="totalMonthlySpend-description" className="text-sm text-gray-600 mt-1">
            Tariffs on imports raise everyday costs. Studies estimate annual household cost increases from $1,075 to $2,600.
          </p>
        </div>
        
        {/* Monthly Food Spend */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <label htmlFor="monthlyFoodSpend" className="font-medium text-lg">Monthly Food Spend</label>
            <TooltipInfo 
              id="monthlyFoodSpend"
              active={activeTooltip === 'monthlyFoodSpend'}
              toggle={() => toggleTooltip('monthlyFoodSpend')}
              text={tooltips.monthlyFoodSpend}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              id="monthlyFoodSpend"
              name="monthlyFoodSpend"
              value={formValues.monthlyFoodSpend}
              onChange={handleInputChange}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md"
              min="0"
              step="1"
              required
              aria-describedby="monthlyFoodSpend-description"
            />
          </div>
          <p id="monthlyFoodSpend-description" className="text-sm text-gray-600 mt-1">
            Tariffs on imported food from Mexico, Canada, and China can raise grocery bills.
          </p>
        </div>
        
        {/* Monthly Fuel Spend */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <label htmlFor="monthlyFuelSpend" className="font-medium text-lg">Monthly Fuel/Gasoline Spend</label>
            <TooltipInfo 
              id="monthlyFuelSpend"
              active={activeTooltip === 'monthlyFuelSpend'}
              toggle={() => toggleTooltip('monthlyFuelSpend')}
              text={tooltips.monthlyFuelSpend}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              id="monthlyFuelSpend"
              name="monthlyFuelSpend"
              value={formValues.monthlyFuelSpend}
              onChange={handleInputChange}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md"
              min="0"
              step="1"
              required
              aria-describedby="monthlyFuelSpend-description"
            />
          </div>
          <p id="monthlyFuelSpend-description" className="text-sm text-gray-600 mt-1">
            Canada supplies 60% of U.S. crude oil imports, affecting fuel prices for commuting and heating.
          </p>
        </div>
        
        {/* Monthly Clothing Spend */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <label htmlFor="monthlyClothingSpend" className="font-medium text-lg">Monthly Clothing & Apparel Spend</label>
            <TooltipInfo 
              id="monthlyClothingSpend"
              active={activeTooltip === 'monthlyClothingSpend'}
              toggle={() => toggleTooltip('monthlyClothingSpend')}
              text={tooltips.monthlyClothingSpend}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              id="monthlyClothingSpend"
              name="monthlyClothingSpend"
              value={formValues.monthlyClothingSpend}
              onChange={handleInputChange}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md"
              min="0"
              step="1"
              required
              aria-describedby="monthlyClothingSpend-description"
            />
          </div>
          <p id="monthlyClothingSpend-description" className="text-sm text-gray-600 mt-1">
            The U.S. imports $90B in clothing annually, including $30B from China and $10B from Mexico.
          </p>
        </div>
        
        {/* Automobile Purchase */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <label htmlFor="purchaseAutomobile" className="font-medium text-lg">Do You Plan to Purchase an Automobile this Year?</label>
            <TooltipInfo 
              id="purchaseAutomobile"
              active={activeTooltip === 'purchaseAutomobile'}
              toggle={() => toggleTooltip('purchaseAutomobile')}
              text={tooltips.purchaseAutomobile}
            />
          </div>
          <select
            id="purchaseAutomobile"
            name="purchaseAutomobile"
            value={formValues.purchaseAutomobile}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
            aria-describedby="purchaseAutomobile-description"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
          <p id="purchaseAutomobile-description" className="text-sm text-gray-600 mt-1">
            Canada/Mexico supply 40% of U.S. auto imports, which could see price hikes with tariffs.
          </p>
        </div>
        
        {/* State Selection */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <label htmlFor="state" className="font-medium text-lg">What State Do You Live In?</label>
            <TooltipInfo 
              id="state"
              active={activeTooltip === 'state'}
              toggle={() => toggleTooltip('state')}
              text={tooltips.state}
            />
          </div>
          <select
            id="state"
            name="state"
            value={formValues.state}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
            aria-describedby="state-description"
          >
            <option value="">Select a state</option>
            {usStates.map((state, index) => (
              <option key={index} value={state}>{state}</option>
            ))}
          </select>
          <p id="state-description" className="text-sm text-gray-600 mt-1">
            Tariffs impact you based on region.
          </p>
        </div>
        
        {/* Research Studies */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <label className="font-medium text-lg">Research Studies</label>
            <TooltipInfo 
              id="studies"
              active={activeTooltip === 'studies'}
              toggle={() => toggleTooltip('studies')}
              text={tooltips.studies}
            />
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Select expert studies estimating how much Trump's proposed tariffs could increase household costs.
          </p>
          
          <div className="space-y-2">
            {Object.keys(studyDefinitions).map((studyKey) => (
              <div key={studyKey} className="flex items-center">
                <input
                  type="checkbox"
                  id={studyKey}
                  name={`studies.${studyKey}`}
                  checked={formValues.studies[studyKey]}
                  onChange={handleInputChange}
                  className="h-4 w-4 mr-2"
                />
                <label htmlFor={studyKey} className="text-gray-700">{studyDefinitions[studyKey].name}</label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Calculate Your Trump Tariffs
        </button>
      </form>
    </section>
  );
};

export default TariffCalculatorForm;