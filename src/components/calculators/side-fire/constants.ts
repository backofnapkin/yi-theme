// Default investment asset
export const DEFAULT_INVESTMENT: InvestedAsset = {
    id: '1',
    name: 'Stocks',
    amount: 100000,
    return: 7
  };
  
  // Default calculator inputs
  export const DEFAULT_INPUTS: CalculatorInputs = {
    // Income defaults
    sideHustleIncome: 24000,
    sideHustleSavingsRate: 50,
    mainJobIncome: 80000,
    mainJobSavingsRate: 10,
    
    // Investment defaults
    investedAssets: [DEFAULT_INVESTMENT],
    totalInvestedAssetsGoal: 1000000,
    
    // Spending defaults
    annualSpend: 40000,
    retirementSpend: 40000,
    
    // Timeline defaults
    currentAge: 30,
    fireAge: 65,
    endAge: 90,
    inflationRate: 3
  };
  
  // Investment constraints
  export const INVESTMENT_CONSTRAINTS = {
    MAX_INVESTMENTS: 6,
    MIN_RETURN: 0,
    MAX_RETURN: 20,
    RETURN_STEP: 0.1
  } as const;
  
  // Age constraints
  export const AGE_CONSTRAINTS = {
    MIN_AGE: 18,
    MAX_AGE: 100,
    MIN_RETIREMENT_AGE: 35
  } as const;
  
  // Rate constraints
  export const RATE_CONSTRAINTS = {
    MIN_RATE: 0,
    MAX_RATE: 100,
    RATE_STEP: 1,
    MIN_INFLATION: 0,
    MAX_INFLATION: 10,
    INFLATION_STEP: 0.1
  } as const;
  
  // Currency formatting options
  export const CURRENCY_FORMAT_OPTIONS = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  } as const;
  
  // CSV export settings
  export const CSV_EXPORT = {
    FILENAME: 'fire-calculator-results.csv',
    HEADER_MESSAGE: 'Side Hustle FIRE Calculator Results\n',
    MIME_TYPE: 'text/csv;charset=utf-8;'
  } as const;