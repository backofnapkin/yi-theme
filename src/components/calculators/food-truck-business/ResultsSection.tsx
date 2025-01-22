import React from 'react';
import { TrendingUp, Download, Info } from 'lucide-react';
import type { CalculatorInputs } from './FoodTruckBusinessCalculator';
import { InputButton } from '../../ui/InputButton';
import { Tooltip } from '../../ui/Tooltip';
import { BorderContainer } from '../../ui/BorderContainer';

interface ResultsSectionProps {
  inputs: CalculatorInputs;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ inputs }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const totalWeeklySales = Object.values(inputs.dailySales).reduce((sum, sales) => sum + sales, 0);
  const weeklyRevenue = (totalWeeklySales * inputs.averageSpend) + (inputs.monthlyEventRevenue / 4);
  const monthlyRevenue = weeklyRevenue * 4;
  const monthlyCOGS = monthlyRevenue * (inputs.cogsPercentage / 100);
  const monthlyLaborCost = inputs.includeLaborCost
    ? inputs.hourlyWage * inputs.numberOfEmployees * inputs.dailyOperatingHours * inputs.workDaysPerWeek * 4
    : 0;
  const totalMonthlyOverhead = 
    monthlyLaborCost +
    inputs.monthlyCommissaryRent +
    inputs.monthlyFuelCosts +
    inputs.monthlyInsurance +
    inputs.monthlyLoanPayments +
    inputs.vendingPermits.reduce((sum, permit) => sum + permit, 0);
  const monthlyNetProfit = monthlyRevenue - monthlyCOGS - totalMonthlyOverhead;
  const breakEvenRevenue = totalMonthlyOverhead / (1 - (inputs.cogsPercentage / 100));
  const breakEvenSales = Math.ceil(breakEvenRevenue / inputs.averageSpend);

  const generateMonthlyData = () => {
    const months = [];
    const baseMonthlyRevenue = (totalWeeklySales * inputs.averageSpend * 4) + inputs.monthlyEventRevenue;
    
    for (let i = 1; i <= 24; i++) {
      const monthInYear = ((i - 1) % 12) + 1;
      const isOperatingMonth = monthInYear <= inputs.seasonalityFactor;
      
      const monthlyRevenue = isOperatingMonth ? baseMonthlyRevenue : 0;
      const monthlyCOGS = monthlyRevenue * (inputs.cogsPercentage / 100);
      const monthlyLaborCost = isOperatingMonth && inputs.includeLaborCost
        ? inputs.hourlyWage * inputs.numberOfEmployees * inputs.dailyOperatingHours * inputs.workDaysPerWeek * 4
        : 0;
      const monthlyOverhead = isOperatingMonth
        ? monthlyLaborCost +
          inputs.monthlyCommissaryRent +
          inputs.monthlyFuelCosts +
          inputs.monthlyInsurance +
          inputs.monthlyLoanPayments +
          inputs.vendingPermits.reduce((sum, permit) => sum + permit, 0)
        : 0;
      
      months.push({
        month: i,
        revenue: monthlyRevenue,
        expenses: monthlyCOGS + monthlyOverhead,
        netProfit: monthlyRevenue - monthlyCOGS - monthlyOverhead,
        sales: isOperatingMonth ? totalWeeklySales * 4 : 0,
        laborCost: monthlyLaborCost
      });
    }
    return months;
  };

  const downloadCSV = () => {
    const summaryData = [
      ['Food Truck Business Financial Projections'],
      ['Generated on', new Date().toLocaleDateString()],
      [''],
      ['Break Even Analysis'],
      ['Monthly Revenue Needed', formatCurrency(breakEvenRevenue)],
      ['Sales Needed per Month', formatNumber(breakEvenSales)],
      [''],
      ['Revenue Projections'],
      ['Weekly Revenue', formatCurrency(weeklyRevenue)],
      ['Monthly Revenue', formatCurrency(monthlyRevenue)],
      ['Annual Revenue', formatCurrency(monthlyRevenue * inputs.seasonalityFactor)],
      [''],
      ['Cost & Profit Analysis'],
      ['Monthly COGS', formatCurrency(monthlyCOGS)],
      ['Monthly Overhead', formatCurrency(totalMonthlyOverhead)],
      ['Monthly Net Profit', formatCurrency(monthlyNetProfit)],
      [''],
      ['Input Parameters'],
      ['Average Spend per Customer', formatCurrency(inputs.averageSpend)],
      ['Monthly Catering Revenue', formatCurrency(inputs.monthlyEventRevenue)],
      ['COGS Percentage', `${inputs.cogsPercentage}%`],
      ['Include Labor Costs', inputs.includeLaborCost ? 'Yes' : 'No'],
      ['Seasonality Factor', `${inputs.seasonalityFactor} months`],
      [''],
      ['24-Month Financial Projections'],
      ['Month,Revenue,Expenses,Net Profit,Total Sales,Labor Cost']
    ];

    // Use the same data generation function as the table
    const monthlyData = generateMonthlyData();
    monthlyData.forEach(month => {
      summaryData.push([
        `Month ${month.month}`,
        formatCurrency(month.revenue).replace(/,/g, ''),
        formatCurrency(month.expenses).replace(/,/g, ''),
        formatCurrency(month.netProfit).replace(/,/g, ''),
        month.sales.toString(),
        formatCurrency(month.laborCost).replace(/,/g, '')
      ]);
    });

    const csvContent = summaryData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `food-truck-projections-${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <BorderContainer>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-emerald-600" />
            Food Truck Business Projections
          </h2>
          <InputButton
            onClick={downloadCSV}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download CSV
          </InputButton>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Break Even Analysis</h3>
            <Tooltip content="Break-even analysis shows the minimum revenue and sales needed to cover all costs. This is the point where total revenue equals total expenses, resulting in zero profit or loss.">
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
            </Tooltip>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Monthly Revenue Needed</p>
              <p className="text-2xl font-bold text-skin-emerald-text">{formatCurrency(breakEvenRevenue)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Sales Needed per Month</p>
              <p className="text-2xl font-bold text-skin-emerald-text">{formatNumber(breakEvenSales)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Projections</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Weekly Revenue</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(weeklyRevenue)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(monthlyRevenue)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Annual Revenue (Based on {inputs.seasonalityFactor} months)</p>
                <p className="text-xl font-semibold text-skin-emerald-text">
                  {formatCurrency(monthlyRevenue * inputs.seasonalityFactor)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost & Profit Analysis</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Monthly COGS</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(monthlyCOGS)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Monthly Overhead</p>
                <p className="text-xl font-semibold text-skin-red-text">{formatCurrency(totalMonthlyOverhead)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Monthly Net Profit</p>
                <p className={`text-xl font-semibold ${monthlyNetProfit >= 0 ? 'text-skin-emerald-text' : 'text-red-600'}`}>
                  {formatCurrency(monthlyNetProfit)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BorderContainer>
  );
};

export default ResultsSection;