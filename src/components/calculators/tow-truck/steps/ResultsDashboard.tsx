import React, { useState, useEffect } from 'react';
import { Download, Edit, HelpCircle, BarChart3, Save, TrendingUp, DollarSign, Truck } from 'lucide-react';
import type { CalculationResults, TowTruckBusinessData, ProjectionPeriod } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Area, ComposedChart, ReferenceLine } from 'recharts';
import { ExpensePieChart } from '../components/ExpensePieChart';
import { BorderContainer } from '../../../ui/BorderContainer';
import { Tooltip } from '../../../ui/Tooltip';

interface ResultsDashboardProps {
  results: CalculationResults;
  data: TowTruckBusinessData;
  onDownload: () => void;
  onEdit: () => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        backgroundColor: 'rgb(251, 251, 251)',
        border: '1px solid rgb(104, 157, 106)',
        padding: '1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        position: 'absolute',
        left: '20px',
        top: '20px',
        zIndex: 50,
        maxWidth: 'calc(100vw - 32px)',
        pointerEvents: 'none'
      }}
    >
      <p className="font-medium text-gray-900 mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-600">{entry.name}</span>
            </div>
            <span className="font-medium">${entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ExpenseCustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const entry = payload[0];
  return (
    <div
      style={{
        backgroundColor: 'rgb(251, 251, 251)',
        border: '1px solid rgb(104, 157, 106)',
        padding: '1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        position: 'absolute',
        left: '20px',
        top: '20px',
        zIndex: 50,
        maxWidth: 'calc(100vw - 32px)',
        pointerEvents: 'none'
      }}
    >
      <p className="font-medium text-gray-900 mb-2">{entry.name}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3" style={{ backgroundColor: entry.payload.color }} />
            <span className="text-gray-600">Amount</span>
          </div>
          <span className="font-medium">${entry.value.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-2 pb-1">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-item-${index}`} className="flex items-center">
          <div 
            className="w-3 h-3 mr-2" 
            style={{ backgroundColor: entry.color }} 
          />
          <span className="text-sm font-medium text-gray-700">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export function ResultsDashboard({ results, data, onDownload, onEdit }: ResultsDashboardProps) {
  const [projectionPeriod, setProjectionPeriod] = useState<ProjectionPeriod>('1year');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const cashFlowData = {
    '1year': results.cashFlow.oneYear,
    '3years': results.cashFlow.threeYears,
    '5years': results.cashFlow.fiveYears
  }[projectionPeriod];

  const periodLabels = {
    '1year': '12 Months',
    '3years': '3 Years',
    '5years': '5 Years'
  };

  const chartMargins = {
    top: isMobile ? 5 : 10,
    right: isMobile ? 10 : 24,
    left: isMobile ? -4 : -16,
    bottom: isMobile ? 5 : 5
  };

  const yAxisWidth = isMobile ? 40 : 50;
  const fontSize = isMobile ? 10 : 12;
  const chartHeight = isMobile ? 400 : 500;

  return (
    <div className="space-y-8">
      {/* Desktop header */}
      <div className="hidden md:flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Truck className="h-8 w-8 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900">{data.companyName}</h2>
        </div>
        <div className="space-x-4">
          <button
            onClick={onEdit}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
          >
            <Edit className="h-5 w-5 mr-2" />
            Edit Inputs
          </button>
          <button
            onClick={onDownload}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-gradient-to-br from-green-50 to-emerald-50 text-gray-700 hover:from-green-100 hover:to-emerald-100 transition-colors duration-200 shadow-sm"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Report
          </button>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Truck className="h-8 w-8 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900">{data.companyName}</h2>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={onEdit}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
          >
            <Edit className="h-5 w-5 mr-2" />
            Edit Inputs
          </button>
          <button
            onClick={onDownload}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-gradient-to-br from-green-50 to-emerald-50 text-gray-700 hover:from-green-100 hover:to-emerald-100 transition-colors duration-200 shadow-sm"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Monthly Revenue"
          value={results.monthlyRevenue}
          type="currency"
          color="green"
          icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
          tooltip="Total projected monthly revenue based on your operating assumptions"
        />
        <MetricCard
          title="Monthly Expenses"
          value={results.monthlyExpenses}
          type="currency"
          color="red"
          icon={<TrendingUp className="h-5 w-5 text-red-600" />}
          tooltip="Total monthly costs including loan payments, fuel, insurance, and other expenses"
          className="text-skin-red-text"
        />
        <MetricCard
          title="Monthly Profit"
          value={results.monthlyProfit}
          type="currency"
          color="green"
          icon={<BarChart3 className="h-5 w-5 text-emerald-600" />}
          tooltip="Net monthly profit after all expenses are paid"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BorderContainer>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Break-Even Analysis</h3>
            <Tooltip content="The minimum number of tows needed monthly to cover all expenses. Operating above this number ensures profitability.">
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
            </Tooltip>
          </div>
          <p className="text-3xl font-bold text-emerald-600">
            {Math.ceil(results.requiredTowsPerMonth)} tows per month
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Minimum tows needed monthly to cover expenses
          </p>
        </BorderContainer>

        <BorderContainer>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Annual Projections</h3>
            <Tooltip content="Yearly financial projections based on your monthly estimates. Use these figures for long-term planning and financing.">
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
            </Tooltip>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Revenue:</span>
              <span className="font-semibold text-blue-600">
                ${results.yearlyRevenue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expenses:</span>
              <span className="font-semibold text-skin-red-text">
                ${results.yearlyExpenses.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600">Profit:</span>
              <span className="font-semibold text-emerald-600">
                ${results.yearlyProfit.toLocaleString()}
              </span>
            </div>
          </div>
        </BorderContainer>
      </div>

      <BorderContainer>
        {/* Desktop view - title and period selector */}
        <div className="hidden md:flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">Cash Flow Projection</h3>
            <Tooltip content={`Projected growth based on a ${data.monthlyGrowthRate}% monthly increase in revenue, with expenses growing at a slower rate.`}>
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
            </Tooltip>
          </div>
          <div className="flex gap-2">
            {(['1year', '3years', '5years'] as ProjectionPeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setProjectionPeriod(period)}
                className={`px-3 py-1 rounded-xl text-sm font-medium transition-colors border border-gray-200 shadow-sm ${
                  projectionPeriod === period
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 text-gray-700 hover:from-green-100 hover:to-emerald-100'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {periodLabels[period]}
              </button>
            ))}
          </div>
        </div>
        
        {/* Mobile view - title and period selector */}
        <div className="md:hidden space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">Cash Flow Projection</h3>
            <Tooltip content={`Projected growth based on a ${data.monthlyGrowthRate}% monthly increase in revenue, with expenses growing at a slower rate.`}>
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
            </Tooltip>
          </div>
          <div className="flex justify-center gap-2">
            {(['1year', '3years', '5years'] as ProjectionPeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setProjectionPeriod(period)}
                className={`px-3 py-1 rounded-xl text-sm font-medium transition-colors border border-gray-200 shadow-sm ${
                  projectionPeriod === period
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 text-gray-700 hover:from-green-100 hover:to-emerald-100'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {periodLabels[period]}
              </button>
            ))}
          </div>
        </div>
        
        <div 
          className="chart-container relative"
          style={{
            height: chartHeight,
            width: 'calc(100% + 16px)',
            minWidth: isMobile ? '300px' : 'auto',
            overflowX: isMobile ? 'auto' : 'visible',
            overflowY: 'hidden',
            marginLeft: '-8px',
            marginRight: '-8px',
            position: 'relative'
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={cashFlowData}
              margin={chartMargins}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="4 4" 
                stroke="#D1D5DB" 
                strokeWidth={1} 
                opacity={0.5} 
              />
              
              <XAxis
                dataKey="month"
                interval={projectionPeriod === '1year' ? 0 : 'preserveStartEnd'}
                angle={-45}
                textAnchor="end"
                height={60}
                stroke="#6B7280"
                tick={{ 
                  fill: '#6B7280',
                  fontSize: fontSize
                }}
                tickLine={{ stroke: '#6B7280' }}
              />
              
              <YAxis
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
                tick={{ 
                  dx: 5,
                  textAnchor: "start",
                  fontSize: fontSize,
                  fill: '#6B7280'
                }}
                width={yAxisWidth}
                tickSize={0}
                domain={[0, 'auto']}
                allowDecimals={false}
                orientation="left"
              />
              
              <RechartsTooltip content={<CustomTooltip />} />
              
              <Legend content={<CustomLegend />} />
              
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#4F46E5"
                fill="url(#revenueGradient)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
              
              <Area
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#EF4444"
                fill="url(#expensesGradient)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
              
              <Area
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke="#10B981"
                fill="url(#profitGradient)"
                strokeWidth={3}
                dot={false}
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </BorderContainer>

      <BorderContainer title="Annual Expense Breakdown">
        <div className="flex items-center gap-2 mb-4">
          <Tooltip content="Detailed breakdown of your annual expenses. Hover over segments for more information.">
            <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
          </Tooltip>
        </div>
        <ExpensePieChart data={results.expenseBreakdown} customTooltip={ExpenseCustomTooltip} />
      </BorderContainer>
      
      <BorderContainer title="Expense Categories">
        <div className="flex items-center gap-2 mb-4">
          <Tooltip content="Breakdown of your major expense categories by percentage and amount.">
            <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
          </Tooltip>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {results.expenseBreakdown.map((expense, index) => (
            <div key={index} className="relative">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{expense.name}</span>
                <span className="text-sm font-medium text-gray-700">${Math.round(expense.amount).toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="h-2.5 rounded-full" 
                  style={{ width: `${expense.percentage}%`, backgroundColor: expense.color }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">{expense.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </BorderContainer>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  type: 'currency' | 'number';
  color: 'blue' | 'red' | 'green';
  tooltip: string;
  icon?: React.ReactNode;
  className?: string;
}

function MetricCard({ title, value, type, color, tooltip, icon, className }: MetricCardProps) {
  const formattedValue = type === 'currency'
    ? `$${value.toLocaleString()}`
    : value.toLocaleString();

  const colorClasses = {
    blue: 'text-blue-600',
    red: 'text-red-600',
    green: 'text-emerald-600'
  };

  return (
    <div className="border border-gray-200 rounded-xl shadow-sm p-6 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <Tooltip content={tooltip}>
            <HelpCircle className="h-4 w-4 text-gray-400 cursor-pointer" />
          </Tooltip>
        </div>
      </div>
      <p className={`mt-2 text-3xl font-bold ${colorClasses[color]} ${className || ''}`}>
        {formattedValue}
      </p>
    </div>
  );
}