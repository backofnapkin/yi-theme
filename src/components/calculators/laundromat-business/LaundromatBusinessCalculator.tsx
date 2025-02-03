import React, { useState } from 'react';
import { Info, Download, Store, Banknote, LineChart, DollarSign } from 'lucide-react';
import { StartupInvestment } from './StartupInvestment';
import { RevenueAssumptions } from './RevenueAssumptions';
import { OperatingCosts } from './OperatingCosts';
import { KeyInsights } from './KeyInsights';
import { CostsChart } from './CostsChart';
import { UnitPerformanceChart } from './UnitPerformanceChart';
import { InputButton } from '../../ui/InputButton';
import { Tooltip } from '../../ui/Tooltip';
import { BorderContainer } from '../../ui/BorderContainer';

interface FormData {
  businessName: string;
  initialInvestment: number;
  loanAmount: number;
  interestRate: number;
  units: number;
  revenuePerUnit: number;
  utilizationRate: number;
  supplementaryRevenue: number;
  additionalRevenue: Array<{ name: string; amount: number }>;
  utilityCost: number;
  rent: number;
  laborCosts: number;
  maintenanceCost: number;
  additionalCosts: Array<{ name: string; amount: number }>;
}

const defaultFormData: FormData = {
  businessName: "Laura's Fold & Laundry",
  initialInvestment: 200000,
  loanAmount: 200000,
  interestRate: 7,
  units: 60,
  revenuePerUnit: 600,
  utilizationRate: 70,
  supplementaryRevenue: 500,
  additionalRevenue: [],
  utilityCost: 3000,
  rent: 3500,
  laborCosts: 4000,
  maintenanceCost: 500,
  additionalCosts: []
};

export const LaundromatBusinessCalculator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateMonthlyLoanPayment = (loanAmount: number, annualRate: number, years: number = 10): number => {
    const monthlyRate = (annualRate / 100) / 12;
    const numberOfPayments = years * 12;
    
    if (monthlyRate === 0) return loanAmount / numberOfPayments;
    
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return monthlyPayment;
  };

  const calculateFinancials = () => {
    // Calculate monthly loan payment (assuming 10-year term)
    const monthlyLoanPayment = calculateMonthlyLoanPayment(
      formData.loanAmount,
      formData.interestRate,
      10
    );

    const monthlyRevenue = (formData.revenuePerUnit * formData.units * (formData.utilizationRate / 100)) +
      formData.supplementaryRevenue +
      formData.additionalRevenue.reduce((sum, rev) => sum + rev.amount, 0);

    const monthlyOperatingCosts = formData.utilityCost +
      formData.rent +
      formData.laborCosts +
      formData.maintenanceCost +
      monthlyLoanPayment + // Add loan payment to monthly costs
      formData.additionalCosts.reduce((sum, cost) => sum + cost.amount, 0);

    const monthlyProfit = monthlyRevenue - monthlyOperatingCosts;
    const annualCashFlow = monthlyProfit * 12;
    const totalStartupCost = formData.initialInvestment;
    const breakEvenMonths = Math.ceil(totalStartupCost / monthlyProfit);

    return {
      monthlyRevenue,
      monthlyOperatingCosts,
      monthlyProfit,
      totalStartupCost,
      breakEvenMonths,
      annualCashFlow,
      monthlyLoanPayment
    };
  };

  const financials = calculateFinancials();

  const handleSave = () => {
    const results = `
${formData.businessName} - Financial Projections

MONTHLY FINANCIALS
Monthly Revenue: $${financials.monthlyRevenue.toLocaleString()}
Monthly Operating Costs: $${financials.monthlyOperatingCosts.toLocaleString()}
Monthly Loan Payment: $${financials.monthlyLoanPayment.toLocaleString()}
Monthly Profit: $${financials.monthlyProfit.toLocaleString()}

ANNUAL FINANCIALS
Annual Cash Flow: $${financials.annualCashFlow.toLocaleString()}

INVESTMENT
Total Startup Cost: $${financials.totalStartupCost.toLocaleString()}
Loan Amount: $${formData.loanAmount.toLocaleString()}
Interest Rate: ${formData.interestRate}%
Break-even Period: ${financials.breakEvenMonths} months

BUSINESS DETAILS
Number of Units: ${formData.units}
Revenue per Unit: $${formData.revenuePerUnit}
Utilization Rate: ${formData.utilizationRate}%

OPERATING COSTS
Utilities: $${formData.utilityCost}/month
Rent: $${formData.rent}/month
Labor: $${formData.laborCosts}/month
Maintenance: $${formData.maintenanceCost}/month
`;

    const blob = new Blob([results], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.businessName.replace(/\s+/g, '-').toLowerCase()}-projections.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setFormData(defaultFormData);
    setShowResults(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <BorderContainer>
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <label className="block text-sm font-medium text-gray-700">
              Laundromat Business Name
            </label>
            <Tooltip content="Enter your laundromat's business name">
              <Info className="w-4 h-4 text-gray-400" />
            </Tooltip>
          </div>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter business name"
          />

          <StartupInvestment 
            formData={formData}
            onChange={handleInputChange}
          />

          <RevenueAssumptions
            formData={formData}
            onChange={handleInputChange}
          />

          <OperatingCosts
            formData={formData}
            onChange={handleInputChange}
          />

          <div className="flex space-x-4">
            <InputButton
              onClick={handleCalculate}
              variant="primary"
            >
              Calculate
            </InputButton>
            <InputButton
              onClick={handleReset}
              variant="secondary"
            >
              Reset
            </InputButton>
          </div>
        </div>
      </BorderContainer>

      {showResults && (
        <div className="space-y-8">
          <BorderContainer>
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <LineChart className="w-6 h-6" />
                  {formData.businessName} Financial Projections
                </h2>
                <InputButton
                  onClick={handleSave}
                  variant="secondary"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Save Results
                  </div>
                </InputButton>
              </div>

              <KeyInsights
                monthlyRevenue={financials.monthlyRevenue}
                monthlyOperatingCosts={financials.monthlyOperatingCosts}
                monthlyProfit={financials.monthlyProfit}
                totalStartupCost={financials.totalStartupCost}
                breakEvenMonths={financials.breakEvenMonths}
                annualCashFlow={financials.annualCashFlow}
              />
            </div>
          </BorderContainer>

          <BorderContainer>
            <CostsChart
              costs={{
                utilities: formData.utilityCost,
                rent: formData.rent,
                labor: formData.laborCosts,
                maintenance: formData.maintenanceCost,
                additional: [
                  ...formData.additionalCosts,
                  { name: 'Loan Payment', amount: financials.monthlyLoanPayment }
                ],
              }}
            />
          </BorderContainer>

          <BorderContainer>
            <UnitPerformanceChart
              revenuePerUnit={formData.revenuePerUnit * formData.units}
              utilizationRate={formData.utilizationRate}
              monthlyOperatingCosts={financials.monthlyOperatingCosts}
            />
          </BorderContainer>
        </div>
      )}
    </div>
  );
};

export default LaundromatBusinessCalculator;