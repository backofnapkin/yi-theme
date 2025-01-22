import React from 'react';
import type { CalculatorInputs } from './FoodTruckBusinessCalculator';
import { ResultsTable } from '../../ui/ResultsTable';

interface ProjectionsTableProps {
  inputs: CalculatorInputs;
}

const ProjectionsTable: React.FC<ProjectionsTableProps> = ({ inputs }) => {
  const generateMonthlyData = () => {
    const months = [];
    const totalWeeklySales = Object.values(inputs.dailySales).reduce((sum, sales) => sum + sales, 0);
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

  const columns = [
    { 
      key: 'month', 
      label: 'Month',
      format: (value: number) => `Month ${value}`
    },
    { 
      key: 'revenue', 
      label: 'Revenue',
      format: (value: number) => `$${value.toFixed(2)}`,
      className: 'text-right'
    },
    { 
      key: 'expenses', 
      label: 'Expenses',
      format: (value: number) => `$${value.toFixed(2)}`,
      className: 'text-right'
    },
    { 
      key: 'netProfit', 
      label: 'Net Profit',
      format: (value: number) => `$${value.toFixed(2)}`,
      className: (value: number) => `text-right ${value >= 0 ? 'text-green-600' : 'text-red-600'}`
    },
    { 
      key: 'sales', 
      label: 'Total Sales',
      format: (value: number) => value.toString(),
      className: 'text-right'
    },
    { 
      key: 'laborCost', 
      label: 'Labor Cost',
      format: (value: number) => `$${value.toFixed(2)}`,
      className: 'text-right'
    }
  ] as const;

  return (
    <ResultsTable
      title="24-Month Financial Projections"
      columns={columns}
      data={generateMonthlyData()}
      expandable={true}
      highlightRowCondition={(row) => row.netProfit > 10000}
      footerNote="Rows highlighted in green indicate months with exceptional performance (net profit > $10,000)"
      className="mt-6"
    />
  );
};

export default ProjectionsTable;