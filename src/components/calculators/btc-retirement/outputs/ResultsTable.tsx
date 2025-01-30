import React, { useState, useMemo } from 'react';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';

interface ResultsTableProps {
  calculatorState: {
    currentAge: number;
    lifeExpectancy: number;
    currentBtc: number;
    annualBtcPurchase: number;
    retirementAge: number;
    annualSpend: number;
    growthRate: number;
  };
  btcPrice: number;
  riskAnalysis: any;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  calculatorState,
  btcPrice,
  riskAnalysis,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate yearly data
  const data = useMemo(() => {
    const results = [];
    let currentPrice = btcPrice;
    let totalBtc = calculatorState.currentBtc;
    const yearsToProject = calculatorState.lifeExpectancy - calculatorState.currentAge;

    for (let year = 0; year <= yearsToProject; year++) {
      const age = calculatorState.currentAge + year;
      const isRetired = age >= calculatorState.retirementAge;
      
      // Calculate BTC changes for this year
      let btcPurchased = 0;
      let btcSpent = 0;

      if (!isRetired) {
        // If not retired, purchase BTC
        btcPurchased = calculatorState.annualBtcPurchase / currentPrice;
      } else {
        // If retired, sell BTC to cover annual spend
        btcSpent = calculatorState.annualSpend / currentPrice;
      }

      // Update total BTC (add purchases, subtract spending)
      const startingBtc = totalBtc;
      totalBtc = totalBtc + btcPurchased - btcSpent;
      
      // Calculate portfolio value
      const portfolioValue = totalBtc * currentPrice;
      
      // Use the desired annual spend for retired years
      const annualSpend = isRetired ? calculatorState.annualSpend : 0;
      
      results.push({
        age,
        btcPrice: Math.round(currentPrice),
        growth: calculatorState.growthRate,
        startingBtc,
        btcPurchased,
        btcSpent,
        totalBtc,
        portfolioValue: Math.round(portfolioValue),
        annualSpend,
      });

      // Increase BTC price by growth rate for next year
      currentPrice *= (1 + calculatorState.growthRate / 100);
    }

    return results;
  }, [calculatorState, btcPrice]);

  const downloadCSV = () => {
    const headers = [
      'Age',
      'BTC Price',
      'Growth %',
      'Starting BTC',
      'BTC Purchased',
      'BTC Spent',
      'Total BTC',
      'Portfolio Value',
      'Annual Retirement Spend',
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        row.age,
        row.btcPrice,
        row.growth.toFixed(2),
        row.startingBtc.toFixed(8),
        row.btcPurchased.toFixed(8),
        row.btcSpent.toFixed(8),
        row.totalBtc.toFixed(8),
        row.portfolioValue,
        row.annualSpend,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'btc_retirement_projection.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="border border-gray-200 rounded-xl shadow-sm">
      <button
        className="w-full px-6 py-3 flex items-center justify-between text-left border-b border-gray-200 hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-semibold text-gray-700">Annual Results</span>
        {isExpanded ? 
          <ChevronUp className="w-5 h-5 text-gray-400" /> : 
          <ChevronDown className="w-5 h-5 text-gray-400" />
        }
      </button>
      
      {isExpanded && (
        <div className="p-6 space-y-6">
          <div className="flex justify-end">
            <button
              onClick={downloadCSV}
              className="flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold
                       bg-gradient-to-br from-green-50 to-emerald-50 
                       text-gray-700 
                       hover:from-green-100 hover:to-emerald-100 
                       active:from-green-200 active:to-emerald-200 
                       border border-emerald-100 
                       shadow-sm
                       transition-colors"
            >
              <Download size={16} />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BTC Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Starting BTC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BTC Purchased</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BTC Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total BTC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Portfolio Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Retirement Spend</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, index) => (
                  <tr
                    key={index}
                    className={`
                      ${row.age === calculatorState.retirementAge 
                        ? 'bg-green-50 ring-2 ring-emerald-600 ring-inset font-medium'
                        : 'hover:bg-gray-50'
                      }
                      transition-colors
                    `}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${row.btcPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.growth}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₿{row.startingBtc.toFixed(8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₿{row.btcPurchased.toFixed(8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₿{row.btcSpent.toFixed(8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₿{row.totalBtc.toFixed(8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${row.portfolioValue.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${row.annualSpend.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;