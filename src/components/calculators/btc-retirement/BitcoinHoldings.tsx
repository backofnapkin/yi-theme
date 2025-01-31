import React from 'react';
import { Wallet } from 'lucide-react';
import { Tooltip } from './components/Tooltip';

interface BitcoinHoldingsProps {
  currentBtc: number;
  annualPurchase: number;
  onChange: (currentBtc: number, annualPurchase: number) => void;
}

// Bitcoin amount input with decimal precision
const BitcoinAmountInput: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}> = ({ value, onChange, min = 0, max }) => {
  const [localValue, setLocalValue] = React.useState(value.toString());
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Allow empty input and single decimal point during typing
    if (input === '' || input === '.') {
      setLocalValue(input);
      return;
    }

    // Allow numbers and one decimal point
    if (!/^\d*\.?\d*$/.test(input)) {
      return;
    }

    setLocalValue(input);
    
    const numValue = parseFloat(input);
    if (!isNaN(numValue)) {
      if (max !== undefined && numValue > max) {
        onChange(max);
        setLocalValue(max.toFixed(8));
      } else if (min !== undefined && numValue < min) {
        onChange(min);
        setLocalValue(min.toFixed(8));
      } else {
        onChange(numValue);
      }
    }
  };

  const handleBlur = () => {
    if (localValue === '' || localValue === '.') {
      onChange(0);
      setLocalValue('0');
    } else {
      const numValue = parseFloat(localValue);
      if (!isNaN(numValue)) {
        // Format to 8 decimal places for BTC
        const formattedValue = numValue.toFixed(8);
        setLocalValue(formattedValue);
        onChange(parseFloat(formattedValue));
      }
    }
  };

  return (
    <div className="relative rounded-md shadow-sm">
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
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
  );
};

// USD amount input for annual purchase
const CurrencyInput: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}> = ({ value, onChange, min = 0, max }) => {
  const [localValue, setLocalValue] = React.useState(value.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Allow empty input during typing
    if (input === '') {
      setLocalValue(input);
      return;
    }

    // Only allow whole numbers for USD
    if (!/^\d*$/.test(input)) {
      return;
    }

    setLocalValue(input);
    
    const numValue = parseInt(input, 10);
    if (!isNaN(numValue)) {
      if (max !== undefined && numValue > max) {
        onChange(max);
        setLocalValue(max.toString());
      } else if (min !== undefined && numValue < min) {
        onChange(min);
        setLocalValue(min.toString());
      } else {
        onChange(numValue);
      }
    }
  };

  const handleBlur = () => {
    if (localValue === '') {
      onChange(0);
      setLocalValue('0');
    } else {
      const numValue = parseInt(localValue, 10);
      if (!isNaN(numValue)) {
        if (numValue < min) {
          onChange(min);
          setLocalValue(min.toString());
        } else if (max !== undefined && numValue > max) {
          onChange(max);
          setLocalValue(max.toString());
        } else {
          setLocalValue(numValue.toString());
          onChange(numValue);
        }
      }
    }
  };

  return (
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-500 sm:text-sm">$</span>
      </div>
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
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
  );
};

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
          <div className="mt-1">
            <BitcoinAmountInput
              value={currentBtc}
              onChange={(value) => onChange(value, annualPurchase)}
              min={0}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            Annual BTC Purchase (DCA)
            <Tooltip content="Enter your planned yearly Bitcoin investment" />
          </label>
          <div className="mt-1">
            <CurrencyInput
              value={annualPurchase}
              onChange={(value) => onChange(currentBtc, value)}
              min={0}
              max={99000000}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitcoinHoldings;