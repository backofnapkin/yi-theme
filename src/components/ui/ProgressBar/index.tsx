import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip } from '../Tooltip/index';

interface ProgressSegment {
  value: number;
  color: string;
  label: string;
  amount?: string | number;
  percentage?: number;
}

interface ProgressBarProps {
  segments: ProgressSegment[];
  title?: string;
  tooltip?: string;
  icon?: React.ReactNode;
  showLegend?: boolean;
  height?: 'sm' | 'md' | 'lg';
  className?: string;
}

const heightClasses = {
  sm: 'h-2',
  md: 'h-4',
  lg: 'h-6',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  segments,
  title,
  tooltip,
  icon,
  showLegend = true,
  height = 'md',
  className = '',
}) => {
  // Calculate total for percentage calculations
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  // Calculate percentages for each segment
  const segmentsWithPercentages = segments.map(segment => ({
    ...segment,
    percentage: (segment.value / total) * 100,
  }));

  return (
    <div className={className}>
      {/* Title Section */}
      {(title || tooltip) && (
        <div className="flex items-center gap-2 mb-4">
          {icon && icon}
          {title && <span className="font-semibold">{title}</span>}
          {tooltip && (
            <Tooltip content={tooltip}>
              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
            </Tooltip>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-skin-fill rounded-full overflow-hidden flex">
        {segmentsWithPercentages.map((segment, index) => (
          <div
            key={`${segment.label}-${index}`}
            className={`${heightClasses[height]} ${segment.color}`}
            style={{ width: `${segment.percentage}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className={`grid grid-cols-${segments.length} gap-4 mt-4 text-center`}>
          {segmentsWithPercentages.map((segment, index) => (
            <div key={`legend-${index}`} className="p-3 bg-skin-fill rounded-lg">
              <p className="text-sm text-skin-base">{segment.label}</p>
              {segment.amount && (
                <p className={`text-lg font-semibold ${segment.color}-text`}>
                  {segment.amount}
                </p>
              )}
              <p className="text-sm text-skin-base">
                ({segment.percentage?.toFixed(1)}%)
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Example usage:
/*
const segments = [
  {
    value: 5000,
    color: 'bg-skin-progress-expense',
    label: 'Expenses',
    amount: '$5,000',
  },
  {
    value: 3000,
    color: 'bg-skin-progress-profit',
    label: 'Profit',
    amount: '$3,000',
  },
];

<ProgressBar
  segments={segments}
  title="Revenue Breakdown"
  tooltip="Visual representation of your revenue distribution"
  icon={<PieChart className="w-5 h-5" />}
/>
*/