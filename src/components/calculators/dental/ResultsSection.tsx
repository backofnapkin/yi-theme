import React, { useEffect, useRef } from 'react';
import { useDentalContext } from './DentalContext';
import { Printer, Download } from 'lucide-react';
import Chart from 'chart.js/auto';

export const ResultsSection = () => {
  const { state } = useDentalContext();
  const { basicInfo, employees, overhead, results } = state;

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

  // Calculate different scenarios
  const calculateBestCase = (monthlyRevenue: number) => {
    const bestCasePatients = basicInfo.patientsPerChair + 2;
    const bestCaseRevenue = 
      basicInfo.dentalChairs *
      bestCasePatients *
      basicInfo.revenuePerPatient *
      7 * // 7 days per week
      4.33; // weeks per month
    return bestCaseRevenue;
  };

  const calculateWorstCase = (monthlyRevenue: number) => {
    return monthlyRevenue * 0.75; // 25% lower
  };

  // Calculate ROI projections
  const calculateROIProjections = () => {
    if (!results) return [];
    
    const initialInvestment = basicInfo.startupCosts;
    const annualOperatingCosts = results.annualOverhead;
    const annualRevenue = results.annualRevenue;
    const netProfit = annualRevenue - annualOperatingCosts;
    
    return Array.from({ length: 5 }, (_, year) => {
      const cumulativeProfit = netProfit * (year + 1);
      const roi = ((cumulativeProfit - initialInvestment) / initialInvestment) * 100;
      return roi;
    });
  };

  useEffect(() => {
    let salaryChart: Chart | null = null;
    let roiChart: Chart | null = null;
    let scenarioChart: Chart | null = null;

    if (salaryChartRef.current) {
      const ctx = salaryChartRef.current.getContext('2d');
      if (ctx) {
        if (salaryChart) {
          salaryChart.destroy();
        }

        salaryChart = new Chart(ctx, {
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
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const value = context.raw as number;
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      }
    }

    if (roiChartRef.current && results) {
      const ctx = roiChartRef.current.getContext('2d');
      if (ctx) {
        if (roiChart) {
          roiChart.destroy();
        }

        const roiData = calculateROIProjections();

        roiChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
            datasets: [{
              label: 'Return on Investment (%)',
              data: roiData,
              borderColor: 'rgb(79, 70, 229)',
              backgroundColor: 'rgba(79, 70, 229, 0.15)',
              fill: true,
              tension: 0.3,
              borderWidth: 2,
              pointBackgroundColor: 'rgb(79, 70, 229)',
              pointBorderColor: 'rgb(79, 70, 229)',
              pointHoverBackgroundColor: 'rgb(79, 70, 229)',
              pointHoverBorderColor: 'rgb(79, 70, 229)',
              pointRadius: 4,
              pointHoverRadius: 6,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'bottom'
              },
              tooltip: {
                enabled: true,
                backgroundColor: 'rgba(241, 241, 241, 0.9)',
                titleColor: 'rgb(80, 73, 69)',
                bodyColor: 'rgb(80, 73, 69)',
                borderColor: 'rgb(79, 70, 229)',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                  label: function(context) {
                    const roi = context.raw as number;
                    return `ROI: ${roi.toFixed(1)}%`;
                  }
                }
              }
            },
            scales: {
              y: {
                display: true,
                grid: {
                  display: true
                },
                ticks: {
                  callback: value => `${value.toFixed(1)}%`
                }
              },
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  color: 'rgb(80, 73, 69)',
                  font: {
                    size: 14,
                    weight: 'bold'
                  }
                }
              }
            },
            layout: {
              padding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
              }
            }
          }
        });
      }
    }

    if (scenarioChartRef.current && results) {
      const ctx = scenarioChartRef.current.getContext('2d');
      if (ctx) {
        if (scenarioChart) {
          scenarioChart.destroy();
        }

        scenarioChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Current Projections', 'Best Case', 'Worst Case'],
            datasets: [{
              label: 'Monthly Revenue',
              data: [
                results.monthlyRevenue,
                calculateBestCase(results.monthlyRevenue),
                calculateWorstCase(results.monthlyRevenue)
              ],
              backgroundColor: [
                '#4F46E5',  // Current
                '#059669',  // Best case
                '#DC2626'   // Worst case
              ],
              borderColor: 'transparent'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || '';
                    const value = formatCurrency(context.raw as number);
                    return `${context.label} - ${label} ${value}`;
                  }
                }
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

    // Cleanup
    return () => {
      if (salaryChart) salaryChart.destroy();
      if (roiChart) roiChart.destroy();
      if (scenarioChart) scenarioChart.destroy();
    };
  }, [employees, results, basicInfo]);

  if (!results) return null;

  const handleExportCSV = () => {
    const data = [
      ['Practice Information'],
      ['Practice Name', basicInfo.practiceName],
      ['Dental Chairs', basicInfo.dentalChairs],
      ['Patients per Chair', basicInfo.patientsPerChair],
      ['Revenue per Patient', basicInfo.revenuePerPatient],
      ['Days per Week', basicInfo.daysPerWeek],
      ['Startup Costs', basicInfo.startupCosts],
      [],
      ['Financial Projections'],
      ['Monthly Revenue', results.monthlyRevenue],
      ['Annual Revenue', results.annualRevenue],
      ['Monthly Overhead', results.monthlyOverhead],
      ['Annual Overhead', results.annualOverhead],
      ['Net Income (Monthly)', results.netIncome],
      ['Profit Margin', `${results.profitMargin}%`],
      [],
      ['Employees'],
      ['Title', 'Monthly Salary'],
      ...employees.map(emp => [emp.title, emp.salary]),
      [],
      ['Overhead Costs'],
      ['Name', 'Monthly Amount'],
      ...overhead.map(cost => [cost.name, cost.amount])
    ];

    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${basicInfo.practiceName.replace(/\s+/g, '-')}-projections.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="results">
      <div className="bg-skin-card p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-skin-base">
            Financial Analysis for {basicInfo.practiceName}
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
              onClick={handleExportCSV}
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
            <p className="text-2xl font-bold text-[#0EC07C]">{formatCurrency(results.monthlyRevenue)}</p>
          </div>
        <div className="p-4 bg-skin-secondary rounded-lg">
          <h3 className="text-lg font-semibold text-skin-base">Annual Revenue</h3>
           <p className="text-2xl font-bold text-[#0EC07C]">{formatCurrency(results.annualRevenue)}</p>
         </div>
          <div className="p-4 bg-skin-secondary rounded-lg">
            <h3 className="text-lg font-semibold text-skin-base">Net Income (Monthly)</h3>
            <p className="text-2xl font-bold text-custom-active">{formatCurrency(results.netIncome)}</p>
          </div>
        <div className="p-4 bg-skin-secondary rounded-lg">
            <h3 className="text-lg font-semibold text-skin-base">Monthly Overhead</h3>
            <p className="text-2xl font-bold text-[#DC2626]">{formatCurrency(results.monthlyOverhead)}</p>
         </div>
        <div className="p-4 bg-skin-secondary rounded-lg">
            <h3 className="text-lg font-semibold text-skin-base">Annual Overhead</h3>
            <p className="text-2xl font-bold text-[#DC2626]">{formatCurrency(results.annualOverhead)}</p>
        </div>
          <div className="p-4 bg-skin-secondary rounded-lg">
            <h3 className="text-lg font-semibold text-skin-base">Profit Margin</h3>
            <p className="text-2xl font-bold text-custom-active">{results.profitMargin.toFixed(1)}%</p>
          </div>
        </div>

        <div className="space-y-8 mt-8">
          <div className="p-6 bg-skin-secondary rounded-lg">
            <h3 className="text-xl font-bold text-skin-base mb-4">Monthly Salary Breakdown</h3>
            <div className="h-[400px] w-full">
              <canvas ref={salaryChartRef}></canvas>
            </div>
          </div>
          
          <div className="p-6 bg-skin-secondary rounded-lg">
            <h3 className="text-xl font-bold text-skin-base mb-4">5 Year ROI Projection</h3>
            <div className="h-[400px] w-full">
              <canvas ref={roiChartRef}></canvas>
            </div>
          </div>

          <div className="p-6 bg-skin-secondary rounded-lg">
            <h3 className="text-xl font-bold text-skin-base mb-4">Financial Projections Scenarios</h3>
            <div className="h-[400px] w-full">
              <canvas ref={scenarioChartRef}></canvas>
            </div>
            
            <div className="mt-6 space-y-4">
              <h4 className="text-lg font-semibold text-skin-base">Scenario Details</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg border border-skin-base">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-[#4F46E5]"></div>
                    <h5 className="font-semibold">Current Projections</h5>
                    </div>
                  <p className="text-sm text-skin-base">
                    Based on {basicInfo.dentalChairs} chairs, {basicInfo.patientsPerChair} patients per chair,
                    {formatCurrency(basicInfo.revenuePerPatient)} per patient, {basicInfo.daysPerWeek} days per week
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-skin-base">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-[#059669]"></div>
                    <h5 className="font-semibold">Best Case Scenario</h5>
                  </div>
                  <p className="text-sm text-skin-base">
                    Assumes +2 patients per chair per day and operating 7 days per week, 
                    maximizing chair utilization and weekend appointments
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-skin-base">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-[#DC2626]"></div>
                    <h5 className="font-semibold">Worst Case Scenario</h5>
                  </div>
                  <p className="text-sm text-skin-base">
                    Projects 25% lower revenue than current projections, accounting for potential 
                    market challenges or lower patient volume
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
