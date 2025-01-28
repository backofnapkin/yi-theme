import React from 'react';
import { PiggyBank } from 'lucide-react';
import InfoButton from '../components/InfoButton';

interface BoomerDownpaymentProps {
  currentIncome: number;
  selectedEra: 'early' | 'core' | 'late';
  monthlySavings: number;
}

const historicalHomeValues = {
  early: 23450,  // 1970
  core: 48800,   // 1977
  late: 91600    // 1988
};

const currentMedianHome = 487800; // Current median home price

const BoomerDownpayment: React.FC<BoomerDownpaymentProps> = ({ currentIncome, selectedEra, monthlySavings }) => {
  const historicalIncome = currentIncome * (selectedEra === 'early' ? 0.14 : selectedEra === 'core' ? 0.20 : 0.35);
  const historicalDownpayment = historicalHomeValues[selectedEra] * 0.2;
  const currentDownpayment = currentMedianHome * 0.2;
  
  const historicalMonths = Math.ceil(historicalDownpayment / (monthlySavings * (historicalIncome / currentIncome)));
  const currentMonths = Math.ceil(currentDownpayment / monthlySavings);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <PiggyBank className="w-6 h-6 text-yellow-600" />
        Boomer Downpayment Journey
        <InfoButton
          content={
            <div className="space-y-2">
              <p>Compare how long it takes to save for a home downpayment:</p>
              <ul className="list-disc pl-4">
                <li>Shows time needed to save 20% downpayment</li>
                <li>Compares historical home prices to current median price</li>
                <li>Adjusts savings rate based on historical income ratios</li>
                <li>Demonstrates the changing affordability of homeownership</li>
              </ul>
            </div>
          }
        />
      </h2>
      <div className="space-y-1">
        <div className="p-2 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Historical Perspective ({selectedEra === 'early' ? '1970' : selectedEra === 'core' ? '1977' : '1988'})</h3>
          <p>
            Your current monthly savings is like a Boomer saving ${Math.round(monthlySavings * (historicalIncome / currentIncome)).toLocaleString()} per month in this era. 
            You could save a 20% home down payment (${Math.round(historicalDownpayment).toLocaleString()}) 
            in {Math.floor(historicalMonths / 12)} years and {historicalMonths % 12} months at this rate.
          </p>
        </div>
        <div className="p-2 bg-green-50 rounded-lg">
          <h3 className="font-semibold mb-2">Current Reality</h3>
          <p>
            Based on your current monthly savings of ${Math.round(monthlySavings).toLocaleString()}, 
            you'll need {Math.floor(currentMonths / 12)} years and {currentMonths % 12} months 
            to save a 20% down payment (${Math.round(currentDownpayment).toLocaleString()}) for an average home.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BoomerDownpayment;