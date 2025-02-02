import React from 'react';
import { Utensils, FileText, Users, Calculator, X } from 'lucide-react';
import type { RecipeData, Ingredient } from './types';
import { DecimalInput } from '../../ui/DecimalInput';
import { InputButton } from '../../ui/InputButton';

interface RecipeFormProps {
  recipe: RecipeData;
  onChange: (recipe: RecipeData) => void;
  onCalculate: () => void;
  onReset: () => void;
}

export function RecipeForm({ recipe, onChange, onCalculate, onReset }: RecipeFormProps) {
  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    onChange({ ...recipe, ingredients: newIngredients });
  };

  const addIngredient = () => {
    onChange({
      ...recipe,
      ingredients: [...recipe.ingredients, { name: '', ounces: 0 }]
    });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    onChange({ ...recipe, ingredients: newIngredients });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Utensils className="w-5 h-5 text-blue-600" />
            <label className="text-lg font-semibold">Recipe Name</label>
          </div>
          <input
            type="text"
            value={recipe.name}
            onChange={(e) => onChange({ ...recipe, name: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
            placeholder="Enter recipe name"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <label className="text-lg font-semibold">Recipe Notes</label>
          </div>
          <textarea
            value={recipe.notes}
            onChange={(e) => onChange({ ...recipe, notes: e.target.value })}
            maxLength={350}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow h-24"
            placeholder="Optional recipe notes (max 350 words)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DecimalInput
            label={
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-semibold">Original Servings</span>
              </div>
            }
            value={recipe.originalServings}
            onChange={(value) => onChange({ ...recipe, originalServings: value })}
            min={1}
            max={999}
            step={1}
          />

          <DecimalInput
            label={
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-semibold">Desired Servings</span>
              </div>
            }
            value={recipe.desiredServings}
            onChange={(value) => onChange({ ...recipe, desiredServings: value })}
            min={1}
            max={999}
            step={1}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Ingredients</h3>
            <InputButton onClick={addIngredient}>
              Add Ingredient
            </InputButton>
          </div>

          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded">
              <div>
                <label className="block text-sm font-medium mb-1">Ingredient Name</label>
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                  placeholder="Enter ingredient name"
                />
              </div>
              <DecimalInput
                label="Ounces"
                value={ingredient.ounces}
                onChange={(value) => handleIngredientChange(index, 'ounces', value)}
                min={0}
                step={0.1}
              />
              <DecimalInput
                label="Bulk Cost"
                value={ingredient.bulkCost || 0}
                onChange={(value) => handleIngredientChange(index, 'bulkCost', value)}
                min={0}
                step={0.01}
                prefix="$"
              />
              <div className="flex items-end">
                <button
                  onClick={() => removeIngredient(index)}
                  className="p-2 text-red-600 hover:text-red-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <InputButton onClick={onCalculate} className="flex-1">
            Resize My Recipe
          </InputButton>
          <InputButton onClick={onReset} variant="secondary">
            Reset
          </InputButton>
        </div>
      </div>
    </div>
  );
}