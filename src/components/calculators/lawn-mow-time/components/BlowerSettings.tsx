import React from 'react';
import { Wind, Info } from 'lucide-react';
import { Tooltip } from '../../../ui/Tooltip';
import type { BlowerSettings as BlowerSettingsType } from '../types';

interface Props {
  settings: BlowerSettingsType;
  onChange: (settings: BlowerSettingsType) => void;
}

const BLOWER_EFFICIENCY_INFO = {
  'backpack': { label: 'Backpack Blower (3 min per 1,000 sq ft)', time: 3 },
  'handheld': { label: 'Hand Held Blower (10 min per 1,000 sq ft)', time: 10 },
  'manual': { label: 'Manual Raking (60 min per 1,000 sq ft)', time: 60 }
} as const;

export const BlowerSettings: React.FC<Props> = ({ settings, onChange }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Wind className="w-5 h-5" />
        Blower Settings
        <Tooltip content="Choose your cleanup method. Backpack blowers are most efficient, while manual raking takes longer but may be necessary for wet conditions.">
          <Info className="w-4 h-4 text-emerald-600 cursor-help" />
        </Tooltip>
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Blower Type
        </label>
        <div className="mt-1">
          <select
            value={settings.type}
            onChange={(e) => onChange({ type: e.target.value as BlowerSettingsType['type'] })}
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
          >
            {Object.entries(BLOWER_EFFICIENCY_INFO).map(([value, info]) => (
              <option key={value} value={value}>
                {info.label}
              </option>
            ))}
          </select>
          <div className="text-xs text-gray-500 mt-1">
            Current cleanup speed: {BLOWER_EFFICIENCY_INFO[settings.type].time} minutes per 1,000 sq ft
          </div>
        </div>
      </div>
    </div>
  );
}