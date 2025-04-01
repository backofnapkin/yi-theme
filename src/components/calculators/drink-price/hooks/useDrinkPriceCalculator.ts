import { useState } from 'react';

// Define types
export interface Ingredient {
  id?: string;
  name: string;
  amount: number;
  unit: string;
  packageSize: number;
  packageUnit: string;
  packagePrice: number;
}

interface TaxSettings {
  includeTax?: boolean;
  taxRate?: number;
}

interface CalculatorState {
  drinkName: string;
  drinkType: string;
  ingredients: Ingredient[];
  targetCostPercentage: number;
  includeTax: boolean;
  taxRate: number;
  notes: string;
}

export interface IngredientCost {
  name: string;
  amount: number;
  unit: string;
  cost: number;
}

export interface CalculationResult {
  ingredientCosts: IngredientCost[];
  totalCost: number;
  suggestedPrice: number;
}

// Create a unique ID for ingredients
const createId = () => Math.random().toString(36).substring(2, 9);

// Initial empty ingredient
const createEmptyIngredient = (): Ingredient => ({
  id: createId(),
  name: '',
  amount: 0,
  unit: 'oz',
  packageSize: 0,
  packageUnit: 'oz',
  packagePrice: 0
});

export const useDrinkPriceCalculator = () => {
  // Initial state
  const [state, setState] = useState<CalculatorState>({
    drinkName: '',
    drinkType: 'cocktail',
    ingredients: [createEmptyIngredient()],
    targetCostPercentage: 20,
    includeTax: false,
    taxRate: 8.25,
    notes: ''
  });

  // State for calculation result
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  // Update drink name
  const updateDrinkName = (name: string) => {
    setState({ ...state, drinkName: name });
  };

  // Update drink type
  const updateDrinkType = (type: string) => {
    setState({ ...state, drinkType: type });
  };

  // Add a new ingredient
  const addIngredient = () => {
    setState({
      ...state,
      ingredients: [...state.ingredients, createEmptyIngredient()]
    });
  };

  // Remove an ingredient
  const removeIngredient = (index: number) => {
    if (state.ingredients.length === 1) {
      // Don't remove the last ingredient, just clear it
      const clearedIngredient = createEmptyIngredient();
      const newIngredients = [clearedIngredient];
      setState({ ...state, ingredients: newIngredients });
    } else {
      const newIngredients = [...state.ingredients];
      newIngredients.splice(index, 1);
      setState({ ...state, ingredients: newIngredients });
    }
  };

  // Update an ingredient
  const updateIngredient = (index: number, field: keyof Ingredient, value: any) => {
    const newIngredients = [...state.ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: field === 'name' ? value : parseFloat(value) || 0
    };
    setState({ ...state, ingredients: newIngredients });
  };

  // Update tax settings
  const updateTaxSettings = ({ includeTax, taxRate }: TaxSettings) => {
    setState({
      ...state,
      includeTax: includeTax !== undefined ? includeTax : state.includeTax,
      taxRate: taxRate !== undefined ? taxRate : state.taxRate
    });
  };

  // Update target cost percentage
  const updateTargetCostPercentage = (percentage: number) => {
    setState({ ...state, targetCostPercentage: percentage });
  };

  // Update notes
  const updateNotes = (notes: string) => {
    setState({ ...state, notes });
  };

  // Calculate ingredient cost
  const calculateIngredientCost = (ingredient: Ingredient): number => {
    if (!ingredient.amount || !ingredient.packageSize || !ingredient.packagePrice) {
      return 0;
    }
    
    return (ingredient.amount / ingredient.packageSize) * ingredient.packagePrice;
  };

  // Calculate price
  const calculatePrice = () => {
    // Calculate the cost of each ingredient
    const ingredientCosts: IngredientCost[] = state.ingredients.map(ingredient => ({
      name: ingredient.name || 'Unnamed Ingredient',
      amount: ingredient.amount,
      unit: ingredient.unit,
      cost: calculateIngredientCost(ingredient)
    }));

    // Calculate the total cost
    const totalCost = ingredientCosts.reduce((sum, { cost }) => sum + cost, 0);

    // Calculate the suggested price
    let suggestedPrice = totalCost / (state.targetCostPercentage / 100);
    
    // Add tax if needed
    if (state.includeTax) {
      suggestedPrice *= (1 + state.taxRate / 100);
    }

    // Set the calculation result
    setCalculationResult({
      ingredientCosts,
      totalCost,
      suggestedPrice
    });
  };

  // Reset calculator
  const resetCalculator = () => {
    setState({
      drinkName: '',
      drinkType: 'cocktail',
      ingredients: [createEmptyIngredient()],
      targetCostPercentage: 20,
      includeTax: false,
      taxRate: 8.25,
      notes: ''
    });
    setCalculationResult(null);
  };

  return {
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
  };
};

export default useDrinkPriceCalculator;