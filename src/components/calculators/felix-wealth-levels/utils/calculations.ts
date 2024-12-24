interface WealthLevel {
  min: number;
  max: number;
  label: string;
}

const INFLATION_MULTIPLIER = 1.70238540; // 2006 to 2024 inflation rate

const NET_WORTH_LEVELS: WealthLevel[] = [
  { min: 2000000, max: 4000000, label: 'The comfortable poor' },
  { min: 4000000, max: 10000000, label: 'The comfortably off' },
  { min: 10000000, max: 30000000, label: 'The comfortably wealthy' },
  { min: 30000000, max: 80000000, label: 'The lesser rich' },
  { min: 80000000, max: 150000000, label: 'The comfortably rich' },
  { min: 150000000, max: 200000000, label: 'The rich' },
  { min: 200000000, max: 400000000, label: 'The seriously rich' },
  { min: 400000000, max: 800000000, label: 'The truly rich' },
  { min: 800000000, max: 1998000000, label: 'The filthy rich' },
  { min: 1998000000, max: Infinity, label: 'The super rich' }
];

const CASH_LEVELS: WealthLevel[] = [
  { min: 100000, max: 400000, label: 'The comfortable poor' },
  { min: 400000, max: 1000000, label: 'The comfortably off' },
  { min: 1000000, max: 2000000, label: 'The comfortably wealthy' },
  { min: 2000000, max: 10000000, label: 'The lesser rich' },
  { min: 10000000, max: 30000000, label: 'The comfortably rich' },
  { min: 30000000, max: 70000000, label: 'The rich' },
  { min: 70000000, max: 100000000, label: 'The seriously rich' },
  { min: 100000000, max: 200000000, label: 'The truly rich' },
  { min: 200000000, max: Infinity, label: 'The filthy rich and the super rich' }
];

export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

export function parseFormattedNumber(value: string): number {
  const cleanValue = value.replace(/[^\d.]/g, '');
  return Number(cleanValue) || 0;
}

export function calculateWealthLevel(netWorth: number, useInflationAdjusted: boolean): string {
  const adjustedNetWorth = useInflationAdjusted ? netWorth / INFLATION_MULTIPLIER : netWorth;
  
  for (const level of NET_WORTH_LEVELS) {
    if (adjustedNetWorth >= level.min && adjustedNetWorth < level.max) {
      return level.label;
    }
  }
  return 'Not yet on the wealth scale';
}

export function calculateCashWealthLevel(cashAmount: number, useInflationAdjusted: boolean): string {
  const adjustedCash = useInflationAdjusted ? cashAmount / INFLATION_MULTIPLIER : cashAmount;
  
  for (const level of CASH_LEVELS) {
    if (adjustedCash >= level.min && adjustedCash < level.max) {
      return level.label;
    }
  }
  return 'Not yet on the cash wealth scale';
}

export function getNextLevelRequirement(netWorth: number, useInflationAdjusted: boolean): number | null {
  const adjustedNetWorth = useInflationAdjusted ? netWorth / INFLATION_MULTIPLIER : netWorth;
  
  for (const level of NET_WORTH_LEVELS) {
    if (adjustedNetWorth < level.min) {
      const required = level.min - adjustedNetWorth;
      return useInflationAdjusted ? required * INFLATION_MULTIPLIER : required;
    }
  }
  return null;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
