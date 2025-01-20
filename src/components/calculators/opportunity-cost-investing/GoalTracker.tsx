import React, { useEffect, useRef, useState } from 'react';
import { Target } from 'lucide-react';
import { type CalculatorInputs, type CalculatorResults } from './calculations';

interface GoalTrackerProps {
  results: CalculatorResults;
  inputs: CalculatorInputs;
}

interface ValueTooltip {
  x: number;
  y: number;
  value: number;
  month: number;
}

interface Point {
  x: number;
  y: number;
  value: number;
}

interface ClosestPoint {
  distance: number;
  point: Point | null;
  month: number;
}

export default function GoalTracker({ results, inputs }: GoalTrackerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showGoal, setShowGoal] = useState(true);
  const [tooltip, setTooltip] = useState<ValueTooltip | null>(null);
  const monthlyPointsRef = useRef<Point[]>([]);

  const drawChart = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = canvas.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 30, left: 30 };
    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    const maxValue = Math.max(results.futureValue, inputs.goalAmount || 0);

    const totalMonths = inputs.years * 12 + inputs.months;
    let goalReachedMonth = -1;
    const monthlyPoints = Array.from({ length: totalMonths + 1 }, (_, i) => {
      const monthlyReturn = inputs.projectedReturn / 100 / 12;
      const value = inputs.initialInvestment * Math.pow(1 + monthlyReturn, i);
      
      if (goalReachedMonth === -1 && value >= inputs.goalAmount) {
        goalReachedMonth = i;
      }
      
      return {
        x: padding.left + (i / totalMonths) * graphWidth,
        y: height - padding.bottom - (value / maxValue) * graphHeight,
        value
      };
    });

    monthlyPointsRef.current = monthlyPoints;

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';

    // Vertical grid lines (time)
    const yearIntervals = Math.min(inputs.years, 5);
    for (let i = 0; i <= yearIntervals; i++) {
      const x = padding.left + (i / yearIntervals) * graphWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();

      // Year labels
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      const year = Math.round((i / yearIntervals) * inputs.years);
      ctx.fillText(`${year}y`, x, height - padding.bottom + 20);
    }

    // Horizontal grid lines (no labels)
    const valueIntervals = 5;
    for (let i = 0; i <= valueIntervals; i++) {
      const y = padding.top + (i / valueIntervals) * graphHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Draw goal visualization if enabled
    if (showGoal && inputs.goalAmount > 0) {
      const goalY = height - padding.bottom - (inputs.goalAmount / maxValue) * graphHeight;
      
      ctx.beginPath();
      ctx.strokeStyle = '#ef4444';
      ctx.setLineDash([5, 5]);
      ctx.moveTo(padding.left, goalY);
      ctx.lineTo(width - padding.right, goalY);
      ctx.stroke();
      ctx.setLineDash([]);

      if (goalReachedMonth !== -1) {
        const intersectionX = padding.left + (goalReachedMonth / totalMonths) * graphWidth;
        const intersectionY = goalY;

        ctx.beginPath();
        ctx.fillStyle = '#ef4444';
        ctx.arc(intersectionX, intersectionY, 6, 0, Math.PI * 2);
        ctx.fill();

        const yearsToGoal = Math.floor(goalReachedMonth / 12);
        const monthsToGoal = goalReachedMonth % 12;
        ctx.fillStyle = '#ef4444';
        ctx.textAlign = 'center';
        ctx.font = 'bold 12px sans-serif';
        const timeLabel = `Goal reached in ${yearsToGoal}y ${monthsToGoal}m`;
        ctx.fillText(timeLabel, intersectionX, intersectionY - 15);
      }
    }

    // Create gradient for line
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, '#059669'); // emerald-600
    gradient.addColorStop(1, '#059669'); // emerald-600

    // Draw investment growth line (thicker)
    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    monthlyPoints.forEach((point, i) => {
      if (i === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();

    // Add gradient under the line
    const fillGradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    fillGradient.addColorStop(0, 'rgba(5, 150, 105, 0.1)'); // emerald-600 with opacity
    fillGradient.addColorStop(1, 'rgba(5, 150, 105, 0)');

    ctx.beginPath();
    ctx.fillStyle = fillGradient;
    monthlyPoints.forEach((point, i) => {
      if (i === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(monthlyPoints[monthlyPoints.length - 1].x, height - padding.bottom);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.fill();

    // Draw tooltip if active
    if (tooltip) {
      ctx.beginPath();
      ctx.fillStyle = '#059669'; // emerald-600
      ctx.arc(tooltip.x, tooltip.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Draw tooltip background
      const tooltipText = `$${Math.round(tooltip.value).toLocaleString()}`;
      const tooltipWidth = ctx.measureText(tooltipText).width + 16;
      const tooltipHeight = 28;
      const tooltipX = Math.min(Math.max(tooltip.x - tooltipWidth / 2, padding.left), width - padding.right - tooltipWidth);
      const tooltipY = Math.max(tooltip.y - tooltipHeight - 10, padding.top);

      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 4);
      ctx.fill();

      // Draw tooltip text
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(tooltipText, tooltipX + tooltipWidth / 2, tooltipY + tooltipHeight / 2 + 4);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find the closest point on the line
    const closestPoint = monthlyPointsRef.current.reduce<ClosestPoint>((closest, point, index) => {
      const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
      if (distance < closest.distance) {
        return { distance, point, month: index };
      }
      return closest;
    }, { distance: Infinity, point: null, month: 0 });

    if (closestPoint.point && closestPoint.distance < 30) {
      setTooltip({
        x: closestPoint.point.x,
        y: closestPoint.point.y,
        value: closestPoint.point.value,
        month: closestPoint.month
      });
    } else {
      setTooltip(null);
    }
  };

  useEffect(() => {
    drawChart();

    const handleResize = () => {
      drawChart();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [results, inputs, showGoal, tooltip]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="space-y-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Investment Growth Over Time</h2>
        {inputs.goalAmount > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-skin-red-text font-medium">Goal: ${inputs.goalAmount.toLocaleString()}</p>
            <button
              onClick={() => setShowGoal(!showGoal)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                showGoal 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Target className="h-4 w-4" />
              {showGoal ? 'Hide Goal' : 'Show Goal'}
            </button>
          </div>
        )}
      </div>
      <div className="relative h-64">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-pointer"
          style={{ width: '100%', height: '100%' }}
          onClick={handleCanvasClick}
        />
      </div>
    </div>
  );
}