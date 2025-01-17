import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Download } from 'lucide-react';
import type { CalculatorResults, UnitAnalysis } from './types';

interface ResultsDisplayProps {
  results: CalculatorResults;
  facilityName: string;
  onDownloadCSV: () => void;
}

// Using emerald color variations for a cohesive theme
const COLORS = ['#059669', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  facilityName,
  onDownloadCSV,
}) => {
  const pieChartData = results.unitAnalysis.map((unit) => ({
    name: `${unit.unitType}`,
    value: unit.monthlyRent,
  }));

  const total = pieChartData.reduce((sum, item) => sum + item.value, 0);

  const formatTooltip = (value: number) => {
    const percentage = ((value / total) * 100).toFixed(1);
    return [`$${value.toLocaleString()}`, `${percentage}%`];
  };

  return (
    <div className="space-y-8 mt-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-skin-base">
          Storage Facility Evaluation for {facilityName}
        </h2>
        <button
          onClick={onDownloadCSV}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-green-50 to-emerald-50 border border-emerald-100 shadow-sm text-skin-base rounded-lg hover:from-green-100 hover:to-emerald-100 transition-colors"
        >
          <Download className="h-5 w-5" />
          Download CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Property Overview Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm border border-emerald-100">
          <h3 className="text-lg font-semibold text-skin-base mb-4">Property Overview</h3>
          <div className="space-y-2 text-skin-base">
            <p>Total Units: {results.totalUnits}</p>
            <p>Total Sq. Feet: {results.totalSquareFeet.toLocaleString()}</p>
            <p>Cap Rate: {results.capRate.toFixed(2)}%</p>
          </div>
        </div>

        {/* Monthly Financial Summary Card */}
        <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl p-6 shadow-sm border border-amber-200">
          <h3 className="text-lg font-semibold text-skin-base mb-4">Monthly Financial Summary</h3>
          <div className="space-y-2 text-skin-base">
            <p>Potential Gross: ${results.monthlyGross.toLocaleString()}</p>
            <p>Monthly Overhead: ${results.monthlyOverhead.toLocaleString()}</p>
            <p>Monthly Loan Payment: ${results.monthlyLoanPayment.toLocaleString()}</p>
            <p>Net Cash Flow: ${results.monthlyNetCashFlow.toLocaleString()}</p>
          </div>
        </div>

        {/* Annual Financial Summary Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm border border-emerald-100">
          <h3 className="text-lg font-semibold text-skin-base mb-4">Annual Financial Summary</h3>
          <div className="space-y-2 text-skin-base">
            <p>Potential Gross: ${results.annualGross.toLocaleString()}</p>
            <p>Annual Overhead: ${results.annualOverhead.toLocaleString()}</p>
            <p>Annual Loan Payment: ${results.annualLoanPayment.toLocaleString()}</p>
            <p>Net Cash Flow: ${results.annualNetCashFlow.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Pie Chart Card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm border border-emerald-100">
        <h2 className="text-xl font-bold text-skin-base mb-6">Monthly Rent Distribution</h2>
        <div className="h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                label={false}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={formatTooltip}
                contentStyle={{
                  background: 'white',
                  border: '2px solid #10b981',
                  borderRadius: '8px',
                  padding: '8px'
                }}
              />
              <Legend 
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '12px'
                }}
                formatter={(value, entry) => {
                  const dataEntry = pieChartData.find(item => item.name === value);
                  if (dataEntry) {
                    const percentage = ((dataEntry.value / total) * 100).toFixed(1);
                    return `${value} (${percentage}%)`;
                  }
                  return value;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Unit Analysis Table Card */}
      <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl p-6 shadow-sm border border-amber-200">
        <h2 className="text-xl font-bold text-skin-base mb-6">Unit Analysis</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-skin-base">
            <thead className="bg-skin-fill">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-skin-base uppercase tracking-wider">
                  Unit Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-skin-base uppercase tracking-wider">
                  # of Units
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-skin-base uppercase tracking-wider">
                  Total Sq.Ft
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-skin-base uppercase tracking-wider">
                  Rent/Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-skin-base uppercase tracking-wider">
                  Rent/Sq.Ft
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-skin-base uppercase tracking-wider">
                  Monthly Rent
                </th>
              </tr>
            </thead>
            <tbody className="bg-skin-card divide-y divide-skin-base">
              {results.unitAnalysis.map((unit, index) => (
                <tr key={index} className="text-skin-base">
                  <td className="px-6 py-4 whitespace-nowrap">{unit.unitType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{unit.numberOfUnits}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{unit.totalSquareFeet}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${unit.rentPerUnit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${unit.rentPerSquareFoot.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${unit.monthlyRent.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};