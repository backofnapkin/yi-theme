import { measurementConversions } from '../MeasurementConversions';

export function convertOuncesToCommonMeasurements(ounces: number, ingredientName: string): string {
  let measurements: string[] = [];
  
  // Add the base measurement in ounces
  measurements.push(`${ounces.toFixed(2)} oz`);

  // Convert to pounds if more than 16 ounces
  if (ounces >= 16) {
    const pounds = ounces / measurementConversions.weight.pound;
    measurements.push(`(${pounds.toFixed(2)} lbs)`);
  }

  // Handle specific ingredients
  const lowerIngredient = ingredientName.toLowerCase();
  
  if (lowerIngredient.includes('butter')) {
    const sticks = ounces / measurementConversions.ingredients.butter.stick;
    const cups = ounces / measurementConversions.ingredients.butter.cup;
    if (sticks >= 1) measurements.push(`(${sticks.toFixed(1)} sticks)`);
    if (cups >= 0.25) measurements.push(`(${cups.toFixed(2)} cups)`);
  }
  
  else if (lowerIngredient.includes('flour')) {
    const cups = ounces / measurementConversions.ingredients.flour.cup;
    if (cups >= 0.25) measurements.push(`(${cups.toFixed(2)} cups)`);
  }
  
  else if (lowerIngredient.includes('sugar')) {
    const cups = ounces / measurementConversions.ingredients.sugar.cup;
    if (cups >= 0.25) measurements.push(`(${cups.toFixed(2)} cups)`);
  }
  
  // Handle liquid ingredients
  else if (
    lowerIngredient.includes('water') ||
    lowerIngredient.includes('milk') ||
    lowerIngredient.includes('oil') ||
    lowerIngredient.includes('juice')
  ) {
    const cups = ounces / measurementConversions.volume.cup;
    if (cups >= 0.25) {
      if (cups >= 4) {
        const quarts = cups / 4;
        measurements.push(`(${quarts.toFixed(2)} quarts)`);
      } else {
        measurements.push(`(${cups.toFixed(2)} cups)`);
      }
    } else if (ounces < 1) {
      const tablespoons = ounces / measurementConversions.volume.tablespoon;
      measurements.push(`(${tablespoons.toFixed(1)} tbsp)`);
    }
  }

  return measurements.join(' ');
}