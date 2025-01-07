import React from 'react';
import { Plus } from 'lucide-react';
import { CustomExpenseInput } from './CustomExpenseInput';
import { InfoButton } from './InfoButton';
import type { CalculatorInputs } from './types';

interface InputSectionProps {
  inputs: CalculatorInputs;
  setInputs: React.Dispatch<React.SetStateAction<CalculatorInputs>>;
}

export function InputSection({ inputs, setInputs }: InputSectionProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Business Details Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Business Details</h2>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700">
            Business Name
            <InfoButton text="Enter your business name" />
          </label>
          <input
            type="text"
            name="businessName"
            value={inputs.businessName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700">
            Leasehold Improvements ($)
            <InfoButton text="Initial renovation and build-out costs" />
          </label>
          <input
            type="number"
            name="leaseholdImprovements"
            value={inputs.leaseholdImprovements}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700">
            Permits and Licenses ($)
            <InfoButton text="Cost of required permits and licenses" />
          </label>
          <input
            type="number"
            name="permitsAndLicenses"
            value={inputs.permitsAndLicenses}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700">
            Initial Marketing ($)
            <InfoButton text="Initial marketing and advertising costs" />
          </label>
          <input
            type="number"
            name="initialMarketing"
            value={inputs.initialMarketing}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Equipment Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Equipment</h2>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700">
            Lane Setup Cost per Lane ($)
            <InfoButton text="Cost to set up each throwing lane" />
          </label>
          <input
            type="number"
            name="laneSetupCost"
            value={inputs.laneSetupCost}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700">
            Number of Lanes
            <InfoButton text="Total number of throwing lanes" />
          </label>
          <input
            type="range"
            name="numberOfLanes"
            min="1"
            max="25"
            value={inputs.numberOfLanes}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
          <div className="text-sm text-gray-600 text-center">
            {inputs.numberOfLanes} lanes
          </div>
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700">
            Number of Axes
            <InfoButton text="Total number of axes needed" />
          </label>
          <input
            type="number"
            name="numberOfAxes"
            value={inputs.numberOfAxes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700">
            Cost per Axe ($)
            <InfoButton text="Cost of each individual axe" />
          </label>
          <input
            type="number"
            name="costPerAxe"
            value={inputs.costPerAxe}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Revenue Details Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Revenue Details</h2>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700">
            Walk-in Session Price per Hour ($)
            <InfoButton text="Price charged per hour for walk-in customers" />
          </label>
          <input
            type="number"
            name="walkInPrice"
            value={inputs.walkInPrice}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700">
            Average Group Size
            <InfoButton text="Average number of people per group" />
          </label>
          <input
            type="range"
            name="averageGroupSize"
            min="1"
            max="8"
            value={inputs.averageGroupSize}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
          <div className="text-sm text-gray-600 text-center">
            {inputs.averageGroupSize} people
          </div>
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700">
            Corporate Event Price ($)
            <InfoButton text="Price per corporate event" />
          </label>
          <input
            type="number"
            name="corporateEventPrice"
            value={inputs.corporateEventPrice}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700">
            Monthly Corporate Events
            <InfoButton text="Expected number of corporate events per month" />
          </label>
          <input
            type="number"
            name="monthlyCorpEvents"
            value={inputs.monthlyCorpEvents}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Operating Hours Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Operating Hours</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              Peak Hours per Week
              <InfoButton text="Estimate busy time for your business. Typically, Friday - Sunday." />
            </label>
            <input
              type="number"
              name="peakHours"
              value={inputs.peakHours}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              Peak Utilization (%)
              <InfoButton text="Expected lane utilization during peak hours" />
            </label>
            <input
              type="number"
              name="peakUtilization"
              value={inputs.peakUtilization}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              Off-Peak Hours per Week
              <InfoButton text="Estimate slower time periods for your business. Typically, Monday - Thursday." />
            </label>
            <input
              type="number"
              name="offPeakHours"
              value={inputs.offPeakHours}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              Off-Peak Utilization (%)
              <InfoButton text="Expected lane utilization during off-peak hours" />
            </label>
            <input
              type="number"
              name="offPeakUtilization"
              value={inputs.offPeakUtilization}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Monthly Costs Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Monthly Costs</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              Monthly Rent ($)
              <InfoButton text="Monthly rental cost for the facility" />
            </label>
            <input
              type="number"
              name="monthlyRent"
              value={inputs.monthlyRent}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              Monthly Insurance ($)
              <InfoButton text="Monthly insurance costs" />
            </label>
            <input
              type="number"
              name="monthlyInsurance"
              value={inputs.monthlyInsurance}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              Monthly Utilities ($)
              <InfoButton text="Monthly utility costs including electricity, water, etc." />
            </label>
            <input
              type="number"
              name="monthlyUtilities"
              value={inputs.monthlyUtilities}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              Monthly Wages ($)
              <InfoButton text="Total monthly wages for all employees" />
            </label>
            <input
              type="number"
              name="monthlyWages"
              value={inputs.monthlyWages}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              Monthly Marketing ($)
              <InfoButton text="Monthly marketing and advertising budget" />
            </label>
            <input
              type="number"
              name="monthlyMarketing"
              value={inputs.monthlyMarketing}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              Maintenance Cost per Lane ($)
              <InfoButton text="Monthly maintenance cost per lane" />
            </label>
            <input
              type="number"
              name="maintenanceCostPerLane"
              value={inputs.maintenanceCostPerLane}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Additional Monthly Expenses</h3>
            <button
              onClick={() => {
                setInputs(prev => ({
                  ...prev,
                  customExpenses: [
                    ...prev.customExpenses,
                    { id: crypto.randomUUID(), name: '', amount: 0 }
                  ]
                }));
              }}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </button>
          </div>
          
          <div className="space-y-3">
            {inputs.customExpenses.map(expense => (
              <CustomExpenseInput
                key={expense.id}
                expense={expense}
                onUpdate={(id, field, value) => {
                  setInputs(prev => ({
                    ...prev,
                    customExpenses: prev.customExpenses.map(exp =>
                      exp.id === id ? { ...exp, [field]: value } : exp
                    )
                  }));
                }}
                onDelete={(id) => {
                  setInputs(prev => ({
                    ...prev,
                    customExpenses: prev.customExpenses.filter(exp => exp.id !== id)
                  }));
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}