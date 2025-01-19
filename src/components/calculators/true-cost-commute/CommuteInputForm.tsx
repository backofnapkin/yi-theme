import React from 'react';
import { Calculator, RotateCcw, Car } from 'lucide-react';
import type { CommuteData } from './types';
import NumberInput from './components/NumberInput';
import InfoButton from './components/InfoButton';

interface CommuteInputFormProps {
  data: CommuteData;
  onDataChange: (data: CommuteData) => void;
  onCalculate: () => void;
  onReset: () => void;
}

const CommuteInputForm: React.FC<CommuteInputFormProps> = ({
  data,
  onDataChange,
  onCalculate,
  onReset,
}) => {
  return (
    <div className="border rounded-lg">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Car className="w-5 h-5 text-emerald-600" />
          Commute Details
        </h2>
        
        <div className="space-y-4">
          <NumberInput
            label={
              <div className="flex items-center gap-1">
                Round Trip Distance (miles)
                <InfoButton content="Enter the total distance of your daily round-trip commute." />
              </div>
            }
            value={data.distance}
            onChange={(value) => onDataChange({ ...data, distance: value })}
            placeholder="30"
          />

          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              label={
                <div className="flex items-center gap-1">
                  Time (Minutes)
                  <InfoButton content="Enter the number of minutes or hours your one-way commute typically takes." />
                </div>
              }
              value={data.timeMinutes}
              onChange={(value) => onDataChange({ ...data, timeMinutes: value })}
              placeholder="53"
            />
            <NumberInput
              label={
                <div className="flex items-center gap-1">
                  Seconds
                  <InfoButton content="Add any additional seconds for precise calculations." />
                </div>
              }
              value={data.timeSeconds}
              onChange={(value) => onDataChange({ ...data, timeSeconds: value })}
              placeholder="36"
              min={0}
              max={59}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              label={
                <div className="flex items-center gap-1">
                  Cost per Mile ($)
                  <InfoButton content="The total cost per mile including maintenance, depreciation, and other vehicle expenses. The IRS standard rate is a good estimate." />
                </div>
              }
              value={data.costPerMile}
              onChange={(value) => onDataChange({ ...data, costPerMile: value })}
              placeholder="0.58"
              step={0.01}
            />
            <NumberInput
              label={
                <div className="flex items-center gap-1">
                  Hourly Wage ($)
                  <InfoButton content="Your hourly wage rate. If salaried, divide your annual salary by 2080 (40 hours/week × 52 weeks)." />
                </div>
              }
              value={data.hourlyWage}
              onChange={(value) => onDataChange({ ...data, hourlyWage: value })}
              placeholder="29.81"
              step={0.01}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              label={
                <div className="flex items-center gap-1">
                  Workdays per Week
                  <InfoButton content="Number of days you commute to work in a typical week." />
                </div>
              }
              value={data.workdaysPerWeek}
              onChange={(value) => onDataChange({ ...data, workdaysPerWeek: value })}
              placeholder="5"
              min={1}
              max={7}
            />
            <NumberInput
              label={
                <div className="flex items-center gap-1">
                  Gas Price per Gallon ($)
                  <InfoButton content="Current average gas price per gallon in your area." />
                </div>
              }
              value={data.gasPrice}
              onChange={(value) => onDataChange({ ...data, gasPrice: value })}
              placeholder="3.25"
              step={0.01}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              label={
                <div className="flex items-center gap-1">
                  Monthly Car Payment ($)
                  <InfoButton content="Your total monthly car payment including principal and interest. Enter 0 if your car is paid off." />
                </div>
              }
              value={data.carPayment}
              onChange={(value) => onDataChange({ ...data, carPayment: value })}
              placeholder="737"
              step={0.01}
            />
            <NumberInput
              label={
                <div className="flex items-center gap-1">
                  Miles per Gallon
                  <InfoButton content="Your vehicle's average fuel efficiency. Use combined city/highway MPG for most accurate results." />
                </div>
              }
              value={data.milesPerGallon}
              onChange={(value) => onDataChange({ ...data, milesPerGallon: value })}
              placeholder="25.4"
              step={0.1}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={onCalculate}
            className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50 border border-emerald-100 
                       text-emerald-700 px-4 py-2 rounded-xl shadow-sm hover:shadow-md 
                       transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calculate
          </button>
          <button
            onClick={onReset}
            className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl 
                       shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 
                       flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommuteInputForm;