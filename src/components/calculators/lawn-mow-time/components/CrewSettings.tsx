import React from 'react';
import { Users, DollarSign, Info } from 'lucide-react';
import { DecimalInput } from '../../../ui/DecimalInput';
import { Tooltip } from '../../../ui/Tooltip';
import type { CrewSettings as CrewSettingsType } from '../types';

interface Props {
  settings: CrewSettingsType;
  onChange: (settings: CrewSettingsType) => void;
}

const CREW_EFFICIENCY_INFO = {
  1: { label: '1 Person (No time reduction)', reduction: 0 },
  2: { label: '2 People (45% time reduction)', reduction: 45 },
  3: { label: '3 People (65% time reduction)', reduction: 65 },
  4: { label: '4 People (75% time reduction)', reduction: 75 }
} as const;

export const CrewSettings: React.FC<Props> = ({ settings, onChange }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Users className="w-5 h-5" />
        Crew Settings
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium text-gray-700">
              Crew Size
            </label>
            <Tooltip content="Larger crews reduce total job time through efficiency gains. Two people are 45% faster than one, three are 65% faster, and four are 75% faster.">
              <Info className="w-4 h-4 text-emerald-600 cursor-help" />
            </Tooltip>
          </div>
          <div className="mt-1">
            <select
              value={settings.size}
              onChange={(e) => onChange({ ...settings, size: Number(e.target.value) as CrewSettingsType['size'] })}
              className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
            >
              {Object.entries(CREW_EFFICIENCY_INFO).map(([value, info]) => (
                <option key={value} value={value}>
                  {info.label}
                </option>
              ))}
            </select>
            <div className="text-xs text-gray-500 mt-1">
              {settings.size > 1 ? (
                <>Reduces total work time by {CREW_EFFICIENCY_INFO[settings.size].reduction}%</>
              ) : (
                'Base time calculation'
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <DecimalInput
              label={<div className="flex items-center gap-2"><DollarSign className="w-4 h-4" />Hourly Rate (per person)</div>}
              value={settings.hourlyRate}
              onChange={(value) => onChange({ ...settings, hourlyRate: value })}
              min={0}
              step={0.5}
              prefix="$"
            />
            <Tooltip content="The hourly rate charged per crew member. Total cost will be multiplied by the number of crew members.">
              <Info className="w-4 h-4 text-emerald-600 cursor-help" />
            </Tooltip>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Total hourly cost: ${(settings.hourlyRate * settings.size).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}