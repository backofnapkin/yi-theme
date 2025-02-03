import React from 'react';
import type { CalculationResults } from '../types';
import { formatCurrency } from '../utils';
import { InputButton } from '../../../ui/InputButton';
import { ResultsTable } from '../../../ui/ResultsTable';

interface ProjectionsTableProps {
  results: CalculationResults;
  onExportCSV: () => void;
}

export function ProjectionsTable({ results, onExportCSV }: ProjectionsTableProps) {
  const columns = [
    { key: 'year', label: 'Year' },
    { 
      key: 'revenue', 
      label: 'Revenue',
      format: (value: number) => formatCurrency(value),
      className: 'text-right'
    },
    { 
      key: 'expenses', 
      label: 'Expenses',
      format: (value: number) => formatCurrency(value),
      className: 'text-right'
    },
    { 
      key: 'profit', 
      label: 'Net Profit',
      format: (value: number) => formatCurrency(value),
      className: (value: number) => `text-right ${value >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`
    },
    { 
      key: 'rentals', 
      label: 'Required Rentals to Break Even',
      format: (value: number) => value.toLocaleString(),
      className: 'text-right'
    }
  ];

  const data = results.projections.map(year => ({
    year: `Year ${year.year}`,
    revenue: year.revenue.total,
    expenses: year.expenses.total,
    profit: year.profit,
    rentals: year.breakevenRentals
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">10-Year Projections</h2>
        <InputButton
          onClick={onExportCSV}
          variant="primary"
        >
          Export CSV
        </InputButton>
      </div>

      <ResultsTable
        title="Yearly Financial Projections"
        columns={columns}
        data={data}
        highlightRowCondition={(row) => row.profit > 0}
        footerNote="Required Rentals to Break Even shows the minimum number of annual rentals needed to cover all operational and startup costs based on your Weekly Rental Price. This helps determine the minimum utilization needed for profitability."
      />
    </div>
  );
}