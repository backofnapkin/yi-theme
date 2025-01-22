import React from 'react';
import { DollarSign, Percent, Clock, Download, Info } from 'lucide-react';
import type { TipCalculationResult } from './types';
import { BorderContainer } from '../../ui/BorderContainer';
import { ResultsTable } from '../../ui/ResultsTable';
import { Tooltip } from '../../ui/Tooltip';
import { InputButton } from '../../ui/InputButton';

interface ResultsProps {
  results: TipCalculationResult[];
  deductionAmount: number;
}

export const Results: React.FC<ResultsProps> = ({ results, deductionAmount }) => {
  const totalTips = results.reduce((sum, result) => sum + result.tipAmount, 0);
  const totalHours = results.reduce((sum, result) => {
    const hoursWorked = (result.percentage / 100) * (totalTips / (totalTips / results.length));
    return sum + hoursWorked;
  }, 0);
  const averageTipPerHour = totalTips / totalHours;

  const columns = [
    { key: 'name', label: 'Employee' },
    { key: 'role', label: 'Role' },
    {
      key: 'tipAmount',
      label: 'Tip Share',
      format: (value: number) => `$${value.toFixed(2)}`,
      className: 'font-semibold',
    },
    {
      key: 'percentage',
      label: 'Percentage',
      format: (value: number) => `${value.toFixed(1)}%`,
    },
  ];

  const handleDownloadCSV = () => {
    // Create CSV header
    const headers = ['Employee', 'Role', 'Tip Share', 'Percentage'];
    
    // Format the data rows
    const rows = results.map(result => [
      result.name,
      result.role,
      `$${result.tipAmount.toFixed(2)}`,
      `${result.percentage.toFixed(1)}%`
    ]);
    
    // Add summary information
    const summaryRows = [
      [''],  // Empty row for spacing
      ['Summary'],
      ['Average Tips Per Hour', `$${averageTipPerHour.toFixed(2)}`],
      ['Total Tips', `$${totalTips.toFixed(2)}`]
    ];

    if (deductionAmount > 0) {
      summaryRows.push(['Deduction Amount', `$${deductionAmount.toFixed(2)}`]);
    }
    
    // Combine all rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
      ...summaryRows.map(row => row.join(','))
    ].join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'tip_distribution.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <BorderContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">Tip Pool Split Results</h3>
            <Tooltip content="View the calculated tip distribution results, including individual shares, percentages, and summary statistics. Download the complete results as a CSV file for your records.">
              <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </Tooltip>
          </div>
          <InputButton
            onClick={handleDownloadCSV}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            Download CSV
          </InputButton>
        </div>

        <div className="bg-emerald-50 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-500" />
            <span className="font-medium">Average Tips Per Hour:</span>
            <span className="text-emerald-600 font-semibold text-skin-emerald-text">${averageTipPerHour.toFixed(2)}</span>
          </div>
        </div>

        <ResultsTable
          title="Tip Distribution Details"
          columns={columns}
          data={results}
          expandable={true}
          initialExpanded={true}
          highlightRowCondition={(row) => row.tipAmount === Math.max(...results.map(r => r.tipAmount))}
        />

        {deductionAmount > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-red-500" />
              <span className="font-medium">Amount Deducted:</span>
              <span className="text-red-600">${deductionAmount.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </BorderContainer>
  );
};