import React from 'react';

interface SpaceUtilizationDashboardProps {
  usedSpace: number;
  remainingSpace: number;
  utilizationPercentage: number;
}

export const SpaceUtilizationDashboard: React.FC<SpaceUtilizationDashboardProps> = ({
  usedSpace,
  remainingSpace,
  utilizationPercentage
}) => {
  return (
    <div className="bg-[rgb(251,251,251)] p-6 rounded-lg border border-[rgb(104,157,106)] shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-[rgb(80,73,69)]">Space Utilization Dashboard</h3>
      
      <div className="mb-4">
        <div className="w-full bg-[rgb(241,241,241)] rounded-full h-4">
          <div
            className="bg-[rgb(14,192,124)] h-4 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-[rgb(241,241,241)] rounded-lg">
          <p className="text-sm text-[rgb(80,73,69)]">Used Space</p>
          <p className="text-lg font-semibold text-[rgb(181,118,20)]">{usedSpace.toFixed(0)} sq ft</p>
        </div>
        <div className="p-3 bg-[rgb(241,241,241)] rounded-lg">
          <p className="text-sm text-[rgb(80,73,69)]">Available Space</p>
          <p className="text-lg font-semibold text-[rgb(181,118,20)]">{remainingSpace.toFixed(0)} sq ft</p>
        </div>
        <div className="p-3 bg-[rgb(241,241,241)] rounded-lg">
          <p className="text-sm text-[rgb(80,73,69)]">Utilization</p>
          <p className="text-lg font-semibold text-[rgb(181,118,20)]">{utilizationPercentage.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};