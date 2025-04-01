import React from 'react';
import { useDrinkPriceCalculator } from './hooks/useDrinkPriceCalculator';
import IngredientInput from './components/IngredientInput';
import ResultsDisplay from './components/ResultsDisplay';
import ExportButtons from './components/ExportButtons';

export const DrinkPriceCalculator: React.FC = () => {
  const {
    state,
    calculationResult,
    updateDrinkName,
    updateDrinkType,
    addIngredient,
    removeIngredient,
    updateIngredient,
    updateTaxSettings,
    updateTargetCostPercentage,
    updateNotes,
    calculatePrice,
    resetCalculator
  } = useDrinkPriceCalculator();

  const generateTextContent = () => {
    if (!calculationResult) return '';

    let taxInfo = '';
    if (state.includeTax) {
      const preTaxPrice = calculationResult.suggestedPrice / (1 + state.taxRate / 100);
      const taxAmount = calculationResult.suggestedPrice - preTaxPrice;
      
      taxInfo = `
Pre-tax price: $${preTaxPrice.toFixed(2)}
Tax (${state.taxRate}%): $${taxAmount.toFixed(2)}`;
    }

    return `
Drink Pricing Report
-------------------
Drink Name: ${state.drinkName}
Drink Type: ${state.drinkType}

Ingredient Costs:
${calculationResult.ingredientCosts.map(ingredient => 
  `${ingredient.amount > 0 ? `${ingredient.amount} ${ingredient.unit}. ` : ''}${ingredient.name} - $${ingredient.cost.toFixed(2)}`
).join('\n')}

Total Ingredient Cost: $${calculationResult.totalCost.toFixed(2)}
Suggested Drink Price: $${calculationResult.suggestedPrice.toFixed(2)}${taxInfo}

Pricing Details:
- Target Cost Percentage: ${state.targetCostPercentage}%
${state.includeTax ? `- Tax Included: ${state.taxRate}%` : '- Tax Not Included'}

${state.notes ? `Notes:\n${state.notes}` : ''}
    `.trim();
  };

  const drinkTypeOptions = [
    { value: 'cocktail', label: 'Cocktail' },
    { value: 'beer', label: 'Beer' },
    { value: 'wine', label: 'Wine' },
    { value: 'spirit', label: 'Spirit' },
    { value: 'non-alcoholic', label: 'Non-Alcoholic' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="mr-3 text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="7" x2="15" y2="7"></line>
            <line x1="9" y1="11" x2="15" y2="11"></line>
            <line x1="9" y1="15" x2="13" y2="15"></line>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Drink Price Calculator</h1>
      </div>

      {!calculationResult ? (
        // Calculator Input Form
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="drinkName">
                Drink Name
              </label>
              <input
                id="drinkName"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={state.drinkName}
                onChange={(e) => updateDrinkName(e.target.value)}
                placeholder="e.g., Margarita"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="drinkType">
                Drink Type
              </label>
              <select
                id="drinkType"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={state.drinkType}
                onChange={(e) => updateDrinkType(e.target.value)}
              >
                {drinkTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Ingredients</h2>
              <button
                type="button"
                onClick={addIngredient}
                className="bg-blue-500 hover:bg-blue-700 text-skin-emerald-text font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline flex items-center border border-blue-600"
              >
                <span className="mr-1">+</span> Add Ingredient
              </button>
            </div>

            {state.ingredients.map((ingredient, index) => (
              <IngredientInput
                key={ingredient.id || index}
                ingredient={ingredient}
                onUpdate={(field, value) => updateIngredient(index, field, value)}
                onRemove={() => removeIngredient(index)}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="targetCostPercentage">
                Target Cost Percentage (%)
              </label>
              <input
                id="targetCostPercentage"
                type="number"
                min="1"
                max="100"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={state.targetCostPercentage}
                onChange={(e) => updateTargetCostPercentage(parseFloat(e.target.value) || 0)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Typical ranges: Cocktails 18-24%, Beer 20-30%, Wine 30-40%
              </p>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center mb-4">
                <input
                  id="includeTax"
                  type="checkbox"
                  checked={state.includeTax}
                  onChange={(e) => updateTaxSettings({includeTax: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="includeTax" className="ml-2 block text-gray-700">
                  Include Tax in Suggested Price
                </label>
              </div>
              
              {state.includeTax && (
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="taxRate">
                    Tax Rate (%)
                  </label>
                  <input
                    id="taxRate"
                    type="number"
                    min="0"
                    step="0.01"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={state.taxRate}
                    onChange={(e) => updateTaxSettings({taxRate: parseFloat(e.target.value) || 0})}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
              value={state.notes}
              onChange={(e) => updateNotes(e.target.value)}
              placeholder="Add any special notes about this drink..."
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={resetCalculator}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border border-gray-400"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={calculatePrice}
              className="bg-gradient-to-br from-green-50 to-emerald-50 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border border-emerald-200 hover:border-emerald-300"
            >
              Calculate Price
            </button>
          </div>
        </div>
      ) : (
        // Results Display
        <div>
          <ResultsDisplay 
            drinkName={state.drinkName} 
            result={calculationResult} 
            notes={state.notes}
            includeTax={state.includeTax}
            taxRate={state.taxRate}
          />
          <ExportButtons 
            drinkName={state.drinkName}
            textContent={generateTextContent()}
            reportData={[
              { label: 'Total Ingredient Cost', value: `$${calculationResult.totalCost.toFixed(2)}` },
              { label: 'Suggested Drink Price', value: `$${calculationResult.suggestedPrice.toFixed(2)}` },
            ]}
          />
          <div className="mt-6">
            <button
              type="button"
              onClick={resetCalculator}
              className="bg-gradient-to-br from-green-50 to-emerald-50 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border border-emerald-200 hover:border-emerald-300"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrinkPriceCalculator;