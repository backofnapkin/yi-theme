import React from 'react';
import { DollarSign, Calendar, Clock, Printer, CircleDollarSign } from 'lucide-react';
import type { CommuteData } from './types';
import { convertHoursToTimeUnits, calculateTimeValues, calculateFinancialCosts } from './utils';
import InfoButton from './components/InfoButton';

interface ResultsDisplayProps {
  data: CommuteData;
  onPrint: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data, onPrint }) => {
  const timeValues = calculateTimeValues(data.timeMinutes, data.timeSeconds, data.workdaysPerWeek);
  const financialCosts = calculateFinancialCosts({
    ...data,
    annualTimeHours: timeValues.annualTimeHours
  });

  // Calculate investment potential using 7% annual return
  const calculateInvestmentGrowth = (annualSavings: number, years: number) => {
    // Using compound interest formula: A = P(1 + r)^t
    const rate = 0.07; // 7% annual return
    return annualSavings * ((Math.pow(1 + rate, years) - 1) / rate);
  };

  const tenYearInvestment = calculateInvestmentGrowth(financialCosts.totalAnnualCost, 10);
  const twentyYearInvestment = calculateInvestmentGrowth(financialCosts.totalAnnualCost, 20);
  const thirtyYearInvestment = calculateInvestmentGrowth(financialCosts.totalAnnualCost, 30);

  return (
    <div className="space-y-6">
      <div className="border rounded-lg">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Annual Costs of Driving to Work
              <InfoButton content="Breakdown of your yearly commuting expenses, including direct costs (gas, maintenance) and the value of your time spent commuting." />
            </h2>
            <button
              onClick={onPrint}
              className="text-emerald-600 hover:text-emerald-800 print:hidden"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Direct Driving Costs</p>
                <p className="text-lg font-semibold">
                  ${financialCosts.annualDirectDrivingCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Annual Gas Costs</p>
                <p className="text-lg font-semibold">
                  ${financialCosts.annualGasCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Annual Car Payments</p>
                <p className="text-lg font-semibold">
                  ${financialCosts.annualCarPayments.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time Opportunity Cost</p>
                <p className="text-lg font-semibold">
                  ${financialCosts.annualTimeCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">Total Annual Cost</p>
              <p className="text-2xl font-bold text-skin-red-text">
                ${financialCosts.totalAnnualCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            Long-term Impact
            <InfoButton content="See the potential investment growth if driving expenses were invested with a 7% annual return. Mr. Money Mustache refers to this as The Rule of 172." />
          </h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">10-Year Impact</p>
              <p className="text-xl font-semibold">
                ${(financialCosts.totalAnnualCost * 10).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                If invested at 7% annual return, these savings could grow to{' '}
                <span className="font-semibold text-skin-emerald-text">
                  ${tenYearInvestment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                , generating an additional{' '}
                <span className="font-semibold text-emerald-600">
                  ${(tenYearInvestment - financialCosts.totalAnnualCost * 10).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                {' '}in investment returns.
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">20-Year Impact</p>
              <p className="text-xl font-semibold">
                ${(financialCosts.totalAnnualCost * 20).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                If invested at 7% annual return, these savings could grow to{' '}
                <span className="font-semibold text-skin-emerald-text">
                  ${twentyYearInvestment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                , generating an additional{' '}
                <span className="font-semibold text-emerald-600">
                  ${(twentyYearInvestment - financialCosts.totalAnnualCost * 20).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                {' '}in investment returns.
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">30-Year Impact</p>
              <p className="text-xl font-semibold">
                ${(financialCosts.totalAnnualCost * 30).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                If invested at 7% annual return, these savings could grow to{' '}
                <span className="font-semibold text-skin-emerald-text">
                  ${thirtyYearInvestment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                , generating an additional{' '}
                <span className="font-semibold text-emerald-600">
                  ${(thirtyYearInvestment - financialCosts.totalAnnualCost * 30).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                {' '}in investment returns.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            Time Investment
            <InfoButton content="Visualize the total time spent commuting across different time periods, converted into meaningful units like days and years." />
          </h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Weekly Hours</p>
              <p className="text-lg font-semibold">{timeValues.weeklyTimeHours.toFixed(1)} hours</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Annual Time</p>
              <p className="text-lg font-semibold">
                {timeValues.annualTimeHours.toFixed(1)} hours
                {' '}
                ({convertHoursToTimeUnits(timeValues.annualTimeHours).months} months, 
                {convertHoursToTimeUnits(timeValues.annualTimeHours).days} days)
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">10-Year Time</p>
              <p className="text-lg font-semibold">
                {timeValues.tenYearTimeHours.toFixed(1)} hours
                {' '}
                ({convertHoursToTimeUnits(timeValues.tenYearTimeHours).years} years, 
                {convertHoursToTimeUnits(timeValues.tenYearTimeHours).months} months)
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">20-Year Time</p>
              <p className="text-lg font-semibold">
                {timeValues.twentyYearTimeHours.toFixed(1)} hours
                {' '}
                ({convertHoursToTimeUnits(timeValues.twentyYearTimeHours).years} years, 
                {convertHoursToTimeUnits(timeValues.twentyYearTimeHours).months} months)
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">30-Year Time</p>
              <p className="text-lg font-semibold">
                {timeValues.thirtyYearTimeHours.toFixed(1)} hours
                {' '}
                ({convertHoursToTimeUnits(timeValues.thirtyYearTimeHours).years} years, 
                {convertHoursToTimeUnits(timeValues.thirtyYearTimeHours).months} months)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="!bg-gradient-to-br !from-orange-100 !to-amber-100 !border !border-amber-200 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            Insights
            <InfoButton content="Practical takeaways and alternative scenarios to help you make informed decisions about your commute and living situation." />
          </h2>
          
          <div className="space-y-4 text-gray-700">
            <p className="flex items-start gap-3">
              <CircleDollarSign className="h-5 w-5 mt-1 text-emerald-600 flex-shrink-0" />
              <span>
                You could afford to spend up to an additional{' '}
                <span className="font-semibold text-emerald-600">
                  ${(financialCosts.totalAnnualCost / 12).toFixed(2)}
                </span>{' '}
                per month to live within walking/biking distance to work without losing money.
              </span>
            </p>
            
            <p className="flex items-start gap-3">
              <Clock className="h-5 w-5 mt-1 text-emerald-600 flex-shrink-0" />
              <span>
                By cutting your commute time by 50% to{' '}
                <span className="font-semibold">
                  {((data.timeMinutes * 60 + data.timeSeconds) / 2 / 60).toFixed(1)}
                </span>{' '}
                minutes per day, you could save{' '}
                <span className="font-semibold text-emerald-600">
                  {(timeValues.annualTimeHours / 2).toFixed(1)}
                </span>{' '}
                hours per year.
              </span>
            </p>
            
            <p className="flex items-start gap-3">
              <Clock className="h-5 w-5 mt-1 text-emerald-600 flex-shrink-0" />
              <span>
                By cutting your commute time by 75% to{' '}
                <span className="font-semibold">
                  {((data.timeMinutes * 60 + data.timeSeconds) / 4 / 60).toFixed(1)}
                </span>{' '}
                minutes per day, you could save{' '}
                <span className="font-semibold text-emerald-600">
                  {(timeValues.annualTimeHours * 0.75).toFixed(1)}
                </span>{' '}
                hours per year.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;