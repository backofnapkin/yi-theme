import React, { useState } from 'react';
import { RecipeForm } from './RecipeForm';
import { RecipeResults } from './RecipeResults';
import type { RecipeData, CalculatedIngredient } from './types';
import { BorderContainer } from '../../ui/BorderContainer';

const defaultRecipe: RecipeData = {
  name: 'Lemon Garlic Butter Salmon',
  notes: '',
  originalServings: 4,
  desiredServings: 20,
  ingredients: [
    { name: 'Salmon Filets', ounces: 24, bulkCost: 30.00 },
    { name: 'Butter', ounces: 2, bulkCost: 5.00 },
    { name: 'Garlic', ounces: 1, bulkCost: 3.00 },
    { name: 'Lemon', ounces: 2, bulkCost: 2.50 },
    { name: 'Fresh Parsley', ounces: 0.5, bulkCost: 3.50 }
  ]
};

export function ResizeRecipeCalculator() {
  const [recipe, setRecipe] = useState<RecipeData>(defaultRecipe);
  const [calculatedResults, setCalculatedResults] = useState<CalculatedIngredient[]>([]);
  const [showResults, setShowResults] = useState(false);

  const calculateRecipe = () => {
    const scaleFactor = recipe.desiredServings / recipe.originalServings;
    
    const calculated = recipe.ingredients.map(ingredient => {
      const adjustedOunces = ingredient.ounces * scaleFactor;
      const adjustedCost = ingredient.bulkCost 
        ? (ingredient.bulkCost * scaleFactor)
        : undefined;

      return {
        ...ingredient,
        adjustedOunces,
        adjustedCost
      };
    });

    setCalculatedResults(calculated);
    setShowResults(true);
  };

  const resetCalculator = () => {
    setRecipe(defaultRecipe);
    setCalculatedResults([]);
    setShowResults(false);
  };

  const totalCost = calculatedResults.reduce((sum, ingredient) => 
    sum + (ingredient.adjustedCost || 0), 0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <h1 className="text-3xl font-bold text-center mb-4">Recipe Resizing Calculator</h1>
      
      <BorderContainer>
        <RecipeForm
          recipe={recipe}
          onChange={setRecipe}
          onCalculate={calculateRecipe}
          onReset={resetCalculator}
        />
      </BorderContainer>

      {showResults && (
        <BorderContainer className="mt-8">
          <RecipeResults
            recipe={recipe}
            calculatedIngredients={calculatedResults}
            totalCost={totalCost}
          />
        </BorderContainer>
      )}
    </div>
  );
}