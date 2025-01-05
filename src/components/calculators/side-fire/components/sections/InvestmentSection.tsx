import React from 'react';
import { TrendingUp, Plus, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { RangeInput } from '../ui/RangeInput';
import { Button } from '../ui/Button';
import { SectionHeader } from './SectionHeader';
import type { CalculatorInputs, InvestedAsset } from '../../types';
import { INVESTMENT_CONSTRAINTS } from '../../constants';

interface InvestmentSectionProps {
  inputs: CalculatorInputs;
  setInputs: React.Dispatch<React.SetStateAction<CalculatorInputs>>;
}

export function InvestmentSection({ inputs, setInputs }: InvestmentSectionProps) {
  const updateInvestment = (id: string, field: keyof InvestedAsset, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      investedAssets: prev.investedAssets.map(asset =>
        asset.id === id ? { ...asset, [field]: value } : asset
      )
    }));
  };

  const addInvestment = () => {
    if (inputs.investedAssets.length < INVESTMENT_CONSTRAINTS.MAX_INVESTMENTS) {
      setInputs(prev => ({
        ...prev,
        investedAssets: [
          ...prev.investedAssets,
          {
            id: String(Date.now()),
            name: `Investment ${prev.investedAssets.length + 1}`,
            amount: 0,
            return: 7
          }
        ]
      }));
    }
  };

  const removeInvestment = (id: string) => {
    setInputs(prev => ({
      ...prev,
      investedAssets: prev.investedAssets.filter(asset => asset.id !== id)
    }));
  };

  return (
    <Card>
      <SectionHeader
        icon={TrendingUp}
        title="Current Investments"
        description="Add your investment accounts and expected returns."
      />
      
      <div className="space-y-4 mt-4">
        {inputs.investedAssets.map((asset) => (
          <div key={asset.id} className="grid md:grid-cols-3 gap-4 p-4 border rounded-lg">
            <Input
              label="Investment Name"
              type="text"
              value={asset.name}
              onChange={(e) => updateInvestment(asset.id, 'name', e.target.value)}
            />

            <Input
              label="Amount Invested"
              type="number"
              prefix="$"
              value={asset.amount}
              onChange={(e) => updateInvestment(asset.id, 'amount', Number(e.target.value))}
            />

            <RangeInput
              label="Expected Annual Return"
              value={asset.return}
              onChange={(value) => updateInvestment(asset.id, 'return', value)}
              min={INVESTMENT_CONSTRAINTS.MIN_RETURN}
              max={INVESTMENT_CONSTRAINTS.MAX_RETURN}
              step={INVESTMENT_CONSTRAINTS.RETURN_STEP}
              tooltip="Expected annual return percentage for this investment"
            />

            {inputs.investedAssets.length > 1 && (
              <button
                onClick={() => removeInvestment(asset.id)}
                className="absolute top-2 right-2 p-1 text-red-600 hover:text-red-700"
                aria-label="Remove investment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}

        {inputs.investedAssets.length < INVESTMENT_CONSTRAINTS.MAX_INVESTMENTS && (
          <Button
            variant="outline"
            icon={Plus}
            onClick={addInvestment}
          >
            Add Investment
          </Button>
        )}
      </div>
    </Card>
  );
}