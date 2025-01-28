import React, { useState } from 'react';
import { DollarSign, Wallet, PiggyBank, Ban as Bank, LineChart, Home, Calculator, RotateCcw } from 'lucide-react';
import IncomeInput from './components/IncomeInput';
import BoomerEarnings from './components/BoomerEarnings';
import BoomerWageGrowth from './components/BoomerWageGrowth';
import BoomerInvesting from './components/BoomerInvesting';
import BoomerHomeValue from './components/BoomerHomeValue';
import BoomerDownpayment from './components/BoomerDownpayment';
import BoomerInsights from './components/BoomerInsights';
import InfoButton from './components/InfoButton';
import { DecimalInput } from '../../ui/DecimalInput';
import { InputButton } from '../../ui/InputButton';
import { RangeInput } from '../../ui/RangeInput';
import { ResetButton } from '../../ui/ResetButton';
import { BorderContainer } from '../../ui/BorderContainer';

type BoomerEra = 'early' | 'core' | 'late';

interface CalculatorInputs {
  incomeType: 'annual' | 'hourly';
  annualSalary: number;
  hourlyWage: number;
  retirementSavings: number;
  retirementContribution: number;
  liquidSavings: number;
  monthlySavings: number;
  savingsAllocation: {
    savingsAccount: number;
    stocks: number;
    savingsBonds: number;
  };
  age: number;
  hasDegree: boolean;
  ownsHome: boolean;
  homeValue: number;
}

const OkBoomerFinancialCalculator: React.FC = () => {
  const [showResults, setShowResults] = useState(false);
  const [selectedEra, setSelectedEra] = useState<BoomerEra>('core');
  const [inputs, setInputs] = useState<CalculatorInputs>({
    incomeType: 'annual',
    annualSalary: 62027,
    hourlyWage: 18,
    retirementSavings: 35537,
    retirementContribution: 800,
    liquidSavings: 27900,
    monthlySavings: 200,
    savingsAllocation: {
      savingsAccount: 10,
      stocks: 80,
      savingsBonds: 10,
    },
    age: 35,
    hasDegree: true,
    ownsHome: true,
    homeValue: 420400,
  });

  const handleInputChange = (field: keyof CalculatorInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleAllocationChange = (type: keyof typeof inputs.savingsAllocation, value: number) => {
    const newAllocations = { ...inputs.savingsAllocation, [type]: value };
    const total = Object.values(newAllocations).reduce((sum, val) => sum + val, 0);
    
    if (total <= 100) {
      setInputs(prev => ({
        ...prev,
        savingsAllocation: newAllocations
      }));
    }
  };

  const resetForm = () => {
    setInputs({
      incomeType: 'annual',
      annualSalary: 62027,
      hourlyWage: 18,
      retirementSavings: 35537,
      retirementContribution: 800,
      liquidSavings: 27900,
      monthlySavings: 200,
      savingsAllocation: {
        savingsAccount: 10,
        stocks: 80,
        savingsBonds: 10,
      },
      age: 35,
      hasDegree: true,
      ownsHome: true,
      homeValue: 420400,
    });
    setShowResults(false);
  };

  return (
    <div className="min-h-screen p-2 md:p-8">
      <div className="max-w-6xl mx-auto">
        {!showResults ? (
          <BorderContainer className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Calculator className="w-8 h-8 text-blue-600" />
                OK Boomer: Financial Calculator
              </h1>
              <p className="text-gray-600">
                Jump into the financial time machine and find out what it would be like to experience the 30-year investment returns and buying power of the Boomer generation - where a summer job could pay for college and "avocado toast" wasn't blamed for housing affordability.
              </p>
            </div>
            
            <form className="space-y-8">
              <IncomeInput
                incomeType={inputs.incomeType}
                annualSalary={inputs.annualSalary}
                hourlyWage={inputs.hourlyWage}
                onIncomeTypeChange={(type) => handleInputChange('incomeType', type)}
                onAnnualSalaryChange={(value) => handleInputChange('annualSalary', value)}
                onHourlyWageChange={(value) => handleInputChange('hourlyWage', value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                    <PiggyBank className="w-5 h-5 text-purple-600" />
                    Retirement
                    <InfoButton
                      content="Enter your current retirement savings and monthly contributions. We'll show you how your retirement strategy compares to historical returns and savings rates from different Boomer periods."
                    />
                  </h2>
                  <p className="text-sm text-gray-600 -mt-2">Your retirement savings and contributions</p>
                  <div className="space-y-4">
                    <DecimalInput
                      label="Total Retirement Savings"
                      value={inputs.retirementSavings}
                      onChange={(value) => handleInputChange('retirementSavings', value)}
                      prefix="$"
                      min={0}
                      placeholder="Current balance in all retirement accounts"
                    />
                    <DecimalInput
                      label="Monthly Retirement Contribution"
                      value={inputs.retirementContribution}
                      onChange={(value) => handleInputChange('retirementContribution', value)}
                      prefix="$"
                      min={0}
                      placeholder="Monthly retirement savings"
                    />
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-yellow-600" />
                    Savings
                    <InfoButton
                      content="Enter your current savings balance and monthly savings amount. We'll compare your saving power to historical interest rates and show you how your money would have grown in different Boomer eras."
                    />
                  </h2>
                  <p className="text-sm text-gray-600 -mt-2">Current savings and monthly contributions</p>
                  <div className="space-y-4">
                    <DecimalInput
                      label="Total Savings"
                      value={inputs.liquidSavings}
                      onChange={(value) => handleInputChange('liquidSavings', value)}
                      prefix="$"
                      min={0}
                      placeholder="Total money in savings and investments"
                    />
                    <DecimalInput
                      label="Monthly Savings"
                      value={inputs.monthlySavings}
                      onChange={(value) => handleInputChange('monthlySavings', value)}
                      prefix="$"
                      min={0}
                      placeholder="Monthly savings amount"
                    />
                  </div>
                </section>
              </div>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-blue-600" />
                  Investment Allocation
                  <InfoButton
                    content={
                      <div className="space-y-2">
                        <p>Distribute savings across investment categories. Make sure your total allocation is set to 100%.</p>
                      </div>
                    }
                  />
                </h2>
                </section>
                <section>
  <p className="text-sm text-gray-600 -mt-2">How your savings are distributed across different investments</p>
  <div className="space-y-6">
    <div>
      <div className="flex justify-between mb-2">
        <label>Savings Account</label>
        <span>{inputs.savingsAllocation.savingsAccount}%</span>
      </div>
      <RangeInput
        value={inputs.savingsAllocation.savingsAccount}
        onChange={(value) => handleAllocationChange('savingsAccount', Number(value))}
        min={0}
        max={100}
        step={1}
      />
    </div>
    <div>
      <div className="flex justify-between mb-2">
        <label>Stocks</label>
        <span>{inputs.savingsAllocation.stocks}%</span>
      </div>
      <RangeInput
        value={inputs.savingsAllocation.stocks}
        onChange={(value) => handleAllocationChange('stocks', Number(value))}
        min={0}
        max={100}
        step={1}
      />
    </div>
    <div>
      <div className="flex justify-between mb-2">
        <label>Savings Bonds</label>
        <span>{inputs.savingsAllocation.savingsBonds}%</span>
      </div>
      <RangeInput
        value={inputs.savingsAllocation.savingsBonds}
        onChange={(value) => handleAllocationChange('savingsBonds', Number(value))}
        min={0}
        max={100}
        step={1}
      />
    </div>
    <div className="text-sm text-gray-600">
      Total Allocation: {Object.values(inputs.savingsAllocation).reduce((sum, val) => sum + val, 0)}%
    </div>
  </div>
</section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                    Age
                    <InfoButton
                      content="Your current age helps us calculate long-term projections and compare your financial timeline to historical Boomer wealth-building patterns."
                    />
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">Your current age for retirement planning</p>
                  <DecimalInput
                    label="Current Age"
                    value={inputs.age}
                    onChange={(value) => handleInputChange('age', value)}
                    min={10}
                    max={99}
                    placeholder="Your current age"
                  />
                </div>

                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                    4-Year College Degree
                    <InfoButton
                      content="Having a college degree significantly impacted career trajectories and earning potential during the Boomer era."
                    />
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">Did you graduate?</p>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">Education Status</label>
                    <select
                      className="h-[42px] w-full px-4 py-2 border border-gray-300 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600
                        hover:border-emerald-600 transition-colors"
                      value={inputs.hasDegree ? 'yes' : 'no'}
                      onChange={(e) => handleInputChange('hasDegree', e.target.value === 'yes')}
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                  <Home className="w-5 h-5 text-indigo-600" />
                  Home Ownership
                  <InfoButton
                    content="Enter your home's current market value if you own one. We'll compare historical home prices, mortgage rates, and appreciation patterns across different Boomer periods."
                  />
                </h2>
                <p className="text-sm text-gray-600 -mt-2">Information about your home, if you own one</p>
                <div className="space-y-4">
                <label className="inline-flex items-center">
  <style>
    {`
      input[type="checkbox"] {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border: 2px solid rgb(229, 231, 235); /* gray-200 */
        border-radius: 4px;
        outline: none;
        cursor: pointer;
        position: relative;
        margin-right: 8px;
      }

      input[type="checkbox"]:checked {
        border-color: rgb(5, 150, 105); /* emerald-600 */
        background-color: rgb(5, 150, 105); /* emerald-600 */
        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
      }

      input[type="checkbox"]:focus {
        outline: none;
        border-color: rgb(5, 150, 105); /* emerald-600 */
        box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2);
      }
    `}
  </style>
  <input
    type="checkbox"
    checked={inputs.ownsHome}
    onChange={(e) => handleInputChange('ownsHome', e.target.checked)}
    className="cursor-pointer"
  />
  <span className="ml-2">I own a home</span>
</label>
                  {inputs.ownsHome && (
                    <DecimalInput
                      label="Current Home Value"
                      value={inputs.homeValue}
                      onChange={(value) => handleInputChange('homeValue', value)}
                      prefix="$"
                      min={0}
                      placeholder="Estimated current market value"
                    />
                  )}
                </div>
              </section>

              <div className="flex gap-4 pt-4">
                <InputButton
                  variant="primary"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={() => setShowResults(true)}
                >
                  <Calculator className="w-5 h-5" />
                  Calculate Your Boomer Wealth
                </InputButton>
                <ResetButton onClick={resetForm} />
              </div>
            </form>
          </BorderContainer>
        ) : (
          <div className="space-y-8">
            <BorderContainer className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                Your Boomer Wealth Projections
                <InfoButton
                  content={
                    <div className="space-y-2">
                      <p>Project your financial metrics if you entered the workforce during these distinct Boomer periods:</p>
                      <ul className="list-disc pl-4">
                        <li><strong>Early Boomer (1970):</strong> Peak of post-war prosperity</li>
                        <li><strong>Core Boomer (1977):</strong> Period of high interest rates</li>
                        <li><strong>Late Boomer (1988):</strong> Pre-tech boom era</li>
                      </ul>
                    </div>
                  }
                  position="right"
                />
              </h1>
              
              <p className="text-sm text-gray-500 italic mb-6">
                * Disclaimer: Our charts only go up and to the right, just like the good ol' days! Past performance does not guarantee future results. Select the year you enter the workforce below for custom projections.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-8">
                <InputButton
                  variant={selectedEra === 'early' ? 'primary' : 'secondary'}
                  className="flex-1"
                  onClick={() => setSelectedEra('early')}
                >
                  Early Boomer (1970)
                </InputButton>
                <InputButton
                  variant={selectedEra === 'core' ? 'primary' : 'secondary'}
                  className="flex-1"
                  onClick={() => setSelectedEra('core')}
                >
                  Core Boomer (1977)
                </InputButton>
                <InputButton
                  variant={selectedEra === 'late' ? 'primary' : 'secondary'}
                  className="flex-1"
                  onClick={() => setSelectedEra('late')}
                >
                  Late Boomer (1988)
                </InputButton>
              </div>

              <div className="space-y-8">
                <BoomerEarnings
                  currentIncome={inputs.incomeType === 'annual' ? inputs.annualSalary : inputs.hourlyWage * 2080}
                  selectedEra={selectedEra}
                  incomeType={inputs.incomeType}
                />
                
                <BoomerWageGrowth
                  currentIncome={inputs.incomeType === 'annual' ? inputs.annualSalary : inputs.hourlyWage * 2080}
                  currentAge={inputs.age}
                  selectedEra={selectedEra}
                />

                <BoomerInvesting
                  currentAge={inputs.age}
                  selectedEra={selectedEra}
                  initialInvestment={inputs.liquidSavings}
                  monthlyContribution={inputs.monthlySavings}
                  allocation={inputs.savingsAllocation}
                />

                <BoomerHomeValue
                  homeValue={inputs.homeValue}
                  selectedEra={selectedEra}
                  currentAge={inputs.age}
                />

                <BoomerDownpayment
                  currentIncome={inputs.incomeType === 'annual' ? inputs.annualSalary : inputs.hourlyWage * 2080}
                  selectedEra={selectedEra}
                  monthlySavings={inputs.monthlySavings}
                />

                <BoomerInsights selectedEra={selectedEra} />
              </div>

              <button
                className="mt-8 px-6 py-3 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                onClick={() => setShowResults(false)}
              >
                <RotateCcw className="w-5 h-5" />
                Back to Calculator
              </button>
            </BorderContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export { OkBoomerFinancialCalculator };