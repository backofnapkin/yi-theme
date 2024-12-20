import React, { useEffect, useRef } from 'react';
import { useDentalContext } from './DentalContext';
import { Printer, Download } from 'lucide-react';
import Chart from 'chart.js/auto';

export const ResultsSection = () => {
 const { state } = useDentalContext();
 const { basicInfo, employees, overhead, results } = state;

 const salaryChartRef = useRef<HTMLCanvasElement>(null);
 const roiChartRef = useRef<HTMLCanvasElement>(null);
 
 // Format currency
 const formatCurrency = (value: number) => {
   return new Intl.NumberFormat('en-US', {
     style: 'currency',
     currency: 'USD',
     maximumFractionDigits: 0
   }).format(value);
 };

 useEffect(() => {
   let salaryChart: Chart | null = null;
   let roiChart: Chart | null = null;

   if (salaryChartRef.current) {
     const ctx = salaryChartRef.current.getContext('2d');
     if (ctx) {
       // Destroy existing chart if it exists
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
             }
           }
         }
       });
     }
   }

   if (roiChartRef.current && results) {
     const ctx = roiChartRef.current.getContext('2d');
     if (ctx) {
       // Destroy existing chart if it exists
       if (roiChart) {
         roiChart.destroy();
       }

       roiChart = new Chart(ctx, {
         type: 'line',
         data: {
           labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
           datasets: [{
             label: 'Projected Revenue',
             data: [
               results.annualRevenue,
               results.annualRevenue * 1.1,
               results.annualRevenue * 1.2,
               results.annualRevenue * 1.3,
               results.annualRevenue * 1.4
             ],
             borderColor: '#4F46E5',
             tension: 0.1
           }]
         },
         options: {
           responsive: true,
           maintainAspectRatio: false,
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

   // Cleanup
   return () => {
     if (salaryChart) salaryChart.destroy();
     if (roiChart) roiChart.destroy();
   };
 }, [employees, results]);

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
           <p className="text-2xl font-bold text-custom-active">{formatCurrency(results.monthlyRevenue)}</p>
         </div>
         <div className="p-4 bg-skin-secondary rounded-lg">
           <h3 className="text-lg font-semibold text-skin-base">Annual Revenue</h3>
           <p className="text-2xl font-bold text-custom-active">{formatCurrency(results.annualRevenue)}</p>
         </div>
         <div className="p-4 bg-skin-secondary rounded-lg">
           <h3 className="text-lg font-semibold text-skin-base">Net Income (Monthly)</h3>
           <p className="text-2xl font-bold text-custom-active">{formatCurrency(results.netIncome)}</p>
         </div>
         <div className="p-4 bg-skin-secondary rounded-lg">
           <h3 className="text-lg font-semibold text-skin-base">Monthly Overhead</h3>
           <p className="text-2xl font-bold text-custom-active">{formatCurrency(results.monthlyOverhead)}</p>
         </div>
         <div className="p-4 bg-skin-secondary rounded-lg">
           <h3 className="text-lg font-semibold text-skin-base">Annual Overhead</h3>
           <p className="text-2xl font-bold text-custom-active">{formatCurrency(results.annualOverhead)}</p>
         </div>
         <div className="p-4 bg-skin-secondary rounded-lg">
           <h3 className="text-lg font-semibold text-skin-base">Profit Margin</h3>
           <p className="text-2xl font-bold text-custom-active">{results.profitMargin.toFixed(1)}%</p>
         </div>
       </div>

       <div className="space-y-8 mt-8">
         <div className="p-6 bg-skin-secondary rounded-lg">
           <h3 className="text-xl font-bold text-skin-base mb-4">Salary Breakdown</h3>
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
       </div>
     </div>
   </div>
 );
};
