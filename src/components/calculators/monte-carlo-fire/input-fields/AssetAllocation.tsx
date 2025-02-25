import React, { useState } from 'react';
import { Info, X, ChevronDown, ChevronUp, PieChart, Percent, TrendingUp, BarChart4, DollarSign, LineChart, Scale, AlertTriangle } from 'lucide-react';
import type { Asset } from '../types';

interface AssetAllocationProps {
  assets: Asset[];
  errors: Record<string, string>;
  onAssetChange: (index: number, field: keyof Asset, value: any) => void;
  onRemoveAsset: (index: number) => void;
  onAddAsset: () => void;
}

const AssetAllocation: React.FC<AssetAllocationProps> = ({
  assets,
  errors,
  onAssetChange,
  onRemoveAsset,
  onAddAsset,
}) => {
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);

  const inputClasses = (field: string) => `
  w-full px-4 py-2 text-sm
  border rounded-lg
  ${errors[field] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'}
  hover:border-emerald-200
  transition-shadow duration-200
  focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:border-2
  disabled:bg-gray-100 disabled:cursor-not-allowed
`;

  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold">Asset Allocation</h2>
        </div>
        <div className="text-sm text-gray-500">
          Total: {assets.reduce((sum, asset) => sum + asset.percentage, 0)}%
        </div>
      </div>

      <div className="space-y-4">
        {/* Asset Rows */}
        <div className="space-y-4">
          {assets.map((asset, index) => (
            <div 
              key={index} 
              className="relative bg-gray-50 rounded-lg overflow-visible p-4"
            >
              {/* Remove Button */}
              <button
                onClick={() => onRemoveAsset(index)}
                className="asset-allocation-remove-btn absolute top-2 right-2 p-1.5 bg-red-600 border border-solid border-red-700 hover:bg-red-700 hover:border-red-800 text-white rounded-full shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                title="Remove asset"
              >
                <X className="w-3 h-3 text-white" />
              </button>

              <div className="space-y-3">
                {/* First Row: Asset Name and Portfolio Allocation */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Asset Name</label>
                    <input
                      type="text"
                      value={asset.name}
                      onChange={e => onAssetChange(index, 'name', e.target.value)}
                      placeholder="e.g., Stocks, Bonds"
                      className={inputClasses(`assetName${index}`)}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      Portfolio Allocation
                      <span className="text-gray-500 ml-1">(%)</span>
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={asset.percentage || ''}
                      onChange={e => {
                        const value = e.target.value.replace(/[^\d.]/g, '');
                        if (/^\d*\.?\d*$/.test(value)) {
                          onAssetChange(index, 'percentage', parseFloat(value) || '');
                        }
                      }}
                      onWheel={e => e.currentTarget.blur()}
                      className={inputClasses(`assetPercentage${index}`)}
                    />
                  </div>
                </div>

                {/* Second Row: Annual Return and Volatility */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Annual Return (%)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={asset.expectedReturn || ''}
                      onChange={e => {
                        const value = e.target.value.replace(/[^\d.]/g, '');
                        if (/^\d*\.?\d*$/.test(value)) {
                          onAssetChange(index, 'expectedReturn', parseFloat(value) || '');
                        }
                      }}
                      onWheel={e => e.currentTarget.blur()}
                      className={inputClasses(`assetReturn${index}`)}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Volatility (%)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={asset.volatility || ''}
                      onChange={e => {
                        const value = e.target.value.replace(/[^\d.]/g, '');
                        if (/^\d*\.?\d*$/.test(value)) {
                          onAssetChange(index, 'volatility', parseFloat(value) || '');
                        }
                      }}
                      onWheel={e => e.currentTarget.blur()}
                      className={inputClasses(`assetVolatility${index}`)}
                    />
                  </div>
                </div>
              </div>

              {/* Error Messages */}
              {errors[`assetName${index}`] && (
                <p className="mt-2 text-sm text-red-600">{errors[`assetName${index}`]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Add Asset Button */}
        {assets.length < 5 && (
          <button
            onClick={onAddAsset}
            className="w-full md:w-auto mt-4 px-4 py-2 text-sm text-emerald-600 hover:text-emerald-800 border border-emerald-600 hover:border-emerald-800 rounded-lg transition-colors duration-200"
          >
            + Add Asset Class
          </button>
        )}

        {/* Allocation Error */}
        {errors.assetAllocation && (
          <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
            {errors.assetAllocation}
          </p>
        )}

        {/* Collapsible Guidelines Section */}
        <div className="mt-6">
          <button
            onClick={() => setIsGuidelinesOpen(!isGuidelinesOpen)}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-lg text-emerald-800 hover:bg-emerald-100 transition-colors duration-200 border border-emerald-200"
          >
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              <span className="font-medium">Asset Allocation Guidelines</span>
            </div>
            {isGuidelinesOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          <div
            className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
              isGuidelinesOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-gradient-to-br from-emerald-50 to-purple-50 p-6 rounded-lg text-sm shadow-sm border border-emerald-100">
              <div className="space-y-6">
                {/* Portfolio Allocation Section */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-emerald-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Percent className="w-5 h-5 text-emerald-600" />
                    <p className="font-semibold text-emerald-800">Portfolio Allocation:</p>
                  </div>
                  <ul className="space-y-2 ml-7">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 mt-1.5 mr-2 bg-emerald-600 rounded-full"></span>
                      <span>Represents what percentage of your total portfolio is invested in each asset</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 mt-1.5 mr-2 bg-emerald-600 rounded-full"></span>
                      <span>Must sum to exactly 100% across all assets</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 mt-1.5 mr-2 bg-emerald-600 rounded-full"></span>
                      <span className="italic">Example: 60% Stocks, 20% Bonds, 15% Cash, 5% Crypto</span>
                    </li>
                  </ul>
                </div>

                {/* Expected Annual Return Section */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-emerald-100">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <p className="font-semibold text-emerald-800">Expected Annual Return:</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-2">
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 p-3 rounded-md flex items-center">
                      <DollarSign className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" />
                      <span>Stocks: Typically 8-12% <br/><span className="text-xs text-gray-600">(higher risk, higher return)</span></span>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 p-3 rounded-md flex items-center">
                      <LineChart className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" />
                      <span>Bonds: Usually 3-6% <br/><span className="text-xs text-gray-600">(moderate risk and return)</span></span>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 p-3 rounded-md flex items-center">
                      <Scale className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" />
                      <span>Cash/Money Market: 1-3% <br/><span className="text-xs text-gray-600">(low risk, low return)</span></span>
                    </div>
                    <div className="bg-gradient-to-r from-amber-50 to-amber-50 p-3 rounded-md flex items-center">
                      <AlertTriangle className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0" />
                      <span className="text-amber-700">Cryptocurrency: 10-20% <br/><span className="text-xs text-amber-600">(high risk)</span></span>
                    </div>
                  </div>
                </div>

                {/* Volatility (Risk) Section */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-emerald-100">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart4 className="w-5 h-5 text-emerald-600" />
                    <p className="font-semibold text-emerald-800">Volatility (Risk):</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-2">
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 p-3 rounded-md border-l-4 border-emerald-600">
                      <div className="flex justify-between">
                        <span className="font-medium">Stocks</span>
                        <span className="text-emerald-600 font-medium">15-20%</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">High volatility</div>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 p-3 rounded-md border-l-4 border-emerald-600">
                      <div className="flex justify-between">
                        <span className="font-medium">Bonds</span>
                        <span className="text-emerald-600 font-medium">5-10%</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Moderate volatility</div>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 p-3 rounded-md border-l-4 border-emerald-600">
                      <div className="flex justify-between">
                        <span className="font-medium">Cash</span>
                        <span className="text-emerald-600 font-medium">1-2%</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Very low volatility</div>
                    </div>
                    <div className="bg-gradient-to-r from-amber-50 to-amber-50 p-3 rounded-md border-l-4 border-amber-600">
                      <div className="flex justify-between">
                        <span className="font-medium text-amber-700">Cryptocurrency</span>
                        <span className="text-amber-600 font-medium">50-100%</span>
                      </div>
                      <div className="text-xs text-amber-600 mt-1">Extreme volatility</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssetAllocation;