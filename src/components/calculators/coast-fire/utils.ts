import type { CoastFireInputs, CoastFireResults, TimelineDataPoint } from './types';

export const calculateCoastFire = (inputs: CoastFireInputs): CoastFireResults => {
  const {
    currentAge,
    retirementAge,
    annualSpending,
    currentInvestedAssets,
    monthlyContributions,
    investmentGrowthRate,
    safeWithdrawalRate,
    advancedOptions
  } = inputs;

  const yearsToRetirement = retirementAge - currentAge;
  const targetFireNumber = (annualSpending * 100) / safeWithdrawalRate;
  
  const futureValueCurrentInvestments = currentInvestedAssets * 
    Math.pow(1 + investmentGrowthRate / 100, yearsToRetirement);
  
  const coastFireNumber = targetFireNumber / 
    Math.pow(1 + investmentGrowthRate / 100, yearsToRetirement);
  
  const additionalNeeded = Math.max(0, coastFireNumber - currentInvestedAssets);
  const progressPercentage = Math.min(100, (currentInvestedAssets / coastFireNumber) * 100);

  // Generate timeline data
  const timelineData: TimelineDataPoint[] = [];
  for (let year = 0; year <= yearsToRetirement; year++) {
    const age = currentAge + year;
    const withContributions = calculatePortfolioValue(
      currentInvestedAssets,
      monthlyContributions * 12,
      investmentGrowthRate / 100,
      year
    );

    const withoutContributions = currentInvestedAssets * 
      Math.pow(1 + investmentGrowthRate / 100, year);

    const dataPoint: TimelineDataPoint = {
      age,
      withContributions,
      withoutContributions,
      coastFireNumber,
      fireNumber: targetFireNumber
    };

    if (advancedOptions && age >= advancedOptions.socialSecurityStartAge) {
      const annualSocialSecurity = advancedOptions.monthlySocialSecurity * 12;
      dataPoint.withSocialSecurity = withContributions + annualSocialSecurity;
    }

    timelineData.push(dataPoint);
  }

  return {
    targetFireNumber,
    futureValueCurrentInvestments,
    coastFireNumber,
    additionalNeeded,
    progressPercentage,
    timelineData,
    currentInvestedAssets // Add this to support the new progress bar
  };
};

const calculatePortfolioValue = (
  principal: number,
  annualContribution: number,
  rate: number,
  years: number
): number => {
  const futureValuePrincipal = principal * Math.pow(1 + rate, years);
  const futureValueContributions = annualContribution * 
    ((Math.pow(1 + rate, years) - 1) / rate);
  return futureValuePrincipal + futureValueContributions;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};