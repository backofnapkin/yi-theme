import React from 'react';

const SavingsTable = ({ regularSavings, compoundSavings, annualReturn }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="savings-tables grid gap-8">
      <div className="regular-savings">
        <h3 className="text-xl font-semibold mb-4">Total Money Saved (Without Reinvestment)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Time Period</th>
                <th className="border p-2 text-right">Amount Saved</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">1 month</td>
                <td className="border p-2 text-right">{formatCurrency(regularSavings.month)}</td>
              </tr>
              <tr>
                <td className="border p-2">1 year</td>
                <td className="border p-2 text-right">{formatCurrency(regularSavings.year)}</td>
              </tr>
              <tr>
                <td className="border p-2">5 years</td>
                <td className="border p-2 text-right">{formatCurrency(regularSavings.fiveYears)}</td>
              </tr>
              <tr>
                <td className="border p-2">10 years</td>
                <td className="border p-2 text-right">{formatCurrency(regularSavings.tenYears)}</td>
              </tr>
              <tr>
                <td className="border p-2">20 years</td>
                <td className="border p-2 text-right">{formatCurrency(regularSavings.twentyYears)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="compound-savings">
        <h3 className="text-xl font-semibold mb-4">
          Total Money Saved with Reinvestment ({annualReturn}% Annual Return)
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Time Period</th>
                <th className="border p-2 text-right">Amount Saved</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">1 year</td>
                <td className="border p-2 text-right">{formatCurrency(compoundSavings.year)}</td>
              </tr>
              <tr>
                <td className="border p-2">5 years</td>
                <td className="border p-2 text-right">{formatCurrency(compoundSavings.fiveYears)}</td>
              </tr>
              <tr>
                <td className="border p-2">10 years</td>
                <td className="border p-2 text-right">{formatCurrency(compoundSavings.tenYears)}</td>
              </tr>
              <tr>
                <td className="border p-2">20 years</td>
                <td className="border p-2 text-right">{formatCurrency(compoundSavings.twentyYears)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SavingsTable;