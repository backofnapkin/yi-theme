export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  
  export function generateCSV(results: any): string {
    // Helper function to format numbers for CSV without currency symbol and commas
    const formatNumberForCSV = (num: number): string => {
      return `"${formatCurrency(Math.round(num))}"`;
    };
  
    const headers = [
      'Year',
      'Revenue - Dumpster Rentals',
      'Revenue - Junk Removal',
      'Revenue - Additional Services',
      'Revenue - Total',
      'Expenses - Maintenance',
      'Expenses - Wages',
      'Expenses - Fuel',
      'Expenses - Marketing',
      'Expenses - Insurance',
      'Expenses - Loan Payment',
      'Expenses - Software',
      'Expenses - Total',
      'Net Profit',
      'Required Rentals'
    ].join(',');
  
    const rows = results.projections.map((year: any) => [
      `Year ${year.year}`,
      formatNumberForCSV(year.revenue.dumpsterRentals),
      formatNumberForCSV(year.revenue.junkRemoval),
      formatNumberForCSV(year.revenue.additionalServices.reduce((sum: number, service: any) => sum + service.amount, 0)),
      formatNumberForCSV(year.revenue.total),
      formatNumberForCSV(year.expenses.maintenance),
      formatNumberForCSV(year.expenses.wages),
      formatNumberForCSV(year.expenses.fuel),
      formatNumberForCSV(year.expenses.marketing),
      formatNumberForCSV(year.expenses.insurance),
      formatNumberForCSV(year.expenses.loanPayment),
      formatNumberForCSV(year.expenses.software),
      formatNumberForCSV(year.expenses.total),
      formatNumberForCSV(year.profit),
      year.breakevenRentals
    ].join(','));
  
    return [headers, ...rows].join('\n');
  }