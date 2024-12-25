import React from 'react';
import { DollarSign, MinusCircle, Home } from 'lucide-react';
import type { Asset } from './types';

interface AssetInputProps {
  asset: Asset;
  onUpdate: (id: string, field: 'name' | 'value', value: string | number) => void;
  onRemove: (id: string) => void;
}

export function AssetInput({ asset, onUpdate, onRemove }: AssetInputProps) {
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/,/g, '')) || 0; // Handle commas and ensure numeric input
    onUpdate(asset.id, 'value', value);
  };

  // Determine styles and icons based on asset type
  const isIlliquid = asset.name.toLowerCase().includes('illiquid');
  const isLiability = asset.name.toLowerCase().includes('liability');
  const borderColor = isLiability ? 'border-red-500' : 'border-green-500';
  const backgroundColor = isLiability ? 'bg-red-50' : isIlliquid ? 'bg-green-50' : 'bg-blue-50';

  return (
    <div
      className={`flex flex-col sm:flex-row gap-2 items-center mb-2 p-4 rounded-lg border-2 ${borderColor} ${backgroundColor}`}
    >
      {/* Name Input with Conditional Icon */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {isIlliquid && <Home className="w-5 h-5 text-green-600" />}
        <input
          type="text"
          value={asset.name}
          onChange={(e) => onUpdate(asset.id, 'name', e.target.value)}
          placeholder="Asset name"
          className="flex-1 p-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Dollar Input */}
      <div className="relative flex-1 w-full">
        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={asset.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          onChange={handleValueChange}
          placeholder="0"
          className="w-full pl-10 p-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(asset.id)}
        className="p-2 text-red-500 hover:text-red-700"
        aria-label="Remove asset"
      >
        <MinusCircle className="w-5 h-5" />
      </button>
    </div>
  );
}
