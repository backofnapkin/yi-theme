import React, { useState } from 'react';
import { Calculator, Info } from 'lucide-react';
import { DecimalInput } from '../../ui/DecimalInput';
import { Tooltip } from '../../ui/Tooltip';
import { BorderContainer } from '../../ui/BorderContainer';
import { InputButton } from '../../ui/InputButton';
import { MowerSettings } from './components/MowerSettings';
import { LawnConditions } from './components/LawnConditions';
import { CrewSettings } from './components/CrewSettings';
import { BlowerSettings } from './components/BlowerSettings';
import { CalculatorResults } from './components/CalculatorResults';
import { calculateLawnService } from './utils/calculations';
import type { 
  MowerSettings as MowerSettingsType,
  LawnConditions as LawnConditionsType,
  BlowerSettings as BlowerSettingsType,
  CrewSettings as CrewSettingsType,
  CalculationResult 
} from './types';

export const LawnMowTimeCalculator = () => {
  const [mowerSettings, setMowerSettings] = useState<MowerSettingsType>({
    width: 21,
    type: 'push'
  });

  const [lawnSize, setLawnSize] = useState(2000);

  const [lawnConditions, setLawnConditions] = useState<LawnConditionsType>({
    trees: 0,
    hasParkway: false,
    hasFlowerBeds: false,
    hasFence: false,
    isOvergrown: false,
    isSloped: false,
    isWet: false,
    hasPetWaste: false,
    hasPlaysets: false,
    hasOther: false
  });

  const [blowerSettings, setBlowerSettings] = useState<BlowerSettingsType>({
    type: 'backpack'
  });

  const [crewSettings, setCrewSettings] = useState<CrewSettingsType>({
    size: 1,
    hourlyRate: 90
  });

  const [results, setResults] = useState<CalculationResult | null>(null);

  const handleCalculate = () => {
    const calculationResults = calculateLawnService(
      mowerSettings,
      lawnSize,
      lawnConditions,
      blowerSettings,
      crewSettings
    );
    setResults(calculationResults);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Calculator className="w-8 h-8" />
          Lawn Mowing Time Estimator
        </h1>
        <p className="text-gray-600 mt-2">
          Calculate accurate time estimates for professional lawn care services
        </p>
      </div>

      <BorderContainer className="space-y-6">
        <MowerSettings
          settings={mowerSettings}
          onChange={setMowerSettings}
        />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DecimalInput
              label="Lawn Size"
              value={lawnSize}
              onChange={setLawnSize}
              min={0}
              step={100}
              suffix=" sq ft"
            />
            <Tooltip content="Total area of the lawn to be mowed, including all sections. Measure length × width for rectangular areas.">
              <Info className="w-4 h-4 text-emerald-600 cursor-help" />
            </Tooltip>
          </div>
        </div>

        <LawnConditions
          conditions={lawnConditions}
          onChange={setLawnConditions}
        />

        <BlowerSettings
          settings={blowerSettings}
          onChange={setBlowerSettings}
        />

        <CrewSettings
          settings={crewSettings}
          onChange={setCrewSettings}
        />

        <InputButton
          onClick={handleCalculate}
          className="w-full"
        >
          Calculate Mowing Time
        </InputButton>
      </BorderContainer>

      {results && (
        <BorderContainer>
          <CalculatorResults results={results} hourlyRate={crewSettings.hourlyRate} />
        </BorderContainer>
      )}
    </div>
  );
}

export default LawnMowTimeCalculator;