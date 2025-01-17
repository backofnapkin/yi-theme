import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { InfoTooltip } from './InfoTooltip';
import { UnitConfigurationInput } from './UnitConfigurationInput';
import { ResultsDisplay } from './ResultsDisplay';
import { EnhancedInput } from './EnhancedInput';
import type { CalculatorInputs, CalculatorResults, UnitConfiguration } from './types';

const defaultUnitConfigurations: UnitConfiguration[] = [
  {
    id: uuidv4(),
    width: 5,
    depth: 5,
    numberOfUnits: 30,
    monthlyRentPerUnit: 65,
  },
  {
    id: uuidv4(),
    width: 5,
    depth: 10,
    numberOfUnits: 30,
    monthlyRentPerUnit: 75,
  },
];

const initialInputs: CalculatorInputs = {
  facilityName: 'Midwest Storage Factory',
  askingPrice: 900000,
  moneyDown: 200000,
  loanAmount: 700000,
  interestRate: 6.5,
  loanTerms: 20,
  squareFootage: 45000,
  vacancyRate: 15,
  monthlyExpenses: 5500,
  unitConfigurations: defaultUnitConfigurations,
};

const calculateMonthlyLoanPayment = (principal: number, annualRate: number, years: number): number => {
  const monthlyRate = annualRate / 1200;
  const numberOfPayments = years * 12;
  
  const payment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  return Number(payment.toFixed(2));
};

const roundToCurrency = (value: number): number => {
  return Number(value.toFixed(2));
};

export const SelfStorageDealCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>(initialInputs);
  const [results, setResults] = useState<CalculatorResults | null>(null);

  const handleInputChange = (field: keyof CalculatorInputs, value: string | number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleUnitConfigUpdate = (id: string, updatedConfig: UnitConfiguration) => {
    setInputs((prev) => ({
      ...prev,
      unitConfigurations: prev.unitConfigurations.map((config) =>
        config.id === id ? updatedConfig : config
      ),
    }));
  };

  const handleAddUnitConfig = () => {
    if (inputs.unitConfigurations.length < 10) {
      setInputs((prev) => ({
        ...prev,
        unitConfigurations: [
          ...prev.unitConfigurations,
          {
            id: uuidv4(),
            width: 5,
            depth: 5,
            numberOfUnits: 30,
            monthlyRentPerUnit: 65,
          },
        ],
      }));
    }
  };

  const handleDeleteUnitConfig = (id: string) => {
    setInputs((prev) => ({
      ...prev,
      unitConfigurations: prev.unitConfigurations.filter((config) => config.id !== id),
    }));
  };

  const calculateResults = () => {
    const monthlyGross = roundToCurrency(inputs.unitConfigurations.reduce(
      (sum, config) => sum + (config.numberOfUnits * config.monthlyRentPerUnit),
      0
    ));

    const effectiveGrossIncome = roundToCurrency(monthlyGross * (1 - (inputs.vacancyRate / 100)));
    const monthlyNOI = roundToCurrency(effectiveGrossIncome - inputs.monthlyExpenses);
    const annualNOI = roundToCurrency(monthlyNOI * 12);
    const capRate = roundToCurrency((annualNOI / inputs.askingPrice) * 100);

    const monthlyLoanPayment = calculateMonthlyLoanPayment(
      inputs.loanAmount,
      inputs.interestRate,
      inputs.loanTerms
    );
    
    const annualLoanPayment = roundToCurrency(monthlyLoanPayment * 12);
    const annualGross = roundToCurrency(monthlyGross * 12);
    const monthlyNetCashFlow = roundToCurrency(monthlyNOI - monthlyLoanPayment);
    const annualNetCashFlow = roundToCurrency(monthlyNetCashFlow * 12);

    const totalUnits = inputs.unitConfigurations.reduce(
      (sum, config) => sum + config.numberOfUnits,
      0
    );

    const unitAnalysis = inputs.unitConfigurations.map((config) => ({
      unitType: `${config.width}' × ${config.depth}'`,
      numberOfUnits: config.numberOfUnits,
      totalSquareFeet: config.width * config.depth * config.numberOfUnits,
      rentPerUnit: config.monthlyRentPerUnit,
      rentPerSquareFoot: roundToCurrency(config.monthlyRentPerUnit / (config.width * config.depth)),
      monthlyRent: roundToCurrency(config.numberOfUnits * config.monthlyRentPerUnit),
    }));

    setResults({
      totalUnits,
      totalSquareFeet: inputs.squareFootage,
      capRate,
      monthlyGross,
      monthlyOverhead: inputs.monthlyExpenses,
      monthlyLoanPayment,
      monthlyNetCashFlow,
      annualGross,
      annualOverhead: inputs.monthlyExpenses * 12,
      annualLoanPayment,
      annualNetCashFlow,
      unitAnalysis,
    });
  };

  const handleReset = () => {
    setInputs(initialInputs);
    setResults(null);
  };

  const handleDownloadCSV = () => {
    if (!results) return;

    const csvContent = [
      ['Storage Facility Evaluation - ' + inputs.facilityName],
      [''],
      ['Property Overview'],
      ['Total Units', results.totalUnits],
      ['Total Sq. Feet', results.totalSquareFeet],
      ['Cap Rate', results.capRate.toFixed(2) + '%'],
      [''],
      ['Monthly Financial Summary'],
      ['Potential Gross', results.monthlyGross.toFixed(2)],
      ['Monthly Overhead', results.monthlyOverhead.toFixed(2)],
      ['Monthly Loan Payment', results.monthlyLoanPayment.toFixed(2)],
      ['Net Cash Flow', results.monthlyNetCashFlow.toFixed(2)],
      [''],
      ['Annual Financial Summary'],
      ['Potential Gross', results.annualGross.toFixed(2)],
      ['Annual Overhead', results.annualOverhead.toFixed(2)],
      ['Annual Loan Payment', results.annualLoanPayment.toFixed(2)],
      ['Net Cash Flow', results.annualNetCashFlow.toFixed(2)],
      [''],
      ['Unit Analysis'],
      ['Unit Type,# of Units,Total Sq.Ft,Rent/Unit,Rent/Sq.Ft,Monthly Rent'],
      ...results.unitAnalysis.map(unit => [
        unit.unitType,
        unit.numberOfUnits,
        unit.totalSquareFeet,
        unit.rentPerUnit.toFixed(2),
        unit.rentPerSquareFoot.toFixed(2),
        unit.monthlyRent.toFixed(2),
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${inputs.facilityName.replace(/\s+/g, '_')}_evaluation.csv`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-skin-base mb-8">
        Self Storage Deal Calculator
      </h1>

      <div className="space-y-8">
        <div className="bg-skin-card p-6 rounded-lg shadow-sm border border-skin-base">
          <h2 className="text-xl font-bold text-skin-base mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-skin-base">
                Facility Name
                <InfoTooltip text="Enter the name of the storage facility" />
              </label>
              <input
                type="text"
                value={inputs.facilityName}
                onChange={(e) => handleInputChange('facilityName', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm 
                         focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 px-3 py-2"
                placeholder="Enter facility name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-skin-base">
                Asking Price
                <InfoTooltip text="Enter the asking price for the facility" />
              </label>
              <EnhancedInput
                value={inputs.askingPrice}
                onChange={(value) => handleInputChange('askingPrice', value)}
                label="Asking Price"
                placeholder="Enter asking price"
                prefix="$"
                min={0}
                max={999999999}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-skin-base">
                Money Down
                <InfoTooltip text="Enter the down payment amount" />
              </label>
              <EnhancedInput
                value={inputs.moneyDown}
                onChange={(value) => handleInputChange('moneyDown', value)}
                label="Money Down"
                placeholder="Enter down payment"
                prefix="$"
                min={0}
                max={999999999}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-skin-base">
                Loan Amount
                <InfoTooltip text="Enter the loan amount" />
              </label>
              <EnhancedInput
                value={inputs.loanAmount}
                onChange={(value) => handleInputChange('loanAmount', value)}
                label="Loan Amount"
                placeholder="Enter loan amount"
                prefix="$"
                min={0}
                max={999999999}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-skin-base">
                Interest Rate (%)
                <InfoTooltip text="Select the interest rate percentage" />
              </label>
              <input
                type="range"
                min="1"
                max="30"
                step="0.1"
                value={inputs.interestRate}
                onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                className="mt-1 block w-full appearance-none bg-emerald-100 h-2 rounded-lg cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-emerald-50 [&::-webkit-slider-thumb]:to-emerald-100 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-emerald-200 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm hover:[&::-webkit-slider-thumb]:from-emerald-100 hover:[&::-webkit-slider-thumb]:to-emerald-200"
              />
              <span className="text-sm text-skin-base">{inputs.interestRate}%</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-skin-base">
                Loan Terms (Years)
                <InfoTooltip text="Select the loan term in years" />
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={inputs.loanTerms}
                onChange={(e) => handleInputChange('loanTerms', Number(e.target.value))}
                className="mt-1 block w-full appearance-none bg-emerald-100 h-2 rounded-lg cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-emerald-50 [&::-webkit-slider-thumb]:to-emerald-100 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-emerald-200 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm hover:[&::-webkit-slider-thumb]:from-emerald-100 hover:[&::-webkit-slider-thumb]:to-emerald-200"
              />
              <span className="text-sm text-skin-base">{inputs.loanTerms} years</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-skin-base">
                Square Footage
                <InfoTooltip text="Enter the total square footage of the facility" />
              </label>
              <EnhancedInput
                value={inputs.squareFootage}
                onChange={(value) => handleInputChange('squareFootage', value)}
                label="Square Footage"
                placeholder="Enter square footage"
                suffix=" sq ft"
                min={0}
                max={999999999}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-skin-base">
                Vacancy Rate (%)
                <InfoTooltip text="Enter the expected vacancy rate percentage" />
              </label>
              <EnhancedInput
                value={inputs.vacancyRate}
                onChange={(value) => handleInputChange('vacancyRate', value)}
                label="Vacancy Rate"
                placeholder="Enter vacancy rate"
                suffix="%"
                min={0}
                max={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-skin-base">
                Monthly Expenses
                <InfoTooltip text="Enter the total monthly expenses" />
              </label>
              <EnhancedInput
                value={inputs.monthlyExpenses}
                onChange={(value) => handleInputChange('monthlyExpenses', value)}
                label="Monthly Expenses"
                placeholder="Enter monthly expenses"
                prefix="$"
                min={0}
                max={999999999}
              />
            </div>
          </div>
        </div>

        <div className="bg-skin-card p-6 rounded-lg shadow-sm border border-skin-base">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-skin-base">Unit Configurations</h2>
            <button
              onClick={handleAddUnitConfig}
              disabled={inputs.unitConfigurations.length >= 10}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100 text-skin-base rounded-lg hover:from-emerald-100 hover:to-emerald-200 transition-colors disabled:opacity-50"
            >
              <PlusCircle className="h-5 w-5" />
              Add Configuration
            </button>
          </div>

          {inputs.unitConfigurations.map((config) => (
            <UnitConfigurationInput
              key={config.id}
              config={config}
              onUpdate={(updatedConfig) => handleUnitConfigUpdate(config.id, updatedConfig)}
              onDelete={() => handleDeleteUnitConfig(config.id)}
            />
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={calculateResults}
            className="px-6 py-3 bg-gradient-to-r from-emerald-50 to-emerald-100 text-skin-base rounded-lg hover:from-emerald-100 hover:to-emerald-200 transition-colors"
          >
            Calculate Self-Storage Deal
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gradient-to-r from-amber-50 to-amber-100 text-skin-base rounded-lg hover:from-amber-100 hover:to-amber-200 transition-colors"
          >
            Reset
          </button>
        </div>

        {results && (
          <ResultsDisplay
            results={results}
            facilityName={inputs.facilityName}
            onDownloadCSV={handleDownloadCSV}
          />
        )}
      </div>
    </div>
  );
};