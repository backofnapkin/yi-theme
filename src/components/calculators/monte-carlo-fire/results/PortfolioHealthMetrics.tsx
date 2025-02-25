import React, { useState, useRef, useEffect } from 'react';
import type { SimulationResults } from '../types';
import {
  AlertTriangle,
  Target,
  Percent,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  AlertOctagon,
  Info,
  Activity,
} from 'lucide-react';

interface PortfolioHealthMetricsProps {
  simulationData: SimulationResults;
}

interface TooltipProps {
  content: string | React.ReactNode;
  children?: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const updateTooltipPosition = () => {
      if (!tooltipRef.current || !triggerRef.current) return;

      const tooltip = tooltipRef.current;
      const tooltipRect = tooltip.getBoundingClientRect();

      tooltip.style.left = '50%';
      tooltip.style.transform = 'translateX(-50%)';

      const updatedTooltipRect = tooltip.getBoundingClientRect();

      if (updatedTooltipRect.right > window.innerWidth) {
        const overflow = updatedTooltipRect.right - window.innerWidth;
        tooltip.style.left = `calc(50% - ${overflow + 8}px)`;
      }

      if (updatedTooltipRect.left < 0) {
        tooltip.style.left = `calc(50% - ${updatedTooltipRect.left - 8}px)`;
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', updateTooltipPosition);
    window.addEventListener('scroll', updateTooltipPosition);

    if (isOpen) {
      updateTooltipPosition();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updateTooltipPosition);
      window.removeEventListener('scroll', updateTooltipPosition);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block ml-1" ref={triggerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center cursor-pointer">
        <span className="text-gray-400 hover:text-gray-600 text-sm">ⓘ</span>
      </div>
      {isOpen && (
        <div
          ref={tooltipRef}
          className="absolute z-50 w-64 p-3 mt-2 text-xs rounded-lg shadow-lg"
          style={{
            backgroundColor: 'rgb(251, 251, 251)',
            border: '1px solid rgb(104, 157, 106)',
            color: 'rgb(80, 73, 69)',
            transform: 'translateX(-50%)',
            left: '50%',
            maxWidth: 'calc(100vw - 32px)',
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

const formatCurrency = (value: number) => {
  if (value === 0) return '$0';
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercent = (value: number) => {
  return `${value.toFixed(1)}%`;
};

const MetricCard: React.FC<{
  title: string;
  value: string;
  description: string;
  tooltipContent: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  alert?: boolean;
  forceRedArrow?: boolean;
  variant?: 'success' | 'failure' | 'default';
}> = ({ title, value, description, tooltipContent, icon, trend, alert, forceRedArrow, variant = 'default' }) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'success':
        return 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200';
      case 'failure':
        return 'bg-gradient-to-br from-red-300 to-red-400 border-red-500';
      default:
        return 'bg-white';
    }
  };

  return (
    <div
      className={`rounded-lg shadow-md p-4 border ${getBackgroundColor()} ${
        alert ? 'border-l-4 border-amber-500' : ''
      } w-full lg:max-w-sm`}
    >
      <div className="flex items-start space-x-3">
        <span
          className={`text-gray-600 ${
            variant === 'success' ? 'text-emerald-600' : 
            variant === 'failure' ? 'text-red-600' : ''
          } flex-shrink-0`}
        >
          {icon}
        </span>
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-1">
            <h3
              className={`text-base font-medium truncate ${
                variant === 'success' ? 'text-emerald-900' : 
                variant === 'failure' ? 'text-red-900' : 'text-gray-900'
              } lg:text-lg`}
            >
              {title}
            </h3>
            <Tooltip content={tooltipContent} />
          </div>
          <div className="mt-1 flex items-center flex-wrap gap-2">
            <span
              className={`text-xl font-bold truncate ${
                variant === 'success' ? 'text-emerald-700' : 
                variant === 'failure' ? 'text-red-700' : 'text-gray-900'
              } lg:text-2xl`}
            >
              {value}
            </span>
            {trend && (
              <span
                className={`flex-shrink-0 ${
                  forceRedArrow ? 'text-red-500' : trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                }`}
              >
                {forceRedArrow ? (
                  <ArrowDownRight size={16} />
                ) : trend === 'up' ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
              </span>
            )}
          </div>
          <p
            className={`mt-1 text-xs ${
              variant === 'success' ? 'text-emerald-600' : 
              variant === 'failure' ? 'text-red-600' : 'text-gray-600'
            } lg:text-sm`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const PortfolioHealthMetrics: React.FC<PortfolioHealthMetricsProps> = ({ simulationData }) => {
  const { metrics } = simulationData;
  const totalSimulations = simulationData.percentilePaths.p95.length;
  const failedCount = simulationData.percentilePaths.failed.length;
  const successRate = metrics.successRate;
  const failureRate = 100 - successRate;
  const needsAttention = successRate < 85;

  return (
    <div className="space-y-6 px-4 lg:px-0">
      <div className="flex items-center gap-2">
        <Activity className="w-6 h-6 text-gray-600" />
        <h2 className="text-2xl font-bold lg:text-3xl">Monte Carlo Analysis</h2>
        <Tooltip content="A comprehensive analysis of your retirement plan's health across multiple key metrics and scenarios." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <MetricCard
          title="Success %"
          value={formatPercent(successRate)}
          description={
            successRate >= 85
              ? 'Your plan shows strong potential for success'
              : 'Consider adjusting your plan to improve success rate'
          }
          tooltipContent="The percentage of simulated scenarios where your portfolio maintains sufficient funds throughout retirement. A rate of 85% or higher is generally considered safe."
          icon={<Target className="w-5 h-5" />}
          trend={successRate >= 85 ? 'up' : 'down'}
          alert={needsAttention}
          variant="success"
        />

        <MetricCard
          title="Failures"
          value={`${failedCount} (${formatPercent(failureRate)})`}
          description="Number of scenarios that fell below $50,000"
          tooltipContent="Count of simulations where your portfolio dropped below the minimum threshold of $50,000. This represents scenarios where the retirement plan becomes unsustainable."
          icon={<AlertOctagon className="w-5 h-5" />}
          trend="down"
          forceRedArrow={true}
          alert={failureRate > 15}
          variant="failure"
        />
      </div>

      {needsAttention && (
        <div className="mt-6 bg-gradient-to-br from-red-300 to-red-400 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-900 lg:text-xl">Action Recommended</h3>
              <div className="mt-2 text-sm text-red-600 space-y-1 lg:text-base">
                <p>Consider these adjustments to improve your retirement success rate:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  {successRate < 85 && <li>Increase savings or reduce planned retirement spending</li>}
                  {failureRate > 15 && (
                    <li>High failure rate detected - consider more conservative withdrawal strategy</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioHealthMetrics;