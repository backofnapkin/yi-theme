import React from 'react';
import type { CalculationResult } from '../hooks/useDrinkPriceCalculator';

interface ResultsDisplayProps {
  drinkName: string;
  result: CalculationResult;
  notes: string;
  includeTax: boolean;
  taxRate: number;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  drinkName, 
  result, 
  notes, 
  includeTax, 
  taxRate 
}) => {
  // Calculate the pre-tax price and tax amount if tax is included
  const calculateTaxInfo = () => {
    if (!includeTax) return null;
    
    const preTaxPrice = result.suggestedPrice / (1 + taxRate / 100);
    const taxAmount = result.suggestedPrice - preTaxPrice;
    
    return {
      preTaxPrice,
      taxAmount
    };
  };
  
  const taxInfo = calculateTaxInfo();

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Drink Pricing Results</h2>
        <div className="text-gray-500 text-sm">
          {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {drinkName || 'Unnamed Drink'}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-bold text-gray-700 mb-3">Ingredient Costs</h4>
          <div className="space-y-2">
            {result.ingredientCosts.map((ingredient, index) => (
              <div key={index} className="flex justify-between">
                <span>
                  {ingredient.amount > 0 ? `${ingredient.amount} ${ingredient.unit}. ` : ''}{ingredient.name}
                </span>
                <span className="font-semibold">${ingredient.cost.toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-2 border-t border-gray-200">
            <div className="flex justify-between font-bold">
              <span>Total Ingredient Cost:</span>
              <span className="text-skin-red-text">${result.totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-center items-center bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-2">
            Suggested Drink Price
          </h3>
          <p className="text-3xl font-bold text-skin-emerald-text mb-2">
            ${result.suggestedPrice.toFixed(2)}
          </p>
          
          {includeTax && taxInfo && (
            <div className="w-full text-sm mt-2">
              <div className="flex justify-between text-gray-600">
                <span>Pre-tax price:</span>
                <span>${taxInfo.preTaxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax ({taxRate}%):</span>
                <span>${taxInfo.taxAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {notes && (
        <div className="mb-4">
          <h4 className="font-bold text-gray-700 mb-2">Notes</h4>
          <div className="bg-white p-3 rounded border border-gray-200">
            <p className="whitespace-pre-line">{notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;