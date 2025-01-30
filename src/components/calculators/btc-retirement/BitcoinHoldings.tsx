import React from 'react';
import { Wallet } from 'lucide-react';
import { Tooltip } from './components/Tooltip';

interface BitcoinHoldingsProps {
  currentBtc: number;
  annualPurchase: number;
  onChange: (currentBtc: number, annualPurchase: number) => void;
}

const BitcoinHoldings: React.FC<BitcoinHoldingsProps> = ({
  currentBtc,
  annualPurchase,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Wallet className="h-6 w-6 text-gray-700" />
        <h2 className="text-xl font-semibold">Bitcoin Holdings</h2>
        <Tooltip content="Enter your current and planned Bitcoin investments" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            Current BTC Amount
            <Tooltip content="Enter your current Bitcoin holdings" />
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              min="0"
              value={currentBtc}
              onChange={(e) => onChange(parseFloat(e.target.value) || 0, annualPurchase)}
              className="block w-full px-4 py-2 pl-3 pr-12
                       border rounded-lg 
                       focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                       outline-none
                       transition-shadow"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">BTC</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            Annual BTC Purchase (DCA)
            <Tooltip content="Enter your planned yearly Bitcoin investment" />
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              min="0"
              max="99000000"
              value={annualPurchase}
              onChange={(e) => onChange(currentBtc, parseFloat(e.target.value) || 0)}
              className="block w-full px-4 py-2 pl-7 pr-12
                       border rounded-lg 
                       focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                       outline-none
                       transition-shadow"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">USD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitcoinHoldings;