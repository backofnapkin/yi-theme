import React from 'react';
import { Info } from 'lucide-react';
import type { DailySalesType } from './FoodTruckBusinessCalculator';
import { DecimalInput } from '../../ui/DecimalInput';
import { Tooltip } from '../../ui/Tooltip';

interface DailySalesProps {
  dailySales: DailySalesType;
  setDailySales: (sales: DailySalesType) => void;
}

const DailySales: React.FC<DailySalesProps> = ({ dailySales, setDailySales }) => {
  const handleChange = (day: keyof DailySalesType, value: number) => {
    const numValue = Math.min(Math.max(0, Math.floor(value)), 999);
    setDailySales({
      ...dailySales,
      [day]: numValue
    });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Average Number of Sales per Day</h3>
        <Tooltip content="Enter the expected number of sales transactions for each day of the week">
          <Info className="w-4 h-4 text-gray-400" />
        </Tooltip>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(dailySales).map(([day, value]) => (
          <DecimalInput
            key={day}
            label={
              <div className="flex items-center gap-2 capitalize">
                {day}
                <Tooltip content={`Expected number of sales for ${day}`}>
                  <Info className="w-4 h-4 text-gray-400" />
                </Tooltip>
              </div>
            }
            value={value}
            onChange={(val) => handleChange(day as keyof DailySalesType, val)}
            min={0}
            max={999}
            step={1}
          />
        ))}
      </div>
    </div>
  );
};

export default DailySales;