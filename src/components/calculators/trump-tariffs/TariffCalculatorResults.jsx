import React from 'react';
import { ArrowRight } from 'lucide-react';
import { studyDefinitions } from './tariffLogic';
import { dataSources } from './stateBenefitsData';
import TariffChart from './TariffChart';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const TariffCalculatorResults = ({ results, formValues, stateInsight, stateHow, showSources, toggleDataSources }) => {
  const chartData = [
    {
      name: 'Annual Expenses',
      Before: formValues.totalMonthlySpend * 12,
      'Low Tariff Impact': formValues.totalMonthlySpend * 12 + results.lowEndAnnualImpact,
      'High Tariff Impact': formValues.totalMonthlySpend * 12 + results.highEndAnnualImpact,
    }
  ];

  return (
    <section id="results-section" className="bg-gray-50 p-6 rounded-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Your Projected Annual Trump Tariffs</h2>
        <div className="text-4xl font-bold text-red-600 mb-6">
          {formatCurrency(results.lowEndAnnualImpact)} - {formatCurrency(results.highEndAnnualImpact)}
        </div>
        <div className="mb-6">
          <TariffChart chartData={chartData} /> {/* Chart only, no labels above */}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Expect to pay more on everyday items:</h3>
        <ul className="space-y-3">
          <li className="flex items-center">
            <ArrowRight size={16} className="text-red-600 mr-2 flex-shrink-0" />
            <span>{formatCurrency(results.foodTariffAnnual)} more per year / {formatCurrency(results.foodTariffMonthly)} per month on groceries</span>
          </li>
          <li className="flex items-center">
            <ArrowRight size={16} className="text-red-600 mr-2 flex-shrink-0" />
            <span>{formatCurrency(results.fuelTariffAnnual)} more per year / {formatCurrency(results.fuelTariffMonthly)} per month on fuel</span>
          </li>
          <li className="flex items-center">
            <ArrowRight size={16} className="text-red-600 mr-2 flex-shrink-0" />
            <span>{formatCurrency(results.clothingTariffAnnual)} more per year / {formatCurrency(results.clothingTariffMonthly)} per month on clothing</span>
          </li>
          {results.purchaseAutomobile === "Yes" && (
            <li className="flex items-center">
              <ArrowRight size={16} className="text-red-600 mr-2 flex-shrink-0" />
              <span>Your vehicle will cost {results.autoTariffImpact ? formatCurrency(results.autoTariffImpact) : "$5,000 - $15,000"} more.</span>
            </li>
          )}
        </ul>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">
          Based on your average monthly spend of {formatCurrency(formValues.totalMonthlySpend)}, you can expect to pay this much more depending on the study:
        </h3>
        <ul className="space-y-3">
          {Object.keys(studyDefinitions).map(studyKey => 
            formValues.studies[studyKey] && results[studyKey + 'Impact'] && (
              <li key={studyKey} className="flex items-start">
                <ArrowRight size={16} className="text-red-600 mr-2 mt-1 flex-shrink-0" />
                <div>
                  <div>
                    <a href={studyDefinitions[studyKey].url} target="_blank" rel="noopener noreferrer" className="text-[#B57614] hover:text-amber-800 hover:underline">
                      {studyDefinitions[studyKey].name}
                    </a>: {formatCurrency(results[studyKey + 'Impact'])}/month. New total: {formatCurrency(results[studyKey + 'Total'])}
                  </div>
                  <div className="text-gray-600 text-sm">
                    ({formatCurrency(formValues.totalMonthlySpend)} × {studyDefinitions[studyKey].multiplier} = {formatCurrency(results[studyKey + 'Impact'])})
                  </div>
                </div>
              </li>
            )
          )}
        </ul>
      </div>

      {formValues.state && (
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-4">Tariffs may benefit residents of {formValues.state} in the following ways:</h3>
          <div className="p-4 bg-blue-50 rounded-md">
            <p className="text-lg font-semibold text-blue-800 mb-2">{stateInsight}</p>
            <p className="text-blue-700">{stateHow}</p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <button type="button" onClick={toggleDataSources} className="text-[#B57614] hover:text-amber-800 underline focus:outline-none">
          {showSources ? "Hide Data Sources" : "Show Data Sources"}
        </button>
        {showSources && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h4 className="font-bold mb-2">Supporting Data Sources</h4>
            <ul className="space-y-2">
              {Object.values(dataSources).map((source, index) => (
                <li key={index}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[#B57614] hover:text-amber-800 hover:underline">
                    {source.name}
                  </a>: {source.description}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              These insights are estimates based on tariff rates (25% Canada/Mexico, 20% China), 90% cost pass-through (NBER), and historical job creation patterns, adjusted for state industry strengths.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TariffCalculatorResults;