export interface BTCCalculatorInputs {
  currentAge: number;
  lifeExpectancy: number;
  currentBTCAmount: number;
  annualBTCPurchase: number;
  goalRetirementAge: number;
  desiredAnnualSpend: number;
  growthRate: number;
  showNetworkMetrics: boolean;
  showMacroFactors: boolean;
  showHistoricalVolatility: boolean;
}

export interface InfoTooltipProps {
  content: string;
}

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  markers?: { value: number; label: string }[];
}

export interface AnnualData {
  age: number;
  btcPrice: number;
  annualGrowth: number;
  startingBTC: number;
  btcPurchased: number;
  totalBTC: number;
  portfolioValue: number;
  annualReturn: number;
}