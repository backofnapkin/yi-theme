import React, { useState } from 'react';
import { DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import InfoButton from '../components/InfoButton';
import { BorderContainer } from '../../../ui/BorderContainer';

interface BoomerEarningsProps {
  currentIncome: number;
  selectedEra: 'early' | 'core' | 'late';
  incomeType: 'annual' | 'hourly';
}

const incomeRatios = {
  early: 7.14,  // 1970 income ratio to current value (14% of current value)
  core: 5.0,    // 1977 income ratio to current value (20% of current value)
  late: 2.86    // 1988 income ratio to current value (35% of current value)
};

const historicalPrices = {
  early: {
    house: 23450,
    car: 3542,
    college: 600,
    year: 1970
  },
  core: {
    house: 48800,
    car: 4950,
    college: 800,
    year: 1977
  },
  late: {
    house: 91600,
    car: 14500,
    college: 3200,
    year: 1988
  }
};

const currentPrices = {
  house: 487800,
  car: 48000,
  college: 25700
};

const collegeValueInfo = {
  early: {
    salaryPremium: 45,
    lifetimeEarnings: 2.1
  },
  core: {
    salaryPremium: 50,
    lifetimeEarnings: 2.3
  },
  late: {
    salaryPremium: 55,
    lifetimeEarnings: 2.4
  }
};

function calculateTimeToEarn(price: number, annualIncome: number): string {
  const monthsTotal = Math.round((price / annualIncome) * 12);
  const years = Math.floor(monthsTotal / 12);
  const months = monthsTotal % 12;
  
  if (years === 0) return `${months} months`;
  if (months === 0) return `${years} years`;
  return `${years} years and ${months} months`;
}

function calculateTimeDifference(currentMonths: number, historicalMonths: number): string {
  const difference = currentMonths - historicalMonths;
  const years = Math.floor(difference / 12);
  const months = difference % 12;
  
  if (years === 0) return `${months} months`;
  if (months === 0) return `${years} years`;
  return `${years} years and ${months} months`;
}

const BoomerEarnings: React.FC<BoomerEarningsProps> = ({ currentIncome, selectedEra, incomeType }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const calculateHistoricalIncome = (current: number, era: keyof typeof incomeRatios) => {
    return current / incomeRatios[era];
  };

  const historicalValue = calculateHistoricalIncome(currentIncome, selectedEra);
  const prices = historicalPrices[selectedEra];

  const comparisons = [
    {
      emoji: '🏠',
      title: 'Home Purchase',
      current: {
        price: currentPrices.house,
        time: calculateTimeToEarn(currentPrices.house, currentIncome)
      },
      historical: {
        price: prices.house,
        time: calculateTimeToEarn(prices.house, historicalValue)
      }
    },
    {
      emoji: '🚗',
      title: 'New Car',
      current: {
        price: currentPrices.car,
        time: calculateTimeToEarn(currentPrices.car, currentIncome)
      },
      historical: {
        price: prices.car,
        time: calculateTimeToEarn(prices.car, historicalValue)
      }
    },
    {
      emoji: '🎓',
      title: 'College Year',
      current: {
        price: currentPrices.college,
        time: calculateTimeToEarn(currentPrices.college, currentIncome)
      },
      historical: {
        price: prices.college,
        time: calculateTimeToEarn(prices.college, historicalValue)
      }
    }
  ];

  return (
    <div className="space-y-4">
      <BorderContainer className="bg-white rounded-xl shadow-lg p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            Historical Value of Your Current Income
            <InfoButton
              content={
                <div className="space-y-2">
                  <p>This component shows how your current income translates to historical buying power:</p>
                  <ul className="list-disc pl-4">
                    <li>Current Income: Your present-day income</li>
                    <li>Historical Value: What your income would be worth in the selected Boomer era</li>
                    <li>Accounts for inflation and economic changes between eras</li>
                  </ul>
                </div>
              }
            />
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Current Income:</span>
              <span className="text-xl font-bold text-skin-emerald-text">
                ${currentIncome.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-1 bg-green-50 rounded-lg">
              <span className="text-gray-700">
                {selectedEra === 'early' ? '1970' : selectedEra === 'core' ? '1977' : '1988'} Equivalent Income:
              </span>
              <span className="text-xl font-bold text-green-600">
                ${Math.round(historicalValue).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </BorderContainer>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            View Purchasing Power Comparison
          </h3>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 space-y-6 border-t border-gray-100">
            <p className="text-gray-600 mt-4">
              See how your purchasing power compares across different major expenses:
            </p>
            
            {comparisons.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">{item.emoji}</span>
                  {item.title}
                </h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Today:</span>
                    <span className="font-medium">
                      ${item.current.price.toLocaleString()} ({item.current.time} of income)
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{prices.year}:</span>
                    <span className="font-medium">
                      ${item.historical.price.toLocaleString()} ({item.historical.time} of income)
                    </span>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center text-green-600 font-semibold">
                      <span>Boomer Advantage:</span>
                      <span>
                        {calculateTimeDifference(
                          Math.round((item.current.price / currentIncome) * 12),
                          Math.round((item.historical.price / historicalValue) * 12)
                        )} faster!
                      </span>
                    </div>

                    {item.title === 'College Year' && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">
                          The Value of a College Degree in {prices.year}
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🚀</span>
                            <p className="text-blue-700">
                              <span className="font-semibold">{collegeValueInfo[selectedEra].salaryPremium}% Higher</span> starting salary compared to non-graduates
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">💰</span>
                            <p className="text-blue-700">
                              <span className="font-semibold">${collegeValueInfo[selectedEra].lifetimeEarnings} Million</span> additional lifetime earnings in today's dollars
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-blue-600 mt-2">
                            <span className="text-xl">📊</span>
                            <p className="italic">
                              College graduates consistently earned more and had greater job security throughout their careers
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoomerEarnings;