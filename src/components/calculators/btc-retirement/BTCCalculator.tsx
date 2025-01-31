import React, { useState, useEffect } from 'react';
import { Bitcoin } from 'lucide-react';
import { useBitcoinPrice } from './hooks/useBitcoinPrice';
import useRiskAnalysis from './hooks/useRiskAnalysis';
import { Tooltip } from './components/Tooltip';
import PersonalInfo from './PersonalInfo';
import BitcoinHoldings from './BitcoinHoldings';
import RetirementGoals from './RetirementGoals';
import MarketProjections from './MarketProjections';
import KeyMetrics from './outputs/KeyMetrics';
import ProjectionChart from './outputs/ProjectionChart';
import ResultsTable from './outputs/ResultsTable';
import RiskAnalysis from './outputs/RiskAnalysis';
import Disclaimer from './outputs/Disclaimer';

interface CalculatorState {
  currentAge: number;
  lifeExpectancy: number;
  currentBtc: number;
  annualBtcPurchase: number;
  retirementAge: number;
  annualSpend: number;
  growthRate: number;
}

// BTC specific input that preserves decimal precision
const BitcoinAmountInput: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  placeholder?: string;
}> = ({ value, onChange, min, max, className = '', placeholder }) => {
  const [localValue, setLocalValue] = useState(value.toString());
  
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
    if (localValue === '' || localValue === '.') {
      onChange(0);
      setLocalValue('0');
    } else {
      const numValue = parseFloat(localValue);
      if (!isNaN(numValue)) {
        // Preserve up to 8 decimal places for BTC
        const formattedValue = numValue.toFixed(8);
        setLocalValue(formattedValue);
        onChange(parseFloat(formattedValue));
      }
    }
  };

  return (
    <div className="relative rounded-md w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-500 sm:text-sm">₿</span>
      </div>
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`block w-full px-4 py-2 pl-7
          border rounded-lg 
          focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
          outline-none
          transition-shadow
          ${className}`}
        placeholder={placeholder}
        min={min}
        max={max}
      />
    </div>
  );
};

// Regular number input component with improved interaction
const EnhancedNumberInput: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}> = ({ value, onChange, min, max, className = '', prefix, suffix, placeholder }) => {
  const [localValue, setLocalValue] = useState(value.toString());
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Allow empty input during typing
    if (input === '') {
      setLocalValue(input);
      return;
    }

    // Only allow numbers
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
        setLocalValue(numValue.toString());
        onChange(numValue);
      }
    }
  };

  return (
    <div className="relative rounded-md w-full">
      {prefix && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{prefix}</span>
        </div>
      )}
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`block w-full px-4 py-2 
          ${prefix ? 'pl-7' : ''} 
          ${suffix ? 'pr-12' : ''} 
          border rounded-lg 
          focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
          outline-none
          transition-shadow
          ${className}`}
        placeholder={placeholder}
        min={min}
        max={max}
      />
      {suffix && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{suffix}</span>
        </div>
      )}
    </div>
  );
};

export const BTCCalculator = () => {
  const { price: btcPrice, loading, error } = useBitcoinPrice();
  const [useCustomPrice, setUseCustomPrice] = useState(false);
  const [customBtcPrice, setCustomBtcPrice] = useState(0);
  const [showVolatility, setShowVolatility] = useState(false);
  const [showBtcPrice, setShowBtcPrice] = useState(false);

  // Initialize calculator state with default values
  const [calculatorState, setCalculatorState] = useState<CalculatorState>({
    currentAge: 30,
    lifeExpectancy: 85,
    currentBtc: 0.25,
    annualBtcPurchase: 6000,
    retirementAge: 60,
    annualSpend: 100000,
    growthRate: 15,
  });

  // Risk analysis data
  const riskAnalysis = useRiskAnalysis(
    {
      hashRateGrowth: 15,
      activeAddressesGrowth: 20,
      transactionVolumeGrowth: 10,
    },
    {
      inflation: 3,
      gdpGrowth: 2,
      goldCorrelation: -15,
      stockCorrelation: 25,
    },
    showVolatility,
    'moderate'
  );

  // Get the effective BTC price (either custom or live)
  const effectiveBtcPrice = useCustomPrice ? customBtcPrice : (btcPrice || 0);

  // Update functions for each input
  const updatePersonalInfo = (age: number, expectancy: number) => {
    setCalculatorState(prev => ({
      ...prev,
      currentAge: age,
      lifeExpectancy: expectancy,
    }));
  };

  const updateBitcoinHoldings = (current: number, annual: number) => {
    setCalculatorState(prev => ({
      ...prev,
      currentBtc: current,
      annualBtcPurchase: annual,
    }));
  };

  const updateRetirementGoals = (age: number, spend: number) => {
    setCalculatorState(prev => ({
      ...prev,
      retirementAge: age,
      annualSpend: spend,
    }));
  };

  const updateGrowthRate = (rate: number) => {
    setCalculatorState(prev => ({
      ...prev,
      growthRate: rate,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          BTC Retirement Calculator
        </h1>
        <p className="text-gray-600">
          Plan your future with Bitcoin-backed retirement predictions.
        </p>
      </div>

      {/* Input Section */}
      <div className="border border-gray-200 rounded-xl shadow-sm p-6 space-y-8">
        <div className="space-y-8">
          {/* BTC Price Display */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bitcoin className="h-6 w-6 text-gray-700" />
                <h2 className="text-xl font-semibold">Current BTC Price</h2>
                <Tooltip content="Live price data from CoinGecko API." />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={useCustomPrice}
                    onChange={(e) => setUseCustomPrice(e.target.checked)}
                    className="cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">Use custom price</span>
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {!useCustomPrice ? (
                <div className="text-2xl font-bold text-skin-emerald-text">
                  {loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : error ? (
                    <span className="text-red-500">Error loading price</span>
                  ) : (
                    `$${btcPrice?.toLocaleString()}`
                  )}
                </div>
              ) : (
                <EnhancedNumberInput
                  value={customBtcPrice}
                  onChange={setCustomBtcPrice}
                  min={0}
                  prefix="$"
                  suffix="USD"
                  placeholder="Enter BTC price"
                  className="max-w-xs"
                />
              )}
            </div>
          </div>

          <PersonalInfo
            currentAge={calculatorState.currentAge}
            lifeExpectancy={calculatorState.lifeExpectancy}
            onChange={updatePersonalInfo}
          />
          <BitcoinHoldings
            currentBtc={calculatorState.currentBtc}
            annualPurchase={calculatorState.annualBtcPurchase}
            onChange={updateBitcoinHoldings}
          />
          <RetirementGoals
            retirementAge={calculatorState.retirementAge}
            annualSpend={calculatorState.annualSpend}
            onChange={updateRetirementGoals}
          />
          <MarketProjections
            growthRate={calculatorState.growthRate}
            onChange={updateGrowthRate}
          />
        </div>
      </div>

      {/* Output Section */}
      <div className="border border-gray-200 rounded-xl shadow-sm p-6 space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">BTC Retirement Projections</h2>
        
        <KeyMetrics
          calculatorState={calculatorState}
          btcPrice={effectiveBtcPrice}
          riskAnalysis={riskAnalysis}
        />

        {/* Chart Toggles */}
        <div className="flex items-center space-x-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showVolatility}
              onChange={(e) => setShowVolatility(e.target.checked)}
              className="cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700">Show Historical Volatility</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showBtcPrice}
              onChange={(e) => setShowBtcPrice(e.target.checked)}
              className="cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700">Show BTC Price</span>
          </label>
        </div>

        <ProjectionChart
          showVolatility={showVolatility}
          showBtcPrice={showBtcPrice}
          currentAge={calculatorState.currentAge}
          lifeExpectancy={calculatorState.lifeExpectancy}
          retirementAge={calculatorState.retirementAge}
          btcPrice={effectiveBtcPrice}
          growthRate={calculatorState.growthRate}
        />
        <ResultsTable
          calculatorState={calculatorState}
          btcPrice={effectiveBtcPrice}
          riskAnalysis={riskAnalysis}
        />
        <RiskAnalysis />
        <Disclaimer />
      </div>
    </div>
  );
};

export default BTCCalculator;