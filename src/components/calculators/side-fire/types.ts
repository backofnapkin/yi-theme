// Investment asset type definition
export interface InvestedAsset {
    id: string;
    name: string;
    amount: number;
    return: number;
  }
  
  // Calculator input parameters
  export interface CalculatorInputs {
    // Income related inputs
    sideHustleIncome: number;
    sideHustleSavingsRate: number;
    mainJobIncome: number;
    mainJobSavingsRate: number;
    
    // Investment related inputs
    investedAssets: InvestedAsset[];
    totalInvestedAssetsGoal: number;
    
    // Spending related inputs
    annualSpend: number;
    retirementSpend: number;
    
    // Timeline related inputs
    currentAge: number;
    fireAge: number;
    endAge: number;
    inflationRate: number;
  }
  
  // Yearly calculation data
  export interface YearlyData {
    age: number;
    yearsElapsed: number;
    mainJobSavings: number;
    sideHustleSavings: number;
    combinedSavings: number;
    totalInvestedAssets: number;
    annualReturn: number;
  }
  
  // Chart data structure
  export interface ChartData {
    age: number;
    totalInvestedAssets: number;
    fireGoal: number;
  }
  
  // Final calculation results
  export interface CalculationResults {
    yearlyData: YearlyData[];
    chartData: ChartData[];
    fireAge: number;
    fireAgeWithoutSideHustle: number;
    yearsSaved: number;
    monthsSaved: number;
  }