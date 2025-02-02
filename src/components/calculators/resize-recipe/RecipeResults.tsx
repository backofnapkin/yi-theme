import React from 'react';
import { ClipboardList, DollarSign, Printer, Download, Info } from 'lucide-react';
import type { RecipeData, CalculatedIngredient } from './types';
import { MeasurementConversions } from './MeasurementConversions';
import { convertOuncesToCommonMeasurements } from './utils/conversions';
import { Tooltip } from '../../ui/Tooltip';

interface RecipeResultsProps {
  recipe: RecipeData;
  calculatedIngredients: CalculatedIngredient[];
  totalCost: number;
}

export function RecipeResults({ recipe, calculatedIngredients, totalCost }: RecipeResultsProps) {
  const costPerServing = totalCost / recipe.desiredServings;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `
Recipe: ${recipe.name}
Notes: ${recipe.notes}
Original Servings: ${recipe.originalServings}
Desired Servings: ${recipe.desiredServings}

Ingredients:
${calculatedIngredients
  .map(
    (ing) =>
      `${ing.name}: ${convertOuncesToCommonMeasurements(ing.adjustedOunces, ing.name)} ${
        ing.adjustedCost ? `($${ing.adjustedCost.toFixed(2)})` : ''
      }`
  )
  .join('\n')}

Total Cost: $${totalCost.toFixed(2)}
Cost Per Serving: $${costPerServing.toFixed(2)}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.name.replace(/\s+/g, '-')}-recipe.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{recipe.name}</h2>
        <div className="flex gap-2">
          <Tooltip content="Print your resized recipe">
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 hover:text-gray-800 transition"
              title="Print Recipe"
            >
              <Printer className="w-5 h-5" />
            </button>
          </Tooltip>
          <Tooltip content="Download recipe as a text file">
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-gray-800 transition"
              title="Download Recipe"
            >
              <Download className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
      </div>

      {recipe.notes && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Notes</h3>
          <p className="text-gray-600">{recipe.notes}</p>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Adjusted Recipe Shopping List</h3>
            <Tooltip content="Your recipe scaled to the desired servings with adjusted measurements and costs">
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
            </Tooltip>
          </div>
          <div className="space-y-4">
            {calculatedIngredients.map((ingredient, index) => (
              <div key={index} className="flex flex-col p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg">{ingredient.name}</span>
                  <span className="font-medium">
                    {convertOuncesToCommonMeasurements(ingredient.adjustedOunces, ingredient.name)}
                  </span>
                </div>
                {ingredient.adjustedCost && (
                  <span className="text-gray-600 text-sm mt-1">
                    Estimated Cost: ${ingredient.adjustedCost.toFixed(2)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold">Cost Summary</h3>
          <Tooltip content="Total cost and cost per serving based on your ingredient costs">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
          </Tooltip>
        </div>
        <div className="mt-2 space-y-2">
          <p className="text-2xl font-bold text-skin-emerald-text">
            Total Cost: ${totalCost.toFixed(2)}
          </p>
          <p className="text-lg text-skin-red-text">
            Cost Per Serving: ${costPerServing.toFixed(2)}
            <span className="text-sm text-gray-600 ml-2">
              (for {recipe.desiredServings} servings)
            </span>
          </p>
        </div>
      </div>

      <MeasurementConversions />
    </div>
  );
}