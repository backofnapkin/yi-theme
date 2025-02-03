import React from 'react';
import { Truck } from 'lucide-react';

interface CalculatorHeaderProps {
  businessName: string;
  onBusinessNameChange: (name: string) => void;
}

export function CalculatorHeader({ businessName, onBusinessNameChange }: CalculatorHeaderProps) {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-3">
        <Truck className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">
          Dumpster Rental Business Calculator
        </h1>
      </div>
      <div className="max-w-xl mx-auto">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business Name
        </label>
        <input
          type="text"
          value={businessName}
          onChange={(e) => onBusinessNameChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
          placeholder="Enter your business name"
        />
      </div>
    </div>
  );
}