import React from 'react';
import { DollarSign } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { SectionHeader } from './SectionHeader';
import type { CalculatorInputs } from '../../types';
import { RATE_CONSTRAINTS } from '../../constants';

interface IncomeSectionProps {
  inputs: CalculatorInputs;
  setInputs: React.Dispatch<React.SetStateAction<CalculatorInputs>>;
}

export function IncomeSection({ inputs, setInputs }: IncomeSectionProps) {
  return (
    <Card>
      <SectionHeader
        icon={DollarSign}
        title="Income & Savings"
        description="Enter your income sources and savings rates."
      />
      
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Input
          label="Annual Side Hustle Income"
          tooltip="Your total annual income from side hustles before taxes."
          type="number"
          prefix="$"
          value={inputs.sideHustleIncome}
          onChange={(e) => setInputs(prev => ({
            ...prev,
            sideHustleIncome: Number(e.target.value)
          }))}
        />

        <Input
          label="Side Hustle Savings Rate"
          tooltip="Percentage of side hustle income you'll save and invest."
          type="number"
          suffix="%"
          min={RATE_CONSTRAINTS.MIN_RATE}
          max={RATE_CONSTRAINTS.MAX_RATE}
          value={inputs.sideHustleSavingsRate}
          onChange={(e) => setInputs(prev => ({
            ...prev,
            sideHustleSavingsRate: Number(e.target.value)
          }))}
        />

        <Input
          label="Annual Main Job Income"
          tooltip="Your primary job's annual income before taxes."
          type="number"
          prefix="$"
          value={inputs.mainJobIncome}
          onChange={(e) => setInputs(prev => ({
            ...prev,
            mainJobIncome: Number(e.target.value)
          }))}
        />

        <Input
          label="Main Job Savings Rate"
          tooltip="Percentage of main job income you'll save and invest."
          type="number"
          suffix="%"
          min={RATE_CONSTRAINTS.MIN_RATE}
          max={RATE_CONSTRAINTS.MAX_RATE}
          value={inputs.mainJobSavingsRate}
          onChange={(e) => setInputs(prev => ({
            ...prev,
            mainJobSavingsRate: Number(e.target.value)
          }))}
        />
      </div>
    </Card>
  );
}