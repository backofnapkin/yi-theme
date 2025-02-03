import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Info } from 'lucide-react';
import { Tooltip } from '../../ui/Tooltip';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

interface UnitPerformanceChartProps {
  revenuePerUnit: number;
  utilizationRate: number;
  monthlyOperatingCosts: number; // Add this prop
}

export const UnitPerformanceChart: React.FC<UnitPerformanceChartProps> = ({
  revenuePerUnit,
  utilizationRate,
  monthlyOperatingCosts,
}) => {
  // Calculate annual values
  const annualPotentialRevenue = revenuePerUnit * 12;
  const annualActualRevenue = annualPotentialRevenue * (utilizationRate / 100);
  const annualExpenses = monthlyOperatingCosts * 12; // Use actual monthly operating costs
  const annualProfit = annualActualRevenue - annualExpenses;

  const data = {
    labels: ['Annual Performance'],
    datasets: [
      {
        label: 'Potential Revenue',
        data: [annualPotentialRevenue],
        backgroundColor: '#059669',
        borderColor: '#047857',
        borderWidth: 1,
      },
      {
        label: 'Actual Revenue',
        data: [annualActualRevenue],
        backgroundColor: '#34d399',
        borderColor: '#10b981',
        borderWidth: 1,
      },
      {
        label: 'Total Expenses',
        data: [annualExpenses],
        backgroundColor: '#DC2626',
        borderColor: '#B91C1C',
        borderWidth: 1,
      },
      {
        label: 'Annual Profit',
        data: [annualProfit],
        backgroundColor: '#2563EB', // Changed to blue-600
        borderColor: '#1D4ED8', // Changed to blue-700
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'center' as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
          usePointStyle: true,
          boxWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#374151',
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyColor: '#374151',
        bodyFont: {
          size: 12,
        },
        padding: 12,
        borderColor: '#10b981',
        borderWidth: 2,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            return `${context.dataset.label}: $${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E7EB',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        Annual Laundromat Performance
        <Tooltip content="Comparison of potential vs actual revenue, expenses, and profit on an annual basis">
          <Info className="w-4 h-4 text-gray-400" />
        </Tooltip>
      </h3>
      <div className="h-[300px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};