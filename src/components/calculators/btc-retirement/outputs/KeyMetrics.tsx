import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';

interface KeyMetricsProps {
  calculatorState: {
    currentAge: number;
    lifeExpectancy: number;
    currentBtc: number;
    annualBtcPurchase: number;
    retirementAge: number;
    annualSpend: number;
    growthRate: number;
  };
  btcPrice: number;
  riskAnalysis: any; // We'll type this properly later
}

const KeyMetrics: React.FC<KeyMetricsProps> = ({
  calculatorState,
  btcPrice,
  riskAnalysis,
}) => {
  // Calculate time periods
  const yearsUntilRetirement = calculatorState.retirementAge - calculatorState.currentAge;
  const yearsInRetirement = calculatorState.lifeExpectancy - calculatorState.retirementAge;

  // Calculate projected BTC price at retirement
  const projectedBtcPrice = btcPrice * Math.pow(1 + calculatorState.growthRate / 100, yearsUntilRetirement);

  // Calculate total spending needs during retirement
  const totalRetirementSpending = calculatorState.annualSpend * yearsInRetirement;

  // Calculate target BTC needed considering total retirement period
  const targetBtc = totalRetirementSpending / projectedBtcPrice;

  // Calculate how much BTC we need to accumulate annually
  const btcNeededFromPurchases = targetBtc - calculatorState.currentBtc;
  const annualBtcNeeded = btcNeededFromPurchases / yearsUntilRetirement;

  // Calculate total projected BTC holdings at retirement
  const totalBtcAtRetirement = calculatorState.currentBtc + (annualBtcNeeded * yearsUntilRetirement);

  const MetricCard = ({ title, value, description, tooltip }: {
    title: string;
    value: string;
    description: string;
    tooltip: string;
  }) => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <Tooltip content={tooltip}>
          <div className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
            <Info size={16} />
          </div>
        </Tooltip>
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <MetricCard
        title="Target BTC"
        value={`₿${targetBtc.toFixed(8)}`}
        description="To meet income goals"
        tooltip={`Amount of BTC needed to cover ${yearsInRetirement} years of retirement spending at $${calculatorState.annualSpend.toLocaleString()} per year`}
      />

      <MetricCard
        title="Annual BTC Needed"
        value={`₿${annualBtcNeeded.toFixed(8)}`}
        description="Per year to reach target"
        tooltip={`Required yearly BTC accumulation over ${yearsUntilRetirement} years to reach your retirement target based on inputs`}
      />

      <MetricCard
        title="Projected BTC Price"
        value={`$${projectedBtcPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
        description="At retirement age"
        tooltip={`Estimated BTC price at age ${calculatorState.retirementAge} based on ${calculatorState.growthRate}% annual growth rate`}
      />

      <MetricCard
        title="Total BTC Holdings"
        value={`₿${totalBtcAtRetirement.toFixed(8)}`}
        description="At retirement age"
        tooltip={`Projected total BTC holdings at age ${calculatorState.retirementAge} based on inputs`}
      />
    </div>
  );
};

export default KeyMetrics;