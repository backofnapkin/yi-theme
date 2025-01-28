import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface BoomerPurchasingPowerProps {
  currentIncome: number;
  selectedEra: 'early' | 'core' | 'late';
}

const historicalPrices = {
  early: {
    house: 23450,
    car: 3542,
    college: 600,
    year: 1970
  },
  core: {
    house: 48000,
    car: 4950,
    college: 800,
    year: 1977
  },
  late: {
    house: 100000,
    car: 14500,
    college: 3200,
    year: 1988
  }
};

const currentPrices = {
  house: 487600,
  car: 48000,
  college: 25700
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

const BoomerPurchasingPower: React.FC<BoomerPurchasingPowerProps> = ({ currentIncome, selectedEra }) => {
  const historicalIncome = currentIncome * (selectedEra === 'early' ? 0.14 : selectedEra === 'core' ? 0.20 : 0.35);
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
        time: calculateTimeToEarn(prices.house, historicalIncome)
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
        time: calculateTimeToEarn(prices.car, historicalIncome)
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
        time: calculateTimeToEarn(prices.college, historicalIncome)
      }
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-2">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-1">
        <ShoppingBag className="w-6 h-6 text-purple-600" />
        Purchasing Power Comparison
      </h2>
      
      <div className="space-y-3">
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
                      Math.round((item.historical.price / historicalIncome) * 12)
                    )} faster!
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoomerPurchasingPower;