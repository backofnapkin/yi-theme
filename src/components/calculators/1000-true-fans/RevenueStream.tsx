import React from 'react';
import { Trash2 } from 'lucide-react';
import { NumberInput } from './NumberInput';

interface RevenueStreamProps {
  id: string;
  name: string;
  revenue: number;
  onUpdate: (id: string, field: 'name' | 'revenue', value: string | number) => void;
  onDelete: (id: string) => void;
}

export const RevenueStream: React.FC<RevenueStreamProps> = ({
  id,
  name,
  revenue,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="flex gap-4 items-center mb-4">
      <div className="flex-1">
        <input
          type="text"
          value={name}
          onChange={(e) => onUpdate(id, 'name', e.target.value)}
          placeholder="Revenue Stream Name"
          className="w-full px-4 py-2 rounded-lg border border-skin-base focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-skin-fill"
        />
      </div>
      <div className="flex-1">
        <NumberInput
          value={revenue}
          onChange={(value) => onUpdate(id, 'revenue', value)}
          placeholder="0"
          prefix="$"
        />
      </div>
      <button
        onClick={() => onDelete(id)}
        className="p-2 text-skin-red-text hover:text-red-600 transition-colors"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};