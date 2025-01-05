import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { formatCurrency } from '../../../utils/calculations';
import type { CalculationResults, CalculatorInputs } from '../../../types';

interface ResultsTableProps {
  results: CalculationResults;
  inputs: CalculatorInputs;
}

export function ResultsTable({ results, inputs }: ResultsTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const headers = [
    { key: 'age', label: 'Age' },
    { key: 'yearsElapsed', label: 'Years Elapsed' },
    { key: 'mainJobSavings', label: 'Main Job Savings' },
    { key: 'sideHustleSavings', label: 'Side Hustle Savings' },
    { key: 'combinedSavings', label: 'Combined Savings' },
    { key: 'totalInvestedAssets', label: 'Total Invested Assets' },
    { key: 'annualReturn', label: 'Annual Return' }
  ] as const;

  return (
    <Card>
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-semibold">Yearly Financial Details</span>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </Button>
      
      {isExpanded && (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map(header => (
                  <th
                    key={header.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.yearlyData.map((row, index) => (
                <tr
                  key={index}
                  className={`
                    ${row.age === results.fireAge
                      ? 'bg-green-50 ring-2 ring-green-500 ring-inset font-medium'
                      : 'hover:bg-gray-50'
                    }
                    transition-colors
                  `}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.yearsElapsed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(row.mainJobSavings)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(row.sideHustleSavings)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(row.combinedSavings)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(row.totalInvestedAssets)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(row.annualReturn)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isExpanded && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            The highlighted row indicates when you reach your FIRE goal of{' '}
            {formatCurrency(inputs.totalInvestedAssetsGoal)}
          </p>
        </div>
      )}
    </Card>
  );
}