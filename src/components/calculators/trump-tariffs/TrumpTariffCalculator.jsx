import React, { useState } from 'react';
import { Info } from 'lucide-react';
// Import the state benefits data
import { stateBenefits, dataSources } from './stateBenefitsData'; // Corrected import
import { calculateTariffImpact, studyDefinitions } from './tariffLogic'; // New logic import
import TariffCalculatorResults from './TariffCalculatorResults'; // Separate results component

const TrumpTariffCalculator = () => {
  // Default values (unchanged)
  const defaultValues = {
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
      budgetLabYale: true,
      liberationDay: true // Added Liberation Day checkbox
    }
  };

  // State declarations
  const [formValues, setFormValues] = useState(defaultValues);
  const [results, setResults] = useState(null);
  const [stateInsight, setStateInsight] = useState("");
  const [stateHow, setStateHow] = useState("");
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [showSources, setShowSources] = useState(false);

  // List of US states (unchanged)
  const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", 
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", 
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", 
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", 
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", 
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", 
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  // Tooltip descriptions (unchanged)
  const tooltips = {
    totalMonthlySpend: "Enter your total monthly household expenditure across all categories",
    monthlyFoodSpend: "Enter your monthly spending on groceries and food",
    monthlyFuelSpend: "Enter your monthly spending on gasoline, diesel, and other fuel",
    monthlyClothingSpend: "Enter your monthly spending on clothing and apparel", 
    purchaseAutomobile: "Select 'Yes' if you plan to purchase a vehicle this year",
    state: "Select your state of residence to see regional impacts",
    studies: "Select expert studies estimating tariff impacts on households, including Liberation Day Tariffs announced April 2, 2025"
  };

  // Handle tooltip toggle
  const toggleTooltip = (tooltipId) => {
    setActiveTooltip(activeTooltip === tooltipId ? null : tooltipId);
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
    const newResults = calculateTariffImpact(formValues);
    setResults(newResults);
    setStateInsight(stateBenefits[formValues.state]?.insight || stateBenefits.default.insight);
    setStateHow(stateBenefits[formValues.state]?.how || stateBenefits.default.how);
    document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Toggle data sources display
  const toggleDataSources = () => {
    setShowSources(!showSources);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      {/* Header with Trump image */}
      <div className="flex items-center justify-center mb-2">
        <img 
          src="/images/trump-128-128.svg" 
          alt="Donald Trump Silhouette" 
          className="h-16 w-16 mr-4"
        />
        <h1 className="text-3xl font-bold text-center">The Trump Tariff Calculator</h1>
      </div>
      
      <section className="bg-gray-50 p-6 rounded-lg mb-8">
        <form onSubmit={handleSubmit}>
          {/* Two-column layout for form inputs */}
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Row 1: Total Monthly Spend and Monthly Food Spend */}
            <div>
              <div className="flex items-center mb-2">
                <label className="font-medium text-lg">Total Monthly Spend</label>
                <button 
                  type="button" 
                  className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => toggleTooltip('totalMonthlySpend')}
                  aria-label="Information about Total Monthly Spend"
                >
                  <Info size={16} />
                </button>
              </div>
              {activeTooltip === 'totalMonthlySpend' && (
                <div className="mb-2 p-2 bg-blue-50 text-blue-800 rounded-md">
                  {tooltips.totalMonthlySpend}
                </div>
              )}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="totalMonthlySpend"
                  value={formValues.totalMonthlySpend}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md"
                  min="0"
                  step="1"
                  required
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Tariffs on imports raise everyday costs.
              </p>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <label className="font-medium text-lg">Monthly Food Spend</label>
                <button 
                  type="button" 
                  className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => toggleTooltip('monthlyFoodSpend')}
                  aria-label="Information about Monthly Food Spend"
                >
                  <Info size={16} />
                </button>
              </div>
              {activeTooltip === 'monthlyFoodSpend' && (
                <div className="mb-2 p-2 bg-blue-50 text-blue-800 rounded-md">
                  {tooltips.monthlyFoodSpend}
                </div>
              )}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="monthlyFoodSpend"
                  value={formValues.monthlyFoodSpend}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md"
                  min="0"
                  step="1"
                  required
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Tariffs on imported food impact grocery bills.
              </p>
            </div>

            {/* Row 2: Monthly Fuel/Gasoline Spend and Monthly Clothing & Apparel Spend */}
            <div>
              <div className="flex items-center mb-2">
                <label className="font-medium text-lg">Monthly Fuel/Gasoline Spend</label>
                <button 
                  type="button" 
                  className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => toggleTooltip('monthlyFuelSpend')}
                  aria-label="Information about Monthly Fuel Spend"
                >
                  <Info size={16} />
                </button>
              </div>
              {activeTooltip === 'monthlyFuelSpend' && (
                <div className="mb-2 p-2 bg-blue-50 text-blue-800 rounded-md">
                  {tooltips.monthlyFuelSpend}
                </div>
              )}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="monthlyFuelSpend"
                  value={formValues.monthlyFuelSpend}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md"
                  min="0"
                  step="1"
                  required
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Canada supplies 60% of U.S. crude oil imports.
              </p>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <label className="font-medium text-lg">Monthly Clothing & Apparel Spend</label>
                <button 
                  type="button" 
                  className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => toggleTooltip('monthlyClothingSpend')}
                  aria-label="Information about Monthly Clothing Spend"
                >
                  <Info size={16} />
                </button>
              </div>
              {activeTooltip === 'monthlyClothingSpend' && (
                <div className="mb-2 p-2 bg-blue-50 text-blue-800 rounded-md">
                  {tooltips.monthlyClothingSpend}
                </div>
              )}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="monthlyClothingSpend"
                  value={formValues.monthlyClothingSpend}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md"
                  min="0"
                  step="1"
                  required
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                The U.S. imports $90B in clothing annually.
              </p>
            </div>

            {/* Row 3: Purchase Automobile and State Selection */}
            <div>
              <div className="flex items-center mb-2">
                <label className="font-medium text-lg">Purchase Automobile This Year?</label>
                <button 
                  type="button" 
                  className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => toggleTooltip('purchaseAutomobile')}
                  aria-label="Information about automobile purchase"
                >
                  <Info size={16} />
                </button>
              </div>
              {activeTooltip === 'purchaseAutomobile' && (
                <div className="mb-2 p-2 bg-blue-50 text-blue-800 rounded-md">
                  {tooltips.purchaseAutomobile}
                </div>
              )}
              <select
                name="purchaseAutomobile"
                value={formValues.purchaseAutomobile}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
              <p className="text-sm text-gray-600 mt-1">
                Canada/Mexico supply 40% of U.S. auto imports.
              </p>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <label className="font-medium text-lg">What State Do You Live In?</label>
                <button 
                  type="button" 
                  className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => toggleTooltip('state')}
                  aria-label="Information about state selection"
                >
                  <Info size={16} />
                </button>
              </div>
              {activeTooltip === 'state' && (
                <div className="mb-2 p-2 bg-blue-50 text-blue-800 rounded-md">
                  {tooltips.state}
                </div>
              )}
              <select
                name="state"
                value={formValues.state}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select a state</option>
                {usStates.map((state, index) => (
                  <option key={index} value={state}>{state}</option>
                ))}
              </select>
              <p className="text-sm text-gray-600 mt-1">
                Tariffs impact you based on region.
              </p>
            </div>
          </div>
          
          {/* Research Studies section */}
          <div className="mt-6">
            <div className="flex items-center mb-2">
              <label className="font-medium text-lg">Research Studies</label>
              <button 
                type="button" 
                className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => toggleTooltip('studies')}
                aria-label="Information about research studies"
              >
                <Info size={16} />
              </button>
            </div>
            {activeTooltip === 'studies' && (
              <div className="mb-2 p-2 bg-blue-50 text-blue-800 rounded-md">
                {tooltips.studies}
              </div>
            )}
            <p className="text-sm text-gray-600 mb-2">
              Select expert studies estimating how much Trump's proposed tariffs could increase household costs.
            </p>
            
            {/* Two-column layout for study checkboxes */}
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="taxFoundation"
                  name="studies.taxFoundation"
                  checked={formValues.studies.taxFoundation}
                  onChange={handleInputChange}
                  className="h-4 w-4 mr-2"
                />
                <label htmlFor="taxFoundation" className="text-gray-700">Tax Foundation</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="jointEconomicCommittee"
                  name="studies.jointEconomicCommittee"
                  checked={formValues.studies.jointEconomicCommittee}
                  onChange={handleInputChange}
                  className="h-4 w-4 mr-2"
                />
                <label htmlFor="jointEconomicCommittee" className="text-gray-700">Joint Economic Committee</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="piie"
                  name="studies.piie"
                  checked={formValues.studies.piie}
                  onChange={handleInputChange}
                  className="h-4 w-4 mr-2"
                />
                <label htmlFor="piie" className="text-gray-700">PIIE</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="budgetLabYale"
                  name="studies.budgetLabYale"
                  checked={formValues.studies.budgetLabYale}
                  onChange={handleInputChange}
                  className="h-4 w-4 mr-2"
                />
                <label htmlFor="budgetLabYale" className="text-gray-700">Budget Lab at Yale</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="liberationDay"
                  name="studies.liberationDay"
                  checked={formValues.studies.liberationDay}
                  onChange={handleInputChange}
                  className="h-4 w-4 mr-2"
                />
                <label htmlFor="liberationDay" className="text-gray-700">Liberation Day Tariffs</label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-2 rounded-lg font-semibold transition-colors bg-gradient-to-br from-green-50 to-emerald-50 text-gray-700 hover:from-green-100 hover:to-emerald-100 active:from-green-200 active:to-emerald-200 border border-emerald-100 shadow-sm mt-6"
          >
            Calculate Your Trump Tariffs
          </button>
        </form>
      </section>

      {/* Results Section */}
      {results && (
        <TariffCalculatorResults
          results={results}
          formValues={formValues}
          stateInsight={stateInsight}
          stateHow={stateHow}
          showSources={showSources}
          toggleDataSources={toggleDataSources}
        />
      )}
    </div>
  );
};

export default TrumpTariffCalculator;