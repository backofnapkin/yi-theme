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

  // Handle custom price change
  const handleCustomPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(e.target.value);
    setCustomBtcPrice(isNaN(price) ? 0 : price);
  };

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
                  <style>
                    {`
                      input[type="checkbox"] {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 16px;
                        height: 16px;
                        border: 2px solid rgb(229, 231, 235); /* gray-200 */
                        border-radius: 4px;
                        outline: none;
                        cursor: pointer;
                        position: relative;
                        margin-right: 8px;
                      }

                      input[type="checkbox"]:checked {
                        border-color: rgb(5, 150, 105); /* emerald-600 */
                        background-color: rgb(5, 150, 105); /* emerald-600 */
                        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
                      }

                      input[type="checkbox"]:focus {
                        outline: none;
                        border-color: rgb(5, 150, 105); /* emerald-600 */
                        box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2);
                      }
                    `}
                  </style>
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
                <div className="relative rounded-md w-full max-w-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    value={customBtcPrice || ''}
                    onChange={handleCustomPriceChange}
                    className="block w-full px-4 py-2 pl-7 pr-12 
                              border rounded-lg 
                              focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                              outline-none
                              transition-shadow"
                    placeholder="Enter BTC price"
                    min="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">USD</span>
                  </div>
                </div>
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
            <style>
              {`
                input[type="checkbox"] {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 16px;
                  height: 16px;
                  border: 2px solid rgb(229, 231, 235); /* gray-200 */
                  border-radius: 4px;
                  outline: none;
                  cursor: pointer;
                  position: relative;
                  margin-right: 8px;
                }

                input[type="checkbox"]:checked {
                  border-color: rgb(5, 150, 105); /* emerald-600 */
                  background-color: rgb(5, 150, 105); /* emerald-600 */
                  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
                }

                input[type="checkbox"]:focus {
                  outline: none;
                  border-color: rgb(5, 150, 105); /* emerald-600 */
                  box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2);
                }
              `}
            </style>
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