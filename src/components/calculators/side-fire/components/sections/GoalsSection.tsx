import React from 'react';
import { Target } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { RangeInput } from '../ui/RangeInput';
import { SectionHeader } from './SectionHeader';
import type { CalculatorInputs } from '../../types';
import { AGE_CONSTRAINTS, RATE_CONSTRAINTS } from '../../constants';

interface GoalsSectionProps {
  inputs: CalculatorInputs;
  setInputs: React.Dispatch<React.SetStateAction<CalculatorInputs>>;
}

export function GoalsSection({ inputs, setInputs }: GoalsSectionProps) {
  return (
    <Card>
      <SectionHeader
        icon={Target}
        title="Goals & Timeline"
        description="Set your financial independence targets and timeline"
      />
      
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Input
          label="Total Invested Assets Goal"
          tooltip="The total $ amount you'd like to reach in investment assets."
          type="number"
          prefix="$"
          value={inputs.totalInvestedAssetsGoal}
          onChange={(e) => setInputs(prev => ({
            ...prev,
            totalInvestedAssetsGoal: Number(e.target.value)
          }))}
        />

        <Input
          label="Annual Spending Now"
          tooltip="Your current annual living expenses / spending."
          type="number"
          prefix="$"
          value={inputs.annualSpend}
          onChange={(e) => setInputs(prev => ({
            ...prev,
            annualSpend: Number(e.target.value)
          }))}
        />

        <Input
          label="Retirement Annual Spending"
          tooltip="Expected annual spending in retirement."
          type="number"
          prefix="$"
          value={inputs.retirementSpend}
          onChange={(e) => setInputs(prev => ({
            ...prev,
            retirementSpend: Number(e.target.value)
          }))}
        />

        <Input
          label="Current Age"
          tooltip="Your current age in years."
          type="number"
          min={AGE_CONSTRAINTS.MIN_AGE}
          max={AGE_CONSTRAINTS.MAX_AGE}
          value={inputs.currentAge}
          onChange={(e) => setInputs(prev => ({
            ...prev,
            currentAge: Number(e.target.value)
          }))}
        />

        <Input
          label="Target FIRE Age"
          tooltip="Age you want to achieve financial independence."
          type="number"
          min={AGE_CONSTRAINTS.MIN_RETIREMENT_AGE}
          max={AGE_CONSTRAINTS.MAX_AGE}
          value={inputs.fireAge}
          onChange={(e) => setInputs(prev => ({
            ...prev,
            fireAge: Number(e.target.value)
          }))}
        />

        <RangeInput
          label="Inflation Rate"
          tooltip="Expected annual inflation rate"
          value={inputs.inflationRate}
          onChange={(value) => setInputs(prev => ({
            ...prev,
            inflationRate: value
          }))}
          min={RATE_CONSTRAINTS.MIN_INFLATION}
          max={RATE_CONSTRAINTS.MAX_INFLATION}
          step={RATE_CONSTRAINTS.INFLATION_STEP}
        />
      </div>
    </Card>
  );
}