import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { CalculationResults } from './types';

type ViewType = 'gross' | 'afterTax' | 'afterExpenses' | 'invested';
type ConsolidatedViewType = 'income' | 'savings';

interface Props {
  results: CalculationResults;
  selectedView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const ResultsChart: React.FC<Props> = ({ results, selectedView, onViewChange }) => {
  // Map consolidated view to original view types
  const getConsolidatedView = (view: ViewType): ConsolidatedViewType => {
    return ['gross', 'afterTax'].includes(view) ? 'income' : 'savings';
  };

  // Get the currently selected consolidated view
  const currentConsolidatedView = getConsolidatedView(selectedView);

  const generateChartData = () => {
    const data = [];
    const years = {
      gross: results.grossIncome.years + results.grossIncome.months / 12,
      afterTax: results.afterTaxIncome.years + results.afterTaxIncome.months / 12,
      afterExpenses: results.afterTaxAndExpenses.impossible ? 0 : results.afterTaxAndExpenses.years + results.afterTaxAndExpenses.months / 12,
      invested: results.investedAmount.impossible ? 0 : results.investedAmount.years + results.investedAmount.months / 12
    };

    // Get the relevant timeline based on the consolidated view
    let timelineYears: number;
    if (currentConsolidatedView === 'income') {
      timelineYears = Math.max(years.gross, years.afterTax);
    } else {
      timelineYears = Math.max(
        years.afterExpenses || 0,
        years.invested || 0
      );
    }

    if (timelineYears === 0 || !isFinite(timelineYears)) {
      timelineYears = Math.min(...Object.values(years).filter(y => y > 0 && isFinite(y)));
    }

    // Round up to the nearest year for the timeline
    timelineYears = Math.ceil(timelineYears);

    // Generate data points for each year
    for (let year = 0; year <= timelineYears; year++) {
      const dataPoint: Record<string, number> = { year };

      // Calculate values based on annual rates
      const annualGrossIncome = results.annualSummary.annualIncome;
      const annualAfterTaxIncome = results.annualSummary.afterTaxIncome;
      const annualExpenses = (results.annualSummary.monthlyExpenses ?? 0) * 12;
      const annualAfterExpenses = annualAfterTaxIncome - annualExpenses;
      const annualInvestable = results.annualSummary.investableAmount;

      if (currentConsolidatedView === 'income') {
        dataPoint.gross = year * annualGrossIncome;
        dataPoint.afterTax = year * annualAfterTaxIncome;
      } else {
        if (!results.afterTaxAndExpenses.impossible) {
          dataPoint.afterExpenses = year * annualAfterExpenses;
        }
        if (!results.investedAmount.impossible) {
          // For invested amount, use compound interest formula: FV = PMT * ((1 + r)^t - 1) / r
          const r = (results.annualSummary.investmentReturns ?? 0) / 100;
          dataPoint.invested = r === 0 
            ? year * annualInvestable
            : annualInvestable * ((Math.pow(1 + r, year) - 1) / r);
        }
      }

      data.push(dataPoint);
    }

    return data;
  };

  const chartData = generateChartData();

  const buttonClass = (active: boolean) => `
    px-4 py-2 rounded-lg font-semibold transition-colors
    ${active 
      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-emerald-100 shadow-sm'
      : 'border border-gray-300 text-gray-600 hover:bg-gray-50 active:bg-gray-100'
    }
  `;

  const getAvailableViews = () => {
    const views: ConsolidatedViewType[] = ['income'];
    if (!results.afterTaxAndExpenses.impossible || !results.investedAmount.impossible) {
      views.push('savings');
    }
    return views;
  };

  const handleViewChange = (consolidatedView: ConsolidatedViewType) => {
    // Map consolidated view back to original ViewType
    const newView: ViewType = consolidatedView === 'income' ? 'gross' : 'afterExpenses';
    onViewChange(newView);
  };

  return (
    <div>
      <div className="flex space-x-2 mb-4 print:hidden">
        {getAvailableViews().map((view) => (
          <button
            key={view}
            onClick={() => handleViewChange(view)}
            className={buttonClass(currentConsolidatedView === view)}
          >
            {view === 'income' && 'Gross & After Tax'}
            {view === 'savings' && 'After Expenses / Invested'}
          </button>
        ))}
      </div>
      <div className="h-80">
        <ResponsiveContainer>
          <LineChart 
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 25 }}
          >
            <XAxis
              dataKey="year"
              tickFormatter={(value: any): string => String(Math.round(value))}
              label={{ value: 'Years', position: 'bottom', offset: 0 }}
              stroke="#374151"
            />
            <YAxis
              hide={true}
            />
            {currentConsolidatedView === 'income' && (
              <>
                <Line
                  type="monotone"
                  dataKey="gross"
                  stroke="#4ade80"
                  strokeWidth={2.5}
                  name="Gross Income"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="afterTax"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  name="After Tax"
                  dot={false}
                />
              </>
            )}
            {currentConsolidatedView === 'savings' && (
              <>
                {!results.afterTaxAndExpenses.impossible && (
                  <Line
                    type="monotone"
                    dataKey="afterExpenses"
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    name="After Expenses"
                    dot={false}
                  />
                )}
                {!results.investedAmount.impossible && (
                  <Line
                    type="monotone"
                    dataKey="invested"
                    stroke="#ff7f50"
                    strokeWidth={2.5}
                    name="Invested"
                    dot={false}
                  />
                )}
              </>
            )}
            <Tooltip
              formatter={(value: number): [string] => [
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                }).format(value),
              ]}
              labelFormatter={(label: number): string => `Year ${Math.round(label)}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                padding: '0.5rem'
              }}
            />
            <Legend 
              layout="horizontal"
              align="center"
              verticalAlign="top"
              wrapperStyle={{
                paddingBottom: '20px'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};