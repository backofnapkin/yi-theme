import React, { useState } from 'react';
import { Calculator, PlusCircle, Coins as CoinsIcon } from 'lucide-react';
import { WealthDescription } from './WealthDescription';
import { AssetInput } from './AssetInput';
import type { Asset } from './types';

export default function WealthCalculator() {
  const [useInflationAdjusted, setUseInflationAdjusted] = useState(false); // Default to non-inflation adjusted
  const [liquidAssets, setLiquidAssets] = useState<Asset[]>([
    { id: '1', name: 'Cash & Bank Accounts', value: 250000 },
    { id: '2', name: 'Stocks & ETFs', value: 500000 },
    { id: '3', name: 'Retirement Accounts', value: 750000 },
    { id: '4', name: 'Cryptocurrency', value: 100000 },
  ]);
  const [illiquidAssets, setIlliquidAssets] = useState<Asset[]>([
    { id: '1', name: 'Primary Residence', value: 1200000 },
    { id: '2', name: 'Investment Properties', value: 800000 },
  ]);
  const [liabilities, setLiabilities] = useState<Asset[]>([
    { id: '1', name: 'Mortgage (Primary)', value: 600000 },
    { id: '2', name: 'Investment Property Loans', value: 400000 },
    { id: '3', name: 'Business Loans', value: 200000 },
  ]);
  const [showResults, setShowResults] = useState(false);

  const addAsset = (type: 'liquid' | 'illiquid' | 'liability') => {
    const newAsset = { id: Date.now().toString(), name: '', value: 0 };
    switch (type) {
      case 'liquid':
        setLiquidAssets([...liquidAssets, newAsset]);
        break;
      case 'illiquid':
        setIlliquidAssets([...illiquidAssets, newAsset]);
        break;
      case 'liability':
        setLiabilities([...liabilities, newAsset]);
        break;
      default:
        break;
    }
  };

  const removeAsset = (id: string, type: 'liquid' | 'illiquid' | 'liability') => {
    switch (type) {
      case 'liquid':
        setLiquidAssets(liquidAssets.filter(asset => asset.id !== id));
        break;
      case 'illiquid':
        setIlliquidAssets(illiquidAssets.filter(asset => asset.id !== id));
        break;
      case 'liability':
        setLiabilities(liabilities.filter(asset => asset.id !== id));
        break;
      default:
        break;
    }
  };

  const updateAsset = (id: string, field: 'name' | 'value', value: string | number, type: 'liquid' | 'illiquid' | 'liability') => {
    const update = (assets: Asset[]) =>
      assets.map(asset =>
        asset.id === id ? { ...asset, [field]: field === 'value' ? Number(value) || 0 : value } : asset
      );

    switch (type) {
      case 'liquid':
        setLiquidAssets(update(liquidAssets));
        break;
      case 'illiquid':
        setIlliquidAssets(update(illiquidAssets));
        break;
      case 'liability':
        setLiabilities(update(liabilities));
        break;
      default:
        break;
    }
  };

  const totalLiquid = liquidAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalIlliquid = illiquidAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.value, 0);
  const netWorth = totalLiquid + totalIlliquid - totalLiabilities;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            Wealth Calculator
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Adjust for Current Inflation</span>
            <div
              className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                useInflationAdjusted ? 'bg-red-600' : 'bg-gray-300'
              }`}
              onClick={() => setUseInflationAdjusted((prev) => !prev)}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow-md transform transition-transform ${
                  useInflationAdjusted ? 'translate-x-5' : ''
                }`}
              ></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Liquid Assets */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-blue-700">
              <CoinsIcon className="w-5 h-5" />
              Liquid Assets
            </h3>
            <div className="space-y-2">
              {liquidAssets.map(asset => (
                <AssetInput
                  key={asset.id}
                  asset={asset}
                  onUpdate={(id, field, value) => updateAsset(id, field, value, 'liquid')}
                  onRemove={(id) => removeAsset(id, 'liquid')}
                />
              ))}
              {liquidAssets.length < 25 && (
                <button
                  onClick={() => addAsset('liquid')}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <PlusCircle className="w-5 h-5" />
                  Add Liquid Asset
                </button>
              )}
            </div>
          </div>

          {/* Illiquid Assets */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-green-700">Illiquid Assets</h3>
            <div className="space-y-2">
              {illiquidAssets.map(asset => (
                <AssetInput
                  key={asset.id}
                  asset={asset}
                  onUpdate={(id, field, value) => updateAsset(id, field, value, 'illiquid')}
                  onRemove={(id) => removeAsset(id, 'illiquid')}
                />
              ))}
              {illiquidAssets.length < 25 && (
                <button
                  onClick={() => addAsset('illiquid')}
                  className="flex items-center gap-2 text-green-600 hover:text-green-800"
                >
                  <PlusCircle className="w-5 h-5" />
                  Add Illiquid Asset
                </button>
              )}
            </div>
          </div>

          {/* Liabilities */}
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-red-700">Liabilities</h3>
            <div className="space-y-2">
              {liabilities.map(liability => (
                <AssetInput
                  key={liability.id}
                  asset={liability}
                  onUpdate={(id, field, value) => updateAsset(id, field, value, 'liability')}
                  onRemove={(id) => removeAsset(id, 'liability')}
                />
              ))}
              <button
                onClick={() => addAsset('liability')}
                className="flex items-center gap-2 text-red-600 hover:text-red-800"
              >
                  <PlusCircle className="w-5 h-5" />
                Add Liability
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowResults(true)}
            className="w-full bg-[rgba(var(--color-text-active))] text-[rgba(var(--color-fill))] py-4 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 border-2 border-[rgba(var(--color-border-active))] shadow-lg hover:shadow-xl hover:scale-[1.02] font-semibold text-lg"
          >
            <Calculator className="w-6 h-6" />
            Calculate My Wealth
          </button>
        </div>
      </div>

      {showResults && (
        <WealthDescription
          netWorth={netWorth}
          liquidAssets={totalLiquid}
          useInflationAdjusted={useInflationAdjusted}
        />
      )}
    </div>
  );
}
