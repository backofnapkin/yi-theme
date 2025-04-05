import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { monthNames } from './seasonality.js';
import TooltipInfo from './TooltipInfo.jsx';

const ResultsSection = ({ results, menuItems, operations, expenses, exportData, copyResults }) => {
  // Format currency function
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Format currency without cents for main sales numbers
  const formatCurrencyNoCents = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // State for tooltip visibility
  const [activeTooltips, setActiveTooltips] = useState({});
  
  // Function to toggle tooltip visibility
  const toggleTooltip = (id) => {
    setActiveTooltips(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };
  
  // Tooltip descriptions
  const tooltips = {
    sales: "These are your projected sales figures based on your menu items, pricing, and estimated daily units sold.",
    profitPerUnit: "This shows how much profit you make on each menu item, considering only the direct costs (ingredients and packaging with waste).",
    fiveYear: "This chart projects your business performance over 5 years with your specified growth rates. Note the 20% failure rate at year 1 and 50% milestone at year 5 for ice cream shops.",
    seasonal: "This chart shows how your business performs through the seasons, with higher sales in summer months and lower sales in winter.",
    monthlyExpenses: "This breakdown shows all your monthly expenses and what percentage of your total expenses each category represents.",
    annualExpenses: "This shows your projected annual expenses assuming your business operates for the full specified months per year."
  };

  return (
    <div className="mt-8 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <i className="ri-pie-chart-line mr-2"></i>
        Profit Projection Results
      </h2>
      
      {/* Tooltip instructions */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-700">
          <i className="ri-information-line mr-1"></i>
          Click the <span className="font-bold">info icon</span> next to each section heading for more information about that data.
        </p>
      </div>
      
      {/* Main Results - Sales Only */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <h3 className="text-xl font-bold">Sales Projections</h3>
          <TooltipInfo 
            id="sales"
            active={activeTooltips.sales}
            toggle={() => toggleTooltip('sales')}
            text={tooltips.sales}
          />
        </div>
        
        {activeTooltips.sales && (
          <div className="mb-4"></div> // Space for tooltip
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 shadow-sm border border-emerald-100">
            <h3 className="text-sm text-emerald-600 uppercase font-semibold mb-2">Daily Sales</h3>
            <p className="text-3xl font-bold">{formatCurrencyNoCents(results.dailyRevenue)}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 shadow-sm border border-emerald-100">
            <h3 className="text-sm text-emerald-600 uppercase font-semibold mb-2">Monthly Sales</h3>
            <p className="text-3xl font-bold">{formatCurrencyNoCents(results.monthlyRevenue)}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 shadow-sm border border-emerald-100">
            <h3 className="text-sm text-emerald-600 uppercase font-semibold mb-2">Annual Sales</h3>
            <p className="text-3xl font-bold">{formatCurrencyNoCents(results.annualRevenue)}</p>
          </div>
        </div>
      </div>
      
      {/* Per Unit Profit */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <h3 className="text-xl font-bold">Profit per Unit</h3>
          <TooltipInfo 
            id="profitPerUnit"
            active={activeTooltips.profitPerUnit}
            toggle={() => toggleTooltip('profitPerUnit')}
            text={tooltips.profitPerUnit}
          />
        </div>
        
        {activeTooltips.profitPerUnit && (
          <div className="mb-4"></div> // Space for tooltip
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.profitPerUnit.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium mb-2">{item.name}</h4>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Profit per unit:</span>
                <span className="text-lg font-semibold">{formatCurrency(item.profit)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Margin:</span>
                <span className="text-lg font-semibold">{item.margin.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 5 Year Projection Chart */}
      <div className="mb-12">
        <div className="flex items-center mb-2">
          <h3 className="text-xl font-bold">5-Year Projection</h3>
          <TooltipInfo 
            id="fiveYear"
            active={activeTooltips.fiveYear}
            toggle={() => toggleTooltip('fiveYear')}
            text={tooltips.fiveYear}
          />
        </div>
        
        {activeTooltips.fiveYear && (
          <div className="mb-4"></div> // Space for tooltip
        )}
        
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
          <div className="overflow-x-auto md:overflow-visible">
            <div className="min-w-[500px] h-80">
              {!results.yearlyProjection || results.yearlyProjection.length === 0 ? (
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No data available to display chart</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={results.yearlyProjection}
                  >
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.05}/>
                      </linearGradient>
                      <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#DC2626" stopOpacity={0.05}/>
                      </linearGradient>
                      <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="year" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" tickFormatter={(tick) => `$${tick.toLocaleString()}`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    
                    {/* Reference lines for business milestones */}
                    <ReferenceLine x="1" stroke="#DC2626" strokeDasharray="3 3" label={{ value: "20% Fail", position: 'top', fill: "#DC2626" }} />
                    <ReferenceLine x="5" stroke="#059669" strokeDasharray="3 3" label={{ value: "50% Milestone", position: 'top', fill: "#059669" }} />
                    
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Revenue" 
                      stroke="#059669" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#revenueGradient)" 
                      dot={{ stroke: '#059669', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      name="Expenses" 
                      stroke="#DC2626" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#expensesGradient)" 
                      dot={{ stroke: '#DC2626', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#DC2626', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      name="Net Profit" 
                      stroke="#2563EB" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#profitGradient)" 
                      dot={{ stroke: '#2563EB', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#2563EB', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Seasonal Chart */}
      <div className="mb-12">
        <div className="flex items-center mb-2">
          <h3 className="text-xl font-bold">Seasonal Monthly Projection</h3>
          <TooltipInfo 
            id="seasonal"
            active={activeTooltips.seasonal}
            toggle={() => toggleTooltip('seasonal')}
            text={tooltips.seasonal}
          />
        </div>
        
        {activeTooltips.seasonal && (
          <div className="mb-4"></div> // Space for tooltip
        )}
        
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
          <div className="overflow-x-auto md:overflow-visible">
            <div className="min-w-[600px] h-80">
              {!results.monthlyProjection || results.monthlyProjection.length === 0 ? (
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No data available to display chart</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={results.monthlyProjection}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" tickFormatter={(tick) => `$${tick.toLocaleString()}`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#059669" />
                    <Bar dataKey="expenses" name="Expenses" fill="#DC2626" />
                    <Bar dataKey="profit" name="Net Profit" fill="#2563EB" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="flex items-center mb-2">
            <h3 className="text-xl font-bold">Monthly Expense Breakdown</h3>
            <TooltipInfo 
              id="monthlyExpenses"
              active={activeTooltips.monthlyExpenses}
              toggle={() => toggleTooltip('monthlyExpenses')}
              text={tooltips.monthlyExpenses}
            />
          </div>
          
          {activeTooltips.monthlyExpenses && (
            <div className="mb-4"></div> // Space for tooltip
          )}
          
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            {!results.expenseBreakdown || !results.expenseBreakdown.monthly || results.expenseBreakdown.monthly.length === 0 ? (
              <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No expense data available</p>
              </div>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="py-2 border-b border-gray-200 text-left">Expense</th>
                    <th className="py-2 border-b border-gray-200 text-right">Amount</th>
                    <th className="py-2 border-b border-gray-200 text-right">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {results.expenseBreakdown.monthly.map((expense, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-2">{expense.name}</td>
                      <td className="py-2 text-right">{formatCurrency(expense.amount)}</td>
                      <td className="py-2 text-right">{expense.percentage.toFixed(1)}%</td>
                    </tr>
                  ))}
                  <tr className="font-semibold bg-gray-50">
                    <td className="py-2">Total Monthly Expenses</td>
                    <td className="py-2 text-right text-skin-red-text">{formatCurrency(results.totalMonthlyExpenses)}</td>
                    <td className="py-2 text-right text-skin-red-text">100%</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex items-center mb-2">
            <h3 className="text-xl font-bold">Annual Expense Breakdown</h3>
            <TooltipInfo 
              id="annualExpenses"
              active={activeTooltips.annualExpenses}
              toggle={() => toggleTooltip('annualExpenses')}
              text={tooltips.annualExpenses}
            />
          </div>
          
          {activeTooltips.annualExpenses && (
            <div className="mb-4"></div> // Space for tooltip
          )}
          
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            {!results.expenseBreakdown || !results.expenseBreakdown.annual || results.expenseBreakdown.annual.length === 0 ? (
              <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No expense data available</p>
              </div>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="py-2 border-b border-gray-200 text-left">Expense</th>
                    <th className="py-2 border-b border-gray-200 text-right">Amount</th>
                    <th className="py-2 border-b border-gray-200 text-right">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {results.expenseBreakdown.annual.map((expense, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-2">{expense.name}</td>
                      <td className="py-2 text-right">{formatCurrency(expense.amount)}</td>
                      <td className="py-2 text-right">{expense.percentage.toFixed(1)}%</td>
                    </tr>
                  ))}
                  <tr className="font-semibold bg-gray-50">
                    <td className="py-2">Total Annual Expenses</td>
                    <td className="py-2 text-right text-skin-red-text">{formatCurrency(results.totalAnnualExpenses)}</td>
                    <td className="py-2 text-right text-skin-red-text">100%</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      
      {/* Export Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button 
          onClick={copyResults}
          className="bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 active:from-green-200 active:to-emerald-200 text-gray-700 border border-emerald-100 shadow-sm font-medium py-2 px-4 rounded-md flex items-center transition-colors"
        >
          <i className="ri-clipboard-line mr-2"></i>
          Copy Results
        </button>
        
        <button 
          onClick={exportData}
          className="bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 active:from-green-200 active:to-emerald-200 text-gray-700 border border-emerald-100 shadow-sm font-medium py-2 px-4 rounded-md flex items-center transition-colors"
        >
          <i className="ri-download-line mr-2"></i>
          Download as Text File
        </button>
      </div>
    </div>
  );
};

export default ResultsSection;