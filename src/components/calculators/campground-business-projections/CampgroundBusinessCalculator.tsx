import React, { useState } from 'react';
import { Calculator, DollarSign, Home, Settings } from 'lucide-react';
import { InputField } from './InputField';
import { ResultsDisplay } from './ResultsSection';
import type { CampgroundData, CalculationResults } from './types';
import { calculateLoanPayment, calculateFutureValue } from './utils';
import { InputButton } from '../../ui/InputButton';
import { ResetButton } from '../../ui/ResetButton';
import { BorderContainer } from '../../ui/BorderContainer';

const defaultData: CampgroundData = {
  campgroundName: 'Sunrise Campground',
  initialPurchasePrice: 1000000,
  downPaymentPercentage: 10,
  interestRate: 7,
  loanTerm: 20,
  annualAppreciation: 3,
  numberOfSites: 80,
  monthlyRentPerSite: 350,
  additionalServicesRevenue: 100,
  occupancyRate: 70,
  openMonthsPerYear: 9,
  monthlyManagementFee: 10000,
  monthlyMaintenanceCosts: 1000,
  monthlyOperatingCosts: 1000,
};

export const CampgroundBusinessCalculator: React.FC = () => {
  const [data, setData] = useState<CampgroundData>(defaultData);
  const [results, setResults] = useState<CalculationResults | null>(null);

  const handleInputChange = (field: keyof CampgroundData, value: number | string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateResults = () => {
    // Calculate loan-related values
    const loanAmount = data.initialPurchasePrice * (1 - data.downPaymentPercentage / 100);
    const monthlyLoanPayment = calculateLoanPayment(loanAmount, data.interestRate, data.loanTerm);
    const annualLoanPayments = monthlyLoanPayment * 12;

    // Calculate revenue
    const monthlyGrossRevenue =
      (data.monthlyRentPerSite + data.additionalServicesRevenue) *
      data.numberOfSites *
      (data.occupancyRate / 100);
    const annualGrossRevenue = monthlyGrossRevenue * data.openMonthsPerYear;

    // Calculate operating expenses (excluding loan payment)
    const monthlyOperatingExpenses =
      data.monthlyManagementFee + data.monthlyMaintenanceCosts + data.monthlyOperatingCosts;
    const annualOperatingExpenses = monthlyOperatingExpenses * data.openMonthsPerYear;

    // Calculate total expenses (including loan payments)
    const monthlyTotalExpenses = monthlyOperatingExpenses + monthlyLoanPayment;
    const annualTotalExpenses = annualOperatingExpenses + annualLoanPayments;

    // Calculate NOI (before debt service)
    const annualNOI = annualGrossRevenue - annualOperatingExpenses;

    // Calculate investment metrics
    const totalInitialInvestment = data.initialPurchasePrice * (data.downPaymentPercentage / 100);
    const cashOnCashReturn = ((annualNOI - annualLoanPayments) / totalInitialInvestment) * 100;

    // Calculate break-even occupancy
    const breakEvenOccupancy =
      ((monthlyOperatingExpenses + monthlyLoanPayment) /
        ((data.monthlyRentPerSite + data.additionalServicesRevenue) * data.numberOfSites)) *
      100;

    setResults({
      totalInitialInvestment,
      monthlyLoanPayment,
      breakEvenOccupancy,
      monthlyGrossRevenue,
      annualGrossRevenue,
      monthlyTotalExpenses,
      annualTotalExpenses,
      annualNOI,
      cashOnCashReturn,
      propertyValueYear1: calculateFutureValue(data.initialPurchasePrice, data.annualAppreciation, 1),
      propertyValueYear5: calculateFutureValue(data.initialPurchasePrice, data.annualAppreciation, 5),
      propertyValueYear10: calculateFutureValue(data.initialPurchasePrice, data.annualAppreciation, 10),
      numberOfSites: data.numberOfSites,
    });
  };

  const handleReset = () => {
    setData(defaultData);
    setResults(null);
  };

  const handleDownloadCSV = () => {
    if (!results) return;

    const csvContent = [
      ['Campground Financial Analysis Report'],
      [''],
      ['Property Information'],
      ['Campground Name', data.campgroundName],
      ['Initial Purchase Price', data.initialPurchasePrice],
      ['Down Payment Percentage', `${data.downPaymentPercentage}%`],
      [''],
      ['Financial Results'],
      ['Total Initial Investment', results.totalInitialInvestment],
      ['Monthly Loan Payment', results.monthlyLoanPayment],
      ['Annual NOI', results.annualNOI],
      ['Cash-on-Cash Return', `${results.cashOnCashReturn}%`],
      ['Break-Even Occupancy', `${results.breakEvenOccupancy}%`],
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${data.campgroundName.replace(/\s+/g, '_')}_financial_analysis.csv`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
        <Calculator className="w-6 h-6 mr-2" />
        Campground Revenue Business Projection Calculator
      </h2>

      <div className="space-y-6 max-w-5xl mx-auto">
        <BorderContainer title="Basic Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InputField
              label="Campground Name"
              name="campgroundName"
              value={data.campgroundName}
              onChange={(value) => handleInputChange('campgroundName', value)}
              type="text"
              tooltip="Enter your campground's name"
            />
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Loan Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <InputField
              label="Initial Purchase Price"
              name="initialPurchasePrice"
              value={data.initialPurchasePrice}
              onChange={(value) => handleInputChange('initialPurchasePrice', value)}
              prefix="$"
              tooltip="Enter the total purchase price of the property"
            />

            <InputField
              label="Down Payment %"
              name="downPaymentPercentage"
              value={data.downPaymentPercentage}
              onChange={(value) => handleInputChange('downPaymentPercentage', value)}
              suffix="%"
              min={0}
              max={100}
              tooltip="Enter the percentage of the purchase price you plan to pay upfront"
            />

            <InputField
              label="Loan Interest Rate"
              name="interestRate"
              value={data.interestRate}
              onChange={(value) => handleInputChange('interestRate', value)}
              suffix="%"
              min={0}
              max={20}
              step={0.1}
              tooltip="Enter the annual interest rate for your loan"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Loan Term"
              name="loanTerm"
              value={data.loanTerm}
              onChange={(value) => handleInputChange('loanTerm', value)}
              type="range"
              min={1}
              max={30}
              suffix="years"
              tooltip="Select the length of your loan term in years"
            />

            <InputField
              label="Annual Appreciation Projections"
              name="annualAppreciation"
              value={data.annualAppreciation}
              onChange={(value) => handleInputChange('annualAppreciation', value)}
              type="range"
              min={0}
              max={10}
              step={0.1}
              suffix="%"
              tooltip="Estimated annual property value appreciation rate"
            />
          </div>
        </BorderContainer>

        <BorderContainer title="Campground Details">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Home className="w-5 h-5 mr-2" />
            Site Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <InputField
              label="Number of Sites"
              name="numberOfSites"
              value={data.numberOfSites}
              onChange={(value) => handleInputChange('numberOfSites', value)}
              min={1}
              max={999}
              tooltip="Enter the total number of available campsites"
            />

            <InputField
              label="Monthly Rent Per Site"
              name="monthlyRentPerSite"
              value={data.monthlyRentPerSite}
              onChange={(value) => handleInputChange('monthlyRentPerSite', value)}
              prefix="$"
              tooltip="Average monthly rent charged per campsite"
            />

            <InputField
              label="Additional Services $"
              name="additionalServicesRevenue"
              value={data.additionalServicesRevenue}
              onChange={(value) => handleInputChange('additionalServicesRevenue', value)}
              prefix="$"
              tooltip="Average monthly additional revenue per site (utilities, amenities, etc.)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Occupancy Rate"
              name="occupancyRate"
              value={data.occupancyRate}
              onChange={(value) => handleInputChange('occupancyRate', value)}
              suffix="%"
              min={0}
              max={100}
              tooltip="Expected percentage of sites occupied on average"
            />

            <InputField
              label="Campground Open Months Per Year"
              name="openMonthsPerYear"
              value={data.openMonthsPerYear}
              onChange={(value) => handleInputChange('openMonthsPerYear', value)}
              type="range"
              min={1}
              max={12}
              suffix="months"
              tooltip="Number of months the campground operates annually"
            />
          </div>
        </BorderContainer>

        <BorderContainer title="Monthly Costs">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Operating Expenses
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Property Management Fee"
              name="monthlyManagementFee"
              value={data.monthlyManagementFee}
              onChange={(value) => handleInputChange('monthlyManagementFee', value)}
              prefix="$"
              tooltip="Total monthly cost for property management and staff"
            />

            <InputField
              label="Maintenance Costs"
              name="monthlyMaintenanceCosts"
              value={data.monthlyMaintenanceCosts}
              onChange={(value) => handleInputChange('monthlyMaintenanceCosts', value)}
              prefix="$"
              tooltip="Average monthly maintenance and repair costs"
            />

            <InputField
              label="Other Operating Costs"
              name="monthlyOperatingCosts"
              value={data.monthlyOperatingCosts}
              onChange={(value) => handleInputChange('monthlyOperatingCosts', value)}
              prefix="$"
              tooltip="Additional monthly operating expenses"
            />
          </div>
        </BorderContainer>

        <div className="flex space-x-4">
          <InputButton
            variant="primary"
            onClick={calculateResults}
            className="flex-1"
          >
            Calculate Projections
          </InputButton>
          <ResetButton onClick={handleReset} />
        </div>

        {results && (
          <BorderContainer>
            <ResultsDisplay results={results} onDownloadCSV={handleDownloadCSV} />
          </BorderContainer>
        )}
      </div>
    </div>
  );
};