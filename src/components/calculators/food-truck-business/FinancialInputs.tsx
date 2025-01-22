import React from 'react';
import { DollarSign, Percent, Building2, Fuel, FileText, Calendar, Info } from 'lucide-react';
import type { CalculatorInputs } from './FoodTruckBusinessCalculator';
import { DecimalInput } from '../../ui/DecimalInput';
import { BorderContainer } from '../../ui/BorderContainer';
import { Tooltip } from '../../ui/Tooltip';

interface FinancialInputsProps {
  inputs: CalculatorInputs;
  setInputs: (inputs: CalculatorInputs) => void;
}

const FinancialInputs: React.FC<FinancialInputsProps> = ({ inputs, setInputs }) => {
  return (
    <BorderContainer title="Financial Inputs" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <DecimalInput
            label={
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Average Spend per Customer
                <Tooltip content="The average amount each customer spends per visit">
                  <Info className="w-4 h-4 text-gray-400" />
                </Tooltip>
              </div>
            }
            value={inputs.averageSpend}
            onChange={(value) => setInputs({...inputs, averageSpend: value})}
            min={0}
            step={0.5}
            prefix="$"
          />
        </div>

        <div>
          <DecimalInput
            label={
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Monthly Catering Revenue
                <Tooltip content="Additional revenue from catering events and special occasions">
                  <Info className="w-4 h-4 text-gray-400" />
                </Tooltip>
              </div>
            }
            value={inputs.monthlyEventRevenue}
            onChange={(value) => setInputs({...inputs, monthlyEventRevenue: value})}
            min={0}
            step={100}
            prefix="$"
          />
        </div>

        <div>
          <DecimalInput
            label={
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Cost of Goods Sold (COGS)
                <Tooltip content="Cost of Goods Sold as a percentage of revenue. Industry standard is 30-35%">
                  <Info className="w-4 h-4 text-gray-400" />
                </Tooltip>
              </div>
            }
            value={inputs.cogsPercentage}
            onChange={(value) => setInputs({...inputs, cogsPercentage: value})}
            min={0}
            max={100}
            step={0.5}
            suffix="%"
          />
          <p className="mt-1 text-sm text-gray-500">
            Best practice: 30-35% per item
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <DecimalInput
            label={
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Monthly Commissary Rent
                <Tooltip content="Monthly rent for kitchen and storage space">
                  <Info className="w-4 h-4 text-gray-400" />
                </Tooltip>
              </div>
            }
            value={inputs.monthlyCommissaryRent}
            onChange={(value) => setInputs({...inputs, monthlyCommissaryRent: value})}
            min={0}
            step={50}
            prefix="$"
          />
        </div>

        <div>
          <DecimalInput
            label={
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4" />
                Monthly Fuel Costs
                <Tooltip content="Monthly expenses for fuel and transportation">
                  <Info className="w-4 h-4 text-gray-400" />
                </Tooltip>
              </div>
            }
            value={inputs.monthlyFuelCosts}
            onChange={(value) => setInputs({...inputs, monthlyFuelCosts: value})}
            min={0}
            step={50}
            prefix="$"
          />
        </div>

        <div>
          <DecimalInput
            label={
              <div className="flex items-center gap-2">
                Monthly Vehicle Insurance
                <Tooltip content="Monthly insurance costs for your food truck">
                  <Info className="w-4 h-4 text-gray-400" />
                </Tooltip>
              </div>
            }
            value={inputs.monthlyInsurance}
            onChange={(value) => setInputs({...inputs, monthlyInsurance: value})}
            min={0}
            step={10}
            prefix="$"
          />
        </div>

        <div>
          <DecimalInput
            label={
              <div className="flex items-center gap-2">
                Monthly Loan Payments
                <Tooltip content="Monthly payments for any business loans">
                  <Info className="w-4 h-4 text-gray-400" />
                </Tooltip>
              </div>
            }
            value={inputs.monthlyLoanPayments}
            onChange={(value) => setInputs({...inputs, monthlyLoanPayments: value})}
            min={0}
            step={50}
            prefix="$"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4" />
          Vending Permits / Licenses
          <Tooltip content="Required permits and licenses for food truck operation">
            <Info className="w-4 h-4 text-gray-400" />
          </Tooltip>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {inputs.vendingPermits.map((permit, index) => (
            <DecimalInput
              key={index}
              label={`Permit ${index + 1}`}
              value={permit}
              onChange={(value) => {
                const newPermits = [...inputs.vendingPermits];
                newPermits[index] = value;
                setInputs({...inputs, vendingPermits: newPermits});
              }}
              min={0}
              step={10}
              prefix="$"
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4" />
          <label className="text-sm font-medium text-gray-700">
            Seasonality Factor (months per year)
          </label>
          <Tooltip content="Number of months your food truck operates per year">
            <Info className="w-4 h-4 text-gray-400" />
          </Tooltip>
        </div>
        <select
          value={inputs.seasonalityFactor}
          onChange={(e) => setInputs({...inputs, seasonalityFactor: parseInt(e.target.value)})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1} months</option>
          ))}
        </select>
      </div>
    </BorderContainer>
  );
};

export default FinancialInputs;