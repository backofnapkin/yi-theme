import React from 'react';
import { Ruler, Tractor, Info } from 'lucide-react';
import { DecimalInput } from '../../../ui/DecimalInput';
import { Tooltip } from '../../../ui/Tooltip';
import type { MowerSettings as MowerSettingsType } from '../types';

interface Props {
  settings: MowerSettingsType;
  onChange: (settings: MowerSettingsType) => void;
}

// Base speed is ~67 sq ft/min with a 21" push mower
const BASE_SPEED = 66.67;

const MOWER_EFFICIENCY_INFO = {
  'push': { 
    label: (width: number) => `Push Mower (${Math.round(BASE_SPEED * 0.7 * (width/21))} sq ft/min)`, 
    efficiency: 0.7 
  },
  'riding': { 
    label: (width: number) => `Riding Mower (${Math.round(BASE_SPEED * 1.0 * (width/21))} sq ft/min)`, 
    efficiency: 1.0 
  },
  'residential-zero-turn': { 
    label: (width: number) => `Residential Zero Turn (${Math.round(BASE_SPEED * 1.3 * (width/21))} sq ft/min)`, 
    efficiency: 1.3 
  },
  'commercial-zero-turn': { 
    label: (width: number) => `Commercial Zero Turn (${Math.round(BASE_SPEED * 1.5 * (width/21))} sq ft/min)`, 
    efficiency: 1.5 
  }
} as const;

export const MowerSettings: React.FC<Props> = ({ settings, onChange }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Tractor className="w-5 h-5" />
        Mower Settings
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="flex items-center gap-2">
            <DecimalInput
              label={<div className="flex items-center gap-2"><Ruler className="w-4 h-4" />Mower Width</div>}
              value={settings.width}
              onChange={(value) => onChange({ ...settings, width: value })}
              min={15}
              max={100}
              suffix='"'
              step={0.5}
            />
            <Tooltip content="The cutting width of your mower deck. Wider decks cover more area but may be less maneuverable. Range: 15-100 inches.">
              <Info className="w-4 h-4 text-emerald-600 cursor-help" />
            </Tooltip>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Width range: 15" to 100"
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium text-gray-700">
              Mower Type
            </label>
            <Tooltip content="Different mower types have varying efficiency rates. Zero-turn mowers are fastest but push mowers are more maneuverable in tight spaces.">
              <Info className="w-4 h-4 text-emerald-600 cursor-help" />
            </Tooltip>
          </div>
          <div className="mt-1">
            <select
              value={settings.type}
              onChange={(e) => onChange({ ...settings, type: e.target.value as MowerSettingsType['type'] })}
              className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
            >
              {Object.entries(MOWER_EFFICIENCY_INFO).map(([value, info]) => (
                <option key={value} value={value}>
                  {info.label(settings.width)}
                </option>
              ))}
            </select>
            <div className="text-xs text-gray-500 mt-1">
              Current speed: {Math.round(BASE_SPEED * MOWER_EFFICIENCY_INFO[settings.type].efficiency * (settings.width/21))} sq ft per minute
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}