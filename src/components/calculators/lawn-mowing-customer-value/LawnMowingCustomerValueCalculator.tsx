import React, { useState } from 'react';
import { Calculator, RotateCcw, DollarSign } from 'lucide-react';
import { InputField } from './InputField';
import { ResultPanel } from './ResultPanel';

const defaultValues = {
  mowPrice: 75,
  grossMargin: 50,
  mowsPerYear: 25,
  retentionMonths: 36,
  acquisitionCostPercent: 25,
  goalCustomers: 50,
};

export const LawnMowingCustomerValueCalculator: React.FC = () => {
  const [values, setValues] = useState(defaultValues);
  const [results, setResults] = useState(calculateResults(values));

  function formatNumber(value: number, decimals: number = 2): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  function calculateResults(inputValues: typeof defaultValues) {
    const yearsRetention = inputValues.retentionMonths / 12;
    const annualGrossRevenue = inputValues.mowPrice * inputValues.mowsPerYear;
    const annualNetRevenue = annualGrossRevenue * (inputValues.grossMargin / 100);
    
    const lifetimeGross = annualGrossRevenue * yearsRetention;
    const lifetimeNet = annualNetRevenue * yearsRetention;
    
    const totalAnnualGross = annualGrossRevenue * inputValues.goalCustomers;
    const totalAnnualNet = annualNetRevenue * inputValues.goalCustomers;
    
    const targetLtvCac = lifetimeNet * (inputValues.acquisitionCostPercent / 100);
    const targetYearlyCac = annualNetRevenue * (inputValues.acquisitionCostPercent / 100);

    return {
      lifetimeGross: formatNumber(lifetimeGross),
      lifetimeNet: formatNumber(lifetimeNet),
      yearlyGross: formatNumber(annualGrossRevenue),
      yearlyNet: formatNumber(annualNetRevenue),
      totalAnnualGross: formatNumber(totalAnnualGross, 0),
      totalAnnualNet: formatNumber(totalAnnualNet, 0),
      targetLtvCac: formatNumber(targetLtvCac),
      targetYearlyCac: formatNumber(targetYearlyCac),
    };
  }

  const handleCalculate = () => {
    setResults(calculateResults(values));
  };

  const resetCalculator = () => {
    setValues(defaultValues);
    setResults(calculateResults(defaultValues));
  };

  return (
    <div className="max-w-4xl mx-auto p-4" style={{ backgroundColor: 'rgb(241, 241, 241)' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center" style={{ color: 'rgb(80, 73, 69)' }}>
          <Calculator className="mr-2" />
          Lawn Mowing Customer Value Calculator
        </h1>
        <p className="mt-2" style={{ color: 'rgba(80, 73, 69, 0.8)' }}>
          Calculate the lifetime value and acquisition costs for your lawn mowing customers
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'rgb(251, 251, 251)', border: '1px solid rgb(104, 157, 106)' }}>
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <InputField
                  label="Average Mow Price"
                  value={values.mowPrice}
                  onChange={(value) => setValues({ ...values, mowPrice: value })}
                  info="The average price charged per mow"
                  prefix="$"
                />
              </div>
              <div className="w-full">
                <InputField
                  label="Gross Margin on Mow"
                  value={values.grossMargin}
                  onChange={(value) => setValues({ ...values, grossMargin: value })}
                  info="The percentage of revenue that remains after direct costs"
                  suffix="%"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <InputField
                  label="Average Mows per Year"
                  value={values.mowsPerYear}
                  onChange={(value) => setValues({ ...values, mowsPerYear: value })}
                  info="The typical number of mows performed per customer annually"
                  type="slider"
                  min={10}
                  max={52}
                />
              </div>
              <div className="w-full">
                <InputField
                  label="Average Retention (Months)"
                  value={values.retentionMonths}
                  onChange={(value) => setValues({ ...values, retentionMonths: value })}
                  info="How long customers typically stay with your service"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <InputField
                  label="Desired Customer Acquisition Cost %"
                  value={values.acquisitionCostPercent}
                  onChange={(value) => setValues({ ...values, acquisitionCostPercent: value })}
                  info="Target percentage of gross profit to spend on acquiring new customers"
                  suffix="%"
                />
              </div>
              <div className="w-full">
                <InputField
                  label="Goal Number of Mowing Customers"
                  value={values.goalCustomers}
                  onChange={(value) => setValues({ ...values, goalCustomers: value })}
                  info="Your target number of regular mowing customers"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleCalculate}
                className="px-6 py-3 text-white rounded-md flex-grow flex items-center justify-center font-medium hover:opacity-90"
                style={{ backgroundColor: 'rgb(14, 192, 124)' }}
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Value of Mowing Customers
              </button>
              <button
                onClick={resetCalculator}
                className="px-4 py-2 rounded-md flex items-center hover:opacity-90"
                style={{ backgroundColor: 'rgb(241, 241, 241)', color: 'rgb(80, 73, 69)', border: '1px solid rgb(104, 157, 106)' }}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'rgb(251, 251, 251)', border: '1px solid rgb(104, 157, 106)' }}>
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-8 h-8" style={{ color: 'rgb(181, 118, 20)' }} />
            <h2 className="text-2xl font-bold" style={{ color: 'rgb(80, 73, 69)' }}>Results</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResultPanel
              type="lifetime"
              title="Lifetime Value (Gross)"
              value={`$${results.lifetimeGross}`}
              info="Total revenue expected from a customer over their lifetime"
            />
            <ResultPanel
              type="lifetime"
              title="Lifetime Value (Net)"
              value={`$${results.lifetimeNet}`}
              info="Total profit expected from a customer over their lifetime"
            />
            <ResultPanel
              type="yearly"
              title="Customer Value per Year (Gross)"
              value={`$${results.yearlyGross}`}
              info="Annual revenue per customer"
            />
            <ResultPanel
              type="yearly"
              title="Customer Value per Year (Net)"
              value={`$${results.yearlyNet}`}
              info="Annual profit per customer"
            />
            <ResultPanel
              type="total"
              title="Annual Mowing Revenue (Gross)"
              value={`$${results.totalAnnualGross}`}
              info="Total annual revenue based on goal customers"
            />
            <ResultPanel
              type="total"
              title="Annual Mowing Revenue (Net)"
              value={`$${results.totalAnnualNet}`}
              info="Total annual profit based on goal customers"
            />
            <ResultPanel
              type="target"
              title="Target LTV Customer Acquisition Cost"
              value={`$${results.targetLtvCac}`}
              info="Maximum recommended spending to acquire a customer based on lifetime value"
            />
            <ResultPanel
              type="target"
              title="Target Yearly Customer Acquisition Cost"
              value={`$${results.targetYearlyCac}`}
              info="Maximum recommended spending to acquire a customer based on yearly value"
            />
          </div>
        </div>
      </div>
    </div>
  );
};