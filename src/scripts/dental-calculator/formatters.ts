export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function parseFormattedNumber(str: string): number {
  const cleanValue = str.replace(/[^\d.]/g, '');
  const numberValue = parseFloat(cleanValue);
  return isNaN(numberValue) ? 0 : numberValue;
}
