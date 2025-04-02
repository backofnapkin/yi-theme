import React from 'react';

const ProgressIndicator = ({ currentValue, maxValue, label, suffix = '%', colorClass = 'bg-green-500' }) => {
  // Calculate percentage for the progress bar
  const percentage = Math.min(100, Math.max(0, (currentValue / maxValue) * 100));
  
  return (
    <div className="progress-indicator w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-medium">{currentValue}{suffix}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${colorClass}`} 
          style={{ width: `${percentage}%` }}
          aria-valuenow={currentValue}
          aria-valuemin="0"
          aria-valuemax={maxValue}
          role="progressbar"
        ></div>
      </div>
    </div>
  );
};

export default ProgressIndicator;