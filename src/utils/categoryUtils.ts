export function categoryToSlug(category: string): string {
  const categoryMap: Record<string, string> = {
    'Business Calculators': 'business-calculators',
    'Food Business Calculators': 'food-business-calculators',
    'Lawn Care Calculators': 'lawn-care-calculators',
    'Personal Finance Calculators': 'personal-finance-calculators',
    'Contractor Calculators': 'contractor-calculators'
  };
  return categoryMap[category] || category.toLowerCase().replace(/\s+/g, '-');
}
