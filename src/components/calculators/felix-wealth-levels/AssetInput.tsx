import React from 'react';
import { DollarSign, MinusCircle } from 'lucide-react';
import { formatNumber, parseFormattedNumber } from '../../../utils/calculators/felix-wealth-levels/calculations';
import type { Asset } from './types';

interface AssetInputProps {
  asset: Asset;
  onUpdate: (id: string, field: 'name' | 'value', value: string | number) => void;
  onRemove: (id: string) => void;
}

export function AssetInput({ asset, onUpdate, onRemove }: AssetInputProps) {
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFormattedNumber(e.target.value);
    onUpdate(asset.id, 'value', value);
  };

  return (
    <div className="flex gap-2 mb-2">
      <input
        type="text"
        value={asset.name}
        onChange={(e) => onUpdate(asset.id, 'name', e.target.value)}
        placeholder="Asset name"
        className="flex-1 p-2 border rounded"
      />
      <div className="relative flex-1">
        <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={formatNumber(asset.value)}
          onChange={handleValueChange}
          placeholder="0"
          className="w-full p-2 pl-8 border rounded"
        />
      </div>
      <button
        onClick={() => onRemove(asset.id)}
        className="p-2 text-red-500 hover:text-red-700"
      >
        <MinusCircle className="w-5 h-5" />
      </button>
    </div>
  );
}