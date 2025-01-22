import React, { useState } from 'react';
import { Calculator, Users } from 'lucide-react';
import DailySales from './DailySales';
import FinancialInputs from './FinancialInputs';
import LaborInputs from './LaborInputs';
import ResultsSection from './ResultsSection';
import ProjectionsTable from './ProjectionsTable';
import FeedbackInsights from './FeedbackInsights';
import { InputButton } from '../../ui/InputButton';
import { ResetButton } from '../../ui/ResetButton';
import { BorderContainer } from '../../ui/BorderContainer';

export interface DailySalesType {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

export interface CalculatorInputs {
  averageSpend: number;
  dailySales: DailySalesType;
  monthlyEventRevenue: number;
  cogsPercentage: number;
  includeLaborCost: boolean;
  hourlyWage: number;
  numberOfEmployees: number;
  dailyOperatingHours: number;
  workDaysPerWeek: number;
  monthlyCommissaryRent: number;
  monthlyFuelCosts: number;
  monthlyInsurance: number;
  monthlyLoanPayments: number;
  vendingPermits: number[];
  seasonalityFactor: number;
}

const defaultDailySales: DailySalesType = {
  monday: 0,
  tuesday: 0,
  wednesday: 35,
  thursday: 35,
  friday: 50,
  saturday: 50,
  sunday: 50
};

const FoodTruckBusinessCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    averageSpend: 14,
    dailySales: defaultDailySales,
    monthlyEventRevenue: 2000,
    cogsPercentage: 33,
    includeLaborCost: false,
    hourlyWage: 18,
    numberOfEmployees: 1,
    dailyOperatingHours: 8,
    workDaysPerWeek: 3,
    monthlyCommissaryRent: 500,
    monthlyFuelCosts: 250,
    monthlyInsurance: 100,
    monthlyLoanPayments: 0,
    vendingPermits: [0, 0, 0, 0],
    seasonalityFactor: 9
  });

  const [showResults, setShowResults] = useState(false);

  const calculateResults = () => {
    setShowResults(true);
  };

  const resetCalculator = () => {
    setInputs({
      averageSpend: 14,
      dailySales: defaultDailySales,
      monthlyEventRevenue: 2000,
      cogsPercentage: 33,
      includeLaborCost: false,
      hourlyWage: 18,
      numberOfEmployees: 1,
      dailyOperatingHours: 8,
      workDaysPerWeek: 3,
      monthlyCommissaryRent: 500,
      monthlyFuelCosts: 250,
      monthlyInsurance: 100,
      monthlyLoanPayments: 0,
      vendingPermits: [0, 0, 0, 0],
      seasonalityFactor: 9
    });
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4">
          <p className="text-lg text-gray-600">
          This calculator can be used to project potential earnings and profitability of a food truck business. Input your operating days, customer count, average spend per customer, and costs like ingredients and labor. 
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <FinancialInputs inputs={inputs} setInputs={setInputs} />
          <DailySales dailySales={inputs.dailySales} setDailySales={(sales) => setInputs({...inputs, dailySales: sales})} />
          
          <div className="mt-8 mb-4">
            <label className="flex items-center space-x-3 text-sm font-medium text-gray-700">
              <Users className="w-5 h-5 text-gray-500" />
              <span>Include Labor Costs</span>
              <input
                type="checkbox"
                checked={inputs.includeLaborCost}
                onChange={(e) => setInputs({...inputs, includeLaborCost: e.target.checked})}
                className="rounded border-gray-300 text-skin-emerald-text shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">
                Check if you plan to hire employees
              </span>
            </label>
          </div>
          
          {inputs.includeLaborCost && (
            <LaborInputs inputs={inputs} setInputs={setInputs} />
          )}
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <InputButton
            onClick={calculateResults}
            variant="primary"
            className="text-gray-800 hover:text-gray-900"
          >
            Calculate Food Truck Projections
          </InputButton>
          <ResetButton onClick={resetCalculator} />
        </div>

        {showResults && (
          <>
            <div className="mb-8">
              <ResultsSection inputs={inputs} />
              <ProjectionsTable inputs={inputs} />
            </div>
            <BorderContainer title="Business Insights">
              <FeedbackInsights inputs={inputs} />
            </BorderContainer>
          </>
        )}
      </div>
    </div>
  );
};

export default FoodTruckBusinessCalculator;