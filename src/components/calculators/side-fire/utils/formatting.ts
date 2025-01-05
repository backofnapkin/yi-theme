export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(value));
  }
  
  export function formatNumberWithCommas(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }
  
  export function parseFormattedNumber(value: string): number {
    return Number(value.replace(/[^0-9.-]/g, ''));
  }