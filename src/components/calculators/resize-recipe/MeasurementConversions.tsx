import React from 'react';
import { Scale } from 'lucide-react';

export const measurementConversions = {
  // Base units (everything relative to ounces)
  volume: {
    teaspoon: 0.1667,
    tablespoon: 0.5,
    fluidOunce: 1,
    cup: 8,
    pint: 16,
    quart: 32,
    gallon: 128,
    milliliter: 0.0338,
    liter: 33.814,
    quarterCup: 2,
    thirdCup: 2.67,
    halfCup: 4,
    threeFourthsCup: 6,
  },
  weight: {
    gram: 0.0353,
    kilogram: 35.274,
    pound: 16,
    ounce: 1,
    milligram: 0.0000353,
  },
  ingredients: {
    flour: {
      cup: 4.25,
      tablespoon: 0.265,
      gram: 0.0353,
    },
    sugar: {
      cup: 7,
      tablespoon: 0.437,
      gram: 0.0353,
    },
    butter: {
      cup: 8,
      tablespoon: 0.5,
      stick: 4,
      gram: 0.0353,
    },
    rice: {
      cup: 6.25,
      gram: 0.0353,
    },
    oats: {
      cup: 3.17,
      gram: 0.0353,
    },
    breadCrumbs: {
      cup: 3.75,
      gram: 0.0353,
    }
  },
  liquids: {
    water: {
      cup: 8,
      milliliter: 0.0338,
      liter: 33.814,
    },
    milk: {
      cup: 8,
      milliliter: 0.0338,
      liter: 33.814,
    },
    oil: {
      cup: 8,
      tablespoon: 0.5,
      milliliter: 0.0338,
    }
  }
};

export function MeasurementConversions() {
  return (
    <div className="bg-gradient-to-br from-orange-100 to-amber-100 border border-amber-200 p-6 rounded-lg shadow-md mt-4">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-blue-900">Common Kitchen Conversions</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <h4 className="font-semibold text-blue-800 mb-2">Volume Measurements</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>1 tablespoon = 3 teaspoons</li>
            <li>1 cup = 16 tablespoons</li>
            <li>1 cup = 8 fluid ounces</li>
            <li>1 pint = 2 cups</li>
            <li>1 quart = 4 cups</li>
            <li>1 gallon = 4 quarts</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-blue-800 mb-2">Weight Conversions</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>1 pound = 16 ounces</li>
            <li>1 kilogram = 35.27 ounces</li>
            <li>1 gram = 0.035 ounces</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-blue-800 mb-2">Common Ingredients</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>1 cup flour = 4.25 oz</li>
            <li>1 cup sugar = 7 oz</li>
            <li>1 cup butter = 8 oz (2 sticks)</li>
            <li>1 stick butter = 4 oz (8 tbsp)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}