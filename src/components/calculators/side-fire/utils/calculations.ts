import type { CalculatorInputs, CalculationResults, YearlyData, ChartData } from '../types';

// Format currency values consistently
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

// Format numbers with commas for readability
export function formatNumberWithCommas(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

// Parse formatted numbers back to numeric values
export function parseFormattedNumber(value: string): number {
  return Number(value.replace(/[^0-9.-]/g, ''));
}

// Export calculation results to CSV
export function exportToCSV(results: CalculationResults): void {
  // Header message with branding
  const headerMessage = 'Your Side Hustle FIRE Calculations\nProvided by BackofNapkin.co - Visit https://backofnapkin.co for more calculators\n\n';

  // Define headers
  const headers = [
    'Age',
    'Years Elapsed',
    'Main Job Savings',
    'Side Hustle Savings',
    'Combined Savings',
    'Total Invested Assets',
    'Annual Return'
  ];

  // Format data rows
  const rows = results.yearlyData.map(row => ([
    row.age,
    row.yearsElapsed,
    formatCurrency(row.mainJobSavings),
    formatCurrency(row.sideHustleSavings),
    formatCurrency(row.combinedSavings),
    formatCurrency(row.totalInvestedAssets),
    formatCurrency(row.annualReturn)
  ]));

  // Combine all parts with proper CSV formatting
  const csvContent = [
    headerMessage,
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'fire-calculator-results.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


// Core FIRE calculation logic
export function calculateFireResults(inputs: CalculatorInputs): CalculationResults {
  const yearlyData: YearlyData[] = [];
  const chartData: ChartData[] = [];
  
  // Calculate with side hustle
  let totalAssets = inputs.investedAssets.reduce((sum, asset) => sum + asset.amount, 0);
  let fireAgeReached = null;
  let fireAgeWithoutSideHustle = null;

  // Calculate weighted return upfront
  const weightedReturn = inputs.investedAssets.reduce((sum, asset) => {
    const weight = asset.amount / totalAssets;
    return sum + (asset.return / 100) * weight;
  }, 0);

  // First pass - calculate with side hustle
  for (let age = inputs.currentAge; age <= inputs.endAge; age++) {
    const yearsElapsed = age - inputs.currentAge;

    const mainJobSavings = age < inputs.fireAge 
      ? (inputs.mainJobIncome * (inputs.mainJobSavingsRate / 100))
      : 0;

    const sideHustleSavings = age < inputs.fireAge
      ? (inputs.sideHustleIncome * (inputs.sideHustleSavingsRate / 100))
      : 0;

    const combinedSavings = mainJobSavings + sideHustleSavings;
    
    const annualReturn = totalAssets * weightedReturn;
    totalAssets += annualReturn + combinedSavings;

    if (age >= inputs.fireAge) {
      totalAssets -= inputs.retirementSpend;
    }

    if (!fireAgeReached && totalAssets >= inputs.totalInvestedAssetsGoal) {
      fireAgeReached = age;
    }

    yearlyData.push({
      age,
      yearsElapsed,
      mainJobSavings,
      sideHustleSavings,
      combinedSavings,
      totalInvestedAssets: totalAssets,
      annualReturn
    });

    chartData.push({
      age,
      totalInvestedAssets: totalAssets,
      fireGoal: inputs.totalInvestedAssetsGoal
    });
  }

  // Second pass - calculate without side hustle
  let assetsWithoutSideHustle = inputs.investedAssets.reduce((sum, asset) => sum + asset.amount, 0);
  
  for (let age = inputs.currentAge; age <= inputs.endAge; age++) {
    const mainJobSavings = age < inputs.fireAge 
      ? (inputs.mainJobIncome * (inputs.mainJobSavingsRate / 100))
      : 0;

    const annualReturn = assetsWithoutSideHustle * weightedReturn;
    assetsWithoutSideHustle += annualReturn + mainJobSavings;

    if (age >= inputs.fireAge) {
      assetsWithoutSideHustle -= inputs.retirementSpend;
    }

    if (!fireAgeWithoutSideHustle && assetsWithoutSideHustle >= inputs.totalInvestedAssetsGoal) {
      fireAgeWithoutSideHustle = age;
    }
  }

  if (!fireAgeWithoutSideHustle) {
    fireAgeWithoutSideHustle = inputs.endAge;
  }

  if (fireAgeWithoutSideHustle <= fireAgeReached) {
    fireAgeWithoutSideHustle = fireAgeReached + 1;
  }

  const yearsSaved = fireAgeWithoutSideHustle - fireAgeReached;
  const monthsSaved = Math.round((yearsSaved % 1) * 12);

  return {
    yearlyData,
    chartData,
    fireAge: fireAgeReached,
    fireAgeWithoutSideHustle,
    yearsSaved: Math.floor(yearsSaved),
    monthsSaved
  };
}