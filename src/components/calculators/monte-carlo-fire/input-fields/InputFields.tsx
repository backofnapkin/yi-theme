import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { Asset, FinancialInputs } from '../types';
import { 
  RotateCcw, 
  PlayCircle,
  User,
  Wallet,
  Settings2,
} from 'lucide-react';
import pkg from 'lodash';
const { debounce } = pkg;
import AssetAllocation from './AssetAllocation';
import { BorderContainer } from '../../../ui/BorderContainer';

interface InputFieldsProps {
  onCalculate: (inputs: FinancialInputs) => void;
}

interface TooltipProps {
  content: string | React.ReactNode;
  children?: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const updateTooltipPosition = () => {
      if (!tooltipRef.current || !triggerRef.current) return;

      const tooltip = tooltipRef.current;
      const tooltipRect = tooltip.getBoundingClientRect();

      tooltip.style.left = '50%';
      tooltip.style.transform = 'translateX(-50%)';

      const updatedTooltipRect = tooltip.getBoundingClientRect();

      if (updatedTooltipRect.right > window.innerWidth) {
        const overflow = updatedTooltipRect.right - window.innerWidth;
        tooltip.style.left = `calc(50% - ${overflow + 8}px)`;
      }

      if (updatedTooltipRect.left < 0) {
        tooltip.style.left = `calc(50% - ${updatedTooltipRect.left - 8}px)`;
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', updateTooltipPosition);
    window.addEventListener('scroll', updateTooltipPosition);

    if (isOpen) {
      updateTooltipPosition();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updateTooltipPosition);
      window.removeEventListener('scroll', updateTooltipPosition);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block ml-2" ref={triggerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center cursor-pointer">
        <span className="text-gray-400 hover:text-gray-600">ⓘ</span>
      </div>
      {isOpen && (
        <div
          ref={tooltipRef}
          className="absolute z-50 w-64 p-4 mt-2 text-sm rounded-lg shadow-lg"
          style={{ 
            backgroundColor: 'rgb(251, 251, 251)',
            border: '1px solid rgb(104, 157, 106)',
            color: 'rgb(80, 73, 69)',
            transform: 'translateX(-50%)',
            left: '50%',
            maxWidth: 'calc(100vw - 32px)'
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

const DEFAULT_INPUTS: FinancialInputs = {
  currentAge: 30,
  retirementAge: 65,
  retirementLength: 30,
  currentInvestments: 100000,
  monthlyInvestments: 2000,
  retirementAnnualSpend: 60000,
  assetAllocation: [
    { name: 'Stocks', percentage: 70, expectedReturn: 10, volatility: 15 },
    { name: 'Bonds', percentage: 25, expectedReturn: 5, volatility: 5 },
    { name: 'Cash', percentage: 5, expectedReturn: 2, volatility: 1 },
  ],
  inflationRate: 2.5,
  taxRate: 25,
  investmentFees: 0.25,
  simulationCount: 1000,
  rebalancingFrequency: "annual"
};

const InputFields: React.FC<InputFieldsProps> = ({ onCalculate }) => {
  const [inputs, setInputs] = useState<FinancialInputs>(DEFAULT_INPUTS);
  const [retirementAgeInput, setRetirementAgeInput] = useState<string>(DEFAULT_INPUTS.retirementAge.toString());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateInputs = useCallback(() => {
    const newErrors: Record<string, string> = {};
    const retirementAgeNum = parseInt(retirementAgeInput, 10) || inputs.retirementAge;

    console.log('Validating:', {
      currentAge: inputs.currentAge,
      retirementAgeInput: retirementAgeInput,
      retirementAgeNum: retirementAgeNum,
    });

    // Only validate retirement age if the input is not empty and is a valid number
    if (retirementAgeInput !== '' && !isNaN(retirementAgeNum) && retirementAgeNum <= inputs.currentAge) {
      newErrors.retirementAge = 'Retirement age must be greater than current age';
    }

    if (inputs.currentAge < 0) newErrors.currentAge = 'Current age cannot be negative';
    if (retirementAgeNum < 0) newErrors.retirementAge = 'Retirement age cannot be negative';
    if (inputs.retirementLength <= 0) newErrors.retirementLength = 'Retirement length must be positive';

    const totalAllocation = inputs.assetAllocation.reduce((sum, asset) => sum + asset.percentage, 0);
    if (Math.abs(totalAllocation - 100) > 0.01) {
      newErrors.assetAllocation = 'Asset allocation must sum to 100%';
    }

    const assetNames = new Set();
    inputs.assetAllocation.forEach((asset, index) => {
      if (!asset.name.trim()) {
        newErrors[`assetName${index}`] = 'Asset name is required';
      } else if (assetNames.has(asset.name.trim().toLowerCase())) {
        newErrors[`assetName${index}`] = 'Asset names must be unique';
      }
      assetNames.add(asset.name.trim().toLowerCase());
    });

    console.log('Validation result:', { errors: newErrors });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [inputs, retirementAgeInput]);

  const debouncedValidate = debounce(validateInputs, 300);

  const handleInputChange = (field: keyof FinancialInputs, value: string) => {
    console.log(`Input change - Field: ${field}, Value: ${value}`);
    if (field === 'retirementAge') {
      setRetirementAgeInput(value);
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue)) {
        setInputs(prev => ({ ...prev, retirementAge: numericValue }));
      }
    } else {
      const numericValue = parseFloat(value) || 0;
      setInputs(prev => ({ ...prev, [field]: numericValue }));
      debouncedValidate();
    }
  };

  const handleRetirementAgeBlur = () => {
    const numericValue = parseInt(retirementAgeInput, 10);
    console.log('Retirement age blur:', { input: retirementAgeInput, parsed: numericValue });
    if (retirementAgeInput === '' || isNaN(numericValue)) {
      const defaultValue = Math.max(inputs.currentAge + 1, 65);
      setRetirementAgeInput(defaultValue.toString());
      setInputs(prev => ({ ...prev, retirementAge: defaultValue }));
    } else {
      setInputs(prev => ({ ...prev, retirementAge: numericValue }));
    }
    debouncedValidate();
  };

  const handleAssetAllocationChange = (index: number, field: keyof Asset, value: any) => {
    setInputs(prev => ({
      ...prev,
      assetAllocation: prev.assetAllocation.map((asset, i) =>
        i === index ? { ...asset, [field]: field === 'name' ? value : parseFloat(value) || 0 } : asset
      ),
    }));
    debouncedValidate();
  };

  const handleAddAsset = () => {
    if (inputs.assetAllocation.length < 5) {
      setInputs(prev => ({
        ...prev,
        assetAllocation: [
          ...prev.assetAllocation,
          { name: '', percentage: 0, expectedReturn: 5, volatility: 5 },
        ],
      }));
    }
  };

  const handleRemoveAsset = (index: number) => {
    if (inputs.assetAllocation.length > 1) {
      setInputs(prev => ({
        ...prev,
        assetAllocation: prev.assetAllocation.filter((_, i) => i !== index),
      }));
      debouncedValidate();
    }
  };

  const handleCalculate = () => {
    const finalInputs = {
      ...inputs,
      retirementAge: parseInt(retirementAgeInput, 10) || inputs.retirementAge,
    };
    console.log('Submitting inputs:', finalInputs);
    if (validateInputs()) {
      onCalculate(finalInputs);
    }
  };

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setRetirementAgeInput(DEFAULT_INPUTS.retirementAge.toString());
    setErrors({});
  };

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BorderContainer>
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold">Personal Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>
                Current Age
                <Tooltip content="Your current age in years. This is the starting point for all calculations." />
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={inputs.currentAge}
                onChange={e => handleInputChange('currentAge', e.target.value.replace(/[^\d]/g, ''))}
                onWheel={e => e.currentTarget.blur()}
                className={inputClasses('currentAge')}
                placeholder="30"
              />
              {errors.currentAge && (
                <p className="mt-1 text-sm text-red-600">{errors.currentAge}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                Retirement Age
                <Tooltip content="The age at which you plan to retire and start withdrawing from your portfolio." />
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={retirementAgeInput}
                onChange={e => handleInputChange('retirementAge', e.target.value.replace(/[^\d]/g, ''))}
                onBlur={handleRetirementAgeBlur}
                onWheel={e => e.currentTarget.blur()}
                className={inputClasses('retirementAge')}
                placeholder="65"
              />
              {errors.retirementAge && (
                <p className="mt-1 text-sm text-red-600">{errors.retirementAge}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                Retirement Length (years)
                <Tooltip content="How many years you expect to be in retirement. Consider factors like family health history and lifestyle." />
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={inputs.retirementLength}
                onChange={e => handleInputChange('retirementLength', e.target.value.replace(/[^\d]/g, ''))}
                onWheel={e => e.currentTarget.blur()}
                className={inputClasses('retirementLength')}
                placeholder="30"
              />
              {errors.retirementLength && (
                <p className="mt-1 text-sm text-red-600">{errors.retirementLength}</p>
              )}
            </div>
          </div>
        </BorderContainer>

        <BorderContainer>
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold">Financial Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>
                Current Investments ($)
                <Tooltip content="Total value of your current investment portfolio, including retirement accounts and taxable investments." />
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={inputs.currentInvestments}
                onChange={e => handleInputChange('currentInvestments', e.target.value.replace(/[^\d]/g, ''))}
                onWheel={e => e.currentTarget.blur()}
                className={inputClasses('currentInvestments')}
                placeholder="100000"
              />
            </div>

            <div>
              <label className={labelClasses}>
                Monthly Investments ($)
                <Tooltip content="How much you plan to invest each month until retirement, including employer matches and all contributions." />
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={inputs.monthlyInvestments}
                onChange={e => handleInputChange('monthlyInvestments', e.target.value.replace(/[^\d]/g, ''))}
                onWheel={e => e.currentTarget.blur()}
                className={inputClasses('monthlyInvestments')}
                placeholder="2000"
              />
            </div>

            <div>
              <label className={labelClasses}>
                Retirement Annual Spend ($)
                <Tooltip content="How much you expect to spend annually in retirement, adjusted for today's dollars. Include all living expenses and discretionary spending." />
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={inputs.retirementAnnualSpend}
                onChange={e => handleInputChange('retirementAnnualSpend', e.target.value.replace(/[^\d]/g, ''))}
                onWheel={e => e.currentTarget.blur()}
                className={inputClasses('retirementAnnualSpend')}
                placeholder="60000"
              />
            </div>
          </div>
        </BorderContainer>
      </div>

      <BorderContainer>
        <AssetAllocation
          assets={inputs.assetAllocation}
          errors={errors}
          onAssetChange={handleAssetAllocationChange}
          onRemoveAsset={handleRemoveAsset}
          onAddAsset={handleAddAsset}
        />
      </BorderContainer>

      <BorderContainer>
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold">Additional Settings</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClasses}>
              Inflation Rate (%)
              <Tooltip content="Expected annual inflation rate. This affects the real value of your investments and withdrawals over time." />
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={inputs.inflationRate}
              onChange={e => {
                const value = e.target.value.replace(/[^\d.]/g, '');
                if (/^\d*\.?\d*$/.test(value)) {
                  handleInputChange('inflationRate', value);
                }
              }}
              onWheel={e => e.currentTarget.blur()}
              className={inputClasses('inflationRate')}
              placeholder="2.5"
            />
          </div>

          <div>
            <label className={labelClasses}>
              Tax Rate (%)
              <Tooltip content="Expected average tax rate on your retirement withdrawals. Consider your tax bracket and mix of pre-tax/post-tax accounts." />
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={inputs.taxRate}
              onChange={e => {
                const value = e.target.value.replace(/[^\d.]/g, '');
                if (/^\d*\.?\d*$/.test(value)) {
                  handleInputChange('taxRate', value);
                }
              }}
              onWheel={e => e.currentTarget.blur()}
              className={inputClasses('taxRate')}
              placeholder="25"
            />
          </div>

          <div>
            <label className={labelClasses}>
              Investment Fees (%)
              <Tooltip content="Total annual investment fees, including fund expense ratios, advisory fees, and any other investment-related costs." />
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={inputs.investmentFees}
              onChange={e => {
                const value = e.target.value.replace(/[^\d.]/g, '');
                if (/^\d*\.?\d*$/.test(value)) {
                  handleInputChange('investmentFees', value);
                }
              }}
              onWheel={e => e.currentTarget.blur()}
              className={inputClasses('investmentFees')}
              placeholder="0.25"
            />
          </div>

          <div>
            <label className={labelClasses}>
              Rebalancing Frequency
              <Tooltip content="How often your portfolio is rebalanced to maintain your target asset allocation." />
            </label>
            <select
              value={inputs.rebalancingFrequency}
              onChange={e => handleInputChange('rebalancingFrequency', e.target.value)}
              className={`${inputClasses('rebalancingFrequency')} cursor-pointer`}
            >
              <option value="none">None</option>
              <option value="annual">Annual</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          <div>
            <label className={labelClasses}>
              Simulation Count
              <Tooltip content="Number of simulations to run. More simulations provide more accurate results but take longer to calculate." />
            </label>
            <select
              value={inputs.simulationCount}
              onChange={e => handleInputChange('simulationCount', e.target.value)}
              className={`${inputClasses('simulationCount')} cursor-pointer`}
            >
              <option value={100}>100 (Fast)</option>
              <option value={500}>500 (Balanced)</option>
              <option value={1000}>1000 (Accurate)</option>
              <option value={2000}>2000 (Very Accurate)</option>
            </select>
          </div>
        </div>
      </BorderContainer>

      <div className="mt-8 flex flex-wrap gap-4 justify-end">
  <button
    onClick={handleReset}
    className="flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-emerald-50 border border-gray-300 rounded-lg transition-colors duration-200"
  >
    <RotateCcw className="w-4 h-4 mr-2" />
    Reset to Defaults
  </button>
  <button
    onClick={handleCalculate}
    disabled={Object.keys(errors).length > 0}
    className="flex items-center px-6 py-2 text-sm text-white bg-[rgb(16,185,129)] hover:bg-[rgb(10,150,105)] border border-[rgb(16,185,129)] rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <PlayCircle className="w-4 h-4 mr-2" />
    Run Simulation
  </button>
</div>
    </div>
  );
};

export default InputFields;