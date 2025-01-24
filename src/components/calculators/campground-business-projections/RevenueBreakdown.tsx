import React from 'react';
import { PieChart, HelpCircle } from 'lucide-react';
import { formatCurrency, formatPercentage } from './utils';
import { Tooltip } from '../../../components/ui/Tooltip';
import { BorderContainer } from '../../../components/ui/BorderContainer';

interface RevenueBreakdownProps {
  annualGrossRevenue: number;
  annualTotalExpenses: number;
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

export const RevenueBreakdown: React.FC<RevenueBreakdownProps> = ({
  annualGrossRevenue,
  annualTotalExpenses,
}) => {
  const netProfit = annualGrossRevenue - annualTotalExpenses;
  const expensesPercentage = (annualTotalExpenses / annualGrossRevenue) * 100;
  const profitPercentage = (netProfit / annualGrossRevenue) * 100;

  return (
    <BorderContainer className="lg:col-span-3">
      <SectionTitle
        icon={<PieChart className="w-5 h-5" />}
        title="Revenue Breakdown"
        tooltip="Visual representation of your revenue distribution between expenses and net profit."
      />
      <div className="mt-4">
        <div className="mb-4">
          <div className="w-full bg-skin-fill rounded-full h-4 overflow-hidden flex">
            <div
              className="h-full bg-skin-progress-expense"
              style={{ width: `${expensesPercentage}%` }}
            />
            <div
              className="h-full bg-skin-progress-profit"
              style={{ width: `${profitPercentage}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-skin-fill rounded-lg">
            <p className="text-sm text-skin-base">Total Expenses</p>
            <p className="text-lg font-semibold text-skin-red-text">
              {formatCurrency(annualTotalExpenses)}
            </p>
            <p className="text-sm text-skin-base">
              ({formatPercentage(expensesPercentage)})
            </p>
          </div>
          <div className="p-3 bg-skin-fill rounded-lg">
            <p className="text-sm text-skin-base">Net Profit</p>
            <p className="text-lg font-semibold text-skin-emerald-text">
              {formatCurrency(netProfit)}
            </p>
            <p className="text-sm text-skin-base">
              ({formatPercentage(profitPercentage)})
            </p>
          </div>
        </div>
      </div>
    </BorderContainer>
  );
};