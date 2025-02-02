export interface Ingredient {
  name: string;
  ounces: number;
  bulkCost?: number;
}

export interface RecipeData {
  name: string;
  notes: string;
  originalServings: number;
  desiredServings: number;
  ingredients: Ingredient[];
}

export interface CalculatedIngredient extends Ingredient {
  adjustedOunces: number;
  adjustedCost?: number;
}