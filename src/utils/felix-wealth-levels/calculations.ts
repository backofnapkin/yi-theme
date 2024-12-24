interface WealthLevel {
  min: number;
  max: number;
  label: string;
}

const INFLATION_MULTIPLIER = 1.70238540; // 2006 to 2024 inflation rate

const NET_WORTH_LEVELS: WealthLevel[] = [
  // ... existing levels
];

const CASH_LEVELS: WealthLevel[] = [
  // ... existing levels
];

export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

export function parseFormattedNumber(value: string): number {
  const cleanValue = value.replace(/[^\d.]/g, '');
  return Number(cleanValue) || 0;
}

export function calculateWealthLevel(netWorth: number, useInflationAdjusted: boolean): string {
  // ... existing function
}

export function calculateCashWealthLevel(cashAmount: number, useInflationAdjusted: boolean): string {
  // ... existing function
}

export function getNextLevelRequirement(netWorth: number, useInflationAdjusted: boolean): number | null {
  // ... existing function
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}