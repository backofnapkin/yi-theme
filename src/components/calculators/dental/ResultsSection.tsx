import React, { useEffect, useRef } from 'react';
import { Printer, Download } from 'lucide-react';
import Chart from 'chart.js/auto';

type Props = {
  practiceName: string;
  metrics: {
    monthlyRevenue: number;
    annualRevenue: number;
    monthlyOverhead: number;
    annualOverhead: number;
    netIncome: number;
    profitMargin: number;
  };
  employees: Array<{ title: string; salary: number }>;
};

export const ResultsSection = ({ practiceName, metrics, employees }: Props) => {
  const salaryChartRef = useRef<HTMLCanvasElement>(null);
  const roiChartRef = useRef<HTMLCanvasElement>(null);
  const scenarioChartRef = useRef<HTMLCanvasElement>(null);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  useEffect(() => {
    if (salaryChartRef.current) {
      const ctx = salaryChartRef.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: employees.map(emp => emp.title),
            datasets: [{
              data: employees.map(emp => emp.salary),
              backgroundColor: [
                '#4F46E5',
                '#7C3AED',
                '#DB2777',
                '#DC2626',
                '#EA580C',
                '#D97706'
              ]
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        });
      }
    }

    if (roiChartRef.current) {
      const ctx = roiChartRef.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
            datasets: [{
              label: 'Projected Revenue',
              data: [
                metrics.annualRevenue,
                metrics.annualRevenue * 1.1,
                metrics.annualRevenue * 1.2,
                metrics.annualRevenue * 1.3,
                metrics.annualRevenue * 1.4
              ],
              borderColor: '#4F46E5',
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => formatCurrency(Number(value))
                }
              }
            }
          }
        });
      }
    }
  }, [employees, metrics]);

  return (
    <div id="results">
      <div className="bg-skin-card p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-skin-base">
            Financial Analysis for {practiceName}
          </h2>
          <div className="flex gap-4 print:hidden">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-custom-second text-skin-base rounded-md hover:bg-custom-third transition-colors"
            >
              <Printer size={20} />
              Print Report
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-custom-forth text-skin-base rounded-md hover:bg-custom-fifth transition-colors"
            >
              <Download size={20} />
              Download CSV
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-4 bg-skin-secondary rounded-lg">
            <h3 className="text-lg font-semibold text-skin-base">Monthly Revenue</h3>
            <p className="text-2xl font-bold text-custom-active">{formatCurrency(metrics.monthlyRevenue)}</p>
          </div>
          <div className="p-4 bg-skin-secondary rounded-lg">
            <h3 className="text-lg font-semibold text-skin-base">Annual Revenue</h3>
            <p className="text-2xl font-bold text-custom-active">{formatCurrency(metrics.annualRevenue)}</p>
          </div>
          <div className="p-4 bg-skin-secondary rounded-lg">
            <h3 className="text-lg font-semibold text-skin-base">Net Income (Monthly)</h3>
            <p className="text-2xl font-bold text-custom-active">{formatCurrency(metrics.netIncome)}</p>
          </div>
          <div className="p-4 bg-skin-secondary rounded-lg">
            <h3 className="text-lg font-semibold text-skin-base">Monthly Overhead</h3>
            <p className="text-2xl font-bold text-custom-active">{formatCurrency(metrics.monthlyOverhead)}</p>
          </div>
          <div className="p-4 bg-skin-secondary rounded-lg">
            <h3 className="text-lg font-semibold text-skin-base">Annual Overhead</h3>
            <p className="text-2xl font-bold text-custom-active">{formatCurrency(metrics.annualOverhead)}</p>
          </div>
          <div className="p-4 bg-skin-secondary rounded-lg">
            <h3 className="text-lg font-semibold text-skin-base">Profit Margin</h3>
            <p className="text-2xl font-bold text-custom-active">{metrics.profitMargin.toFixed(1)}%</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mt-8">
          <div className="p-4 bg-skin-secondary rounded-lg">
            <h3 className="text-xl font-bold text-skin-base mb-4">Salary Breakdown</h3>
            <canvas ref={salaryChartRef}></canvas>
          </div>
          <div className="p-4 bg-skin-secondary rounded-lg">
            <h3 className="text-xl font-bold text-skin-base mb-4">5 Year ROI Projection</h3>
            <canvas ref={roiChartRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};
