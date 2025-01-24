import React from 'react';
import type { CalculationResults } from './types';
import { formatCurrency, formatPercentage } from './utils';
import { Download, DollarSign, TrendingUp, Calculator, HelpCircle, Building2, Check } from 'lucide-react';
import { Tooltip } from '../../../components/ui/Tooltip';
import { BorderContainer } from '../../../components/ui/BorderContainer';
import { InputButton } from '../../../components/ui/InputButton';
import { RevenueBreakdown } from './RevenueBreakdown';

interface ResultsDisplayProps {
  results: CalculationResults;
  onDownloadCSV: () => void;
}

interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
  tooltip: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ icon, title, tooltip }) => (
  <div className="flex items-center gap-2">
    {icon}
    <span className="font-semibold">{title}</span>
    <Tooltip content={tooltip}>
      <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
    </Tooltip>
  </div>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  onDownloadCSV,
}) => {
  const breakEvenOccupants = Math.ceil((results.breakEvenOccupancy / 100) * results.numberOfSites);

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Financial Projections
        </h3>
        <InputButton
          onClick={onDownloadCSV}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download CSV
        </InputButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BorderContainer>
          <SectionTitle
            icon={<DollarSign className="w-5 h-5" />}
            title="Investment Analysis"
            tooltip="Breakdown of your initial investment, monthly loan obligations, and the minimum occupancy needed to cover all expenses."
          />
          <div className="space-y-2 mt-4">
            <p className="text-sm text-gray-600">
              Total Initial Investment:{' '}
              <span className="font-semibold">
                {formatCurrency(results.totalInitialInvestment)}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Monthly Loan Payment:{' '}
              <span className="font-semibold">
                {formatCurrency(results.monthlyLoanPayment)}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Break-Even Occupancy:{' '}
              <span className="font-semibold">
                {formatPercentage(results.breakEvenOccupancy)}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Break-Even Sites:{' '}
              <span className="font-semibold">
                {breakEvenOccupants} sites
              </span>
            </p>
          </div>
        </BorderContainer>

        <BorderContainer>
          <SectionTitle
            icon={<Calculator className="w-5 h-5" />}
            title="Cash Flow Analysis"
            tooltip="Monthly and annual breakdown of your campground's income and operating costs, showing the full financial picture of your operations."
          />
          <div className="space-y-2 mt-4">
            <p className="text-sm text-gray-600">
              Monthly Gross Revenue:{' '}
              <span className="font-semibold text-skin-emerald-text">
                {formatCurrency(results.monthlyGrossRevenue)}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Annual Gross Revenue:{' '}
              <span className="font-semibold text-skin-emerald-text">
                {formatCurrency(results.annualGrossRevenue)}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Monthly Total Expenses:{' '}
              <span className="font-semibold text-skin-red-text">
                {formatCurrency(results.monthlyTotalExpenses)}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Annual Total Expenses:{' '}
              <span className="font-semibold text-skin-red-text">
                {formatCurrency(results.annualTotalExpenses)}
              </span>
            </p>
          </div>
        </BorderContainer>

        <BorderContainer>
          <SectionTitle
            icon={<TrendingUp className="w-5 h-5" />}
            title="Projected Returns"
            tooltip="Key performance metrics including Net Operating Income (NOI) and Cash-on-Cash Return, showing your investment's profitability."
          />
          <div className="space-y-2 mt-4">
            <p className="text-sm text-gray-600">
              Annual NOI:{' '}
              <span className="font-semibold">
                {formatCurrency(results.annualNOI)}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Cash-on-Cash Return:{' '}
              <span className="font-semibold">
                {formatPercentage(results.cashOnCashReturn)}
              </span>
            </p>
          </div>
        </BorderContainer>

        <RevenueBreakdown 
          annualGrossRevenue={results.annualGrossRevenue}
          annualTotalExpenses={results.annualTotalExpenses}
        />

        <div className="lg:col-span-3">
          <div className="!bg-gradient-to-br !from-orange-100 !to-amber-100 !border !border-amber-200 p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">Property Value Projections</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 mt-1 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">After 1 Year</h3>
                  <p>
                    Your property value could grow to{' '}
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(results.propertyValueYear1)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 mt-1 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">After 5 Years</h3>
                  <p>
                    Your property value could grow to{' '}
                    <span className="font-semibold text-purple-600">
                      {formatCurrency(results.propertyValueYear5)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 mt-1 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">After 10 Years</h3>
                  <p>
                    Your property value could grow to{' '}
                    <span className="font-semibold text-green-600">
                      {formatCurrency(results.propertyValueYear10)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};