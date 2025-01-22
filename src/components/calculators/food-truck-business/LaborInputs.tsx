import React from 'react';
import { Users, Clock, Info } from 'lucide-react';
import type { CalculatorInputs } from './FoodTruckBusinessCalculator';
import { DecimalInput } from '../../ui/DecimalInput';
import { Tooltip } from '../../ui/Tooltip';

interface LaborInputsProps {
  inputs: CalculatorInputs;
  setInputs: (inputs: CalculatorInputs) => void;
}

const LaborInputs: React.FC<LaborInputsProps> = ({ inputs, setInputs }) => {
  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        <Users className="inline-block w-5 h-5 mr-2" />
        Labor Costs
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <DecimalInput
            label={
              <div className="flex items-center gap-2">
                Hourly Wage
                <Tooltip content="The hourly rate you pay each employee">
                  <Info className="w-4 h-4 text-gray-400" />
                </Tooltip>
              </div>
            }
            value={inputs.hourlyWage}
            onChange={(value) => setInputs({...inputs, hourlyWage: value})}
            min={0}
            step={0.5}
            prefix="$"
          />
        </div>

        <div>
          <DecimalInput
            label={
              <div className="flex items-center gap-2">
                Number of Employees
                <Tooltip content="Total number of employees working in your food truck">
                  <Info className="w-4 h-4 text-gray-400" />
                </Tooltip>
              </div>
            }
            value={inputs.numberOfEmployees}
            onChange={(value) => setInputs({...inputs, numberOfEmployees: Math.max(1, Math.floor(value))})}
            min={1}
            step={1}
          />
        </div>

        <div>
          <DecimalInput
            label={
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Daily Operating Hours
                <Tooltip content="Number of hours your food truck operates each day">
                  <Info className="w-4 h-4 text-gray-400" />
                </Tooltip>
              </div>
            }
            value={inputs.dailyOperatingHours}
            onChange={(value) => setInputs({...inputs, dailyOperatingHours: Math.min(24, Math.max(1, Math.floor(value)))})}
            min={1}
            max={24}
            step={1}
          />
        </div>

        <div>
          <DecimalInput
            label={
              <div className="flex items-center gap-2">
                Work Days Per Week
                <Tooltip content="Number of days per week your food truck operates">
                  <Info className="w-4 h-4 text-gray-400" />
                </Tooltip>
              </div>
            }
            value={inputs.workDaysPerWeek}
            onChange={(value) => setInputs({...inputs, workDaysPerWeek: Math.min(7, Math.max(1, Math.floor(value)))})}
            min={1}
            max={7}
            step={1}
          />
        </div>
      </div>
    </div>
  );
};

export default LaborInputs;