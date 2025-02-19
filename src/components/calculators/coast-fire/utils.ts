import type { CalculatorState, Message, ChartData } from './types';

export const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

export const calculateRealRate = (nominalRate: number, inflationRate: number): number => {
  return ((1 + nominalRate / 100) / (1 + inflationRate / 100)) - 1;
};

export const calculateFutureValue = (
  principal: number,
  rate: number,
  years: number,
  monthlyContribution = 0,
  inflationRate = 3
): number => {
  const realRate = calculateRealRate(rate, inflationRate);
  const monthlyRate = Math.pow(1 + realRate, 1/12) - 1;
  const totalMonths = Math.floor(years * 12);
  
  // Calculate future value of principal
  let futureValue = principal * Math.pow(1 + realRate, years);
  
  // If there are monthly contributions, calculate their future value
  if (monthlyContribution > 0) {
    // Use the future value of annuity formula with monthly compounding
    futureValue += monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
  }
  
  return futureValue;
};

export const calculateCoastFireNumber = (state: CalculatorState): number => {
  const yearsToRetirement = state.targetRetirementAge - state.currentAge;
  const realRate = calculateRealRate(state.investmentGrowthRate, state.inflationRate);
  
  // Calculate the future value needed at retirement (using safe withdrawal rate)
  const futureFireNumber = (state.retirementAnnualSpending * 100) / state.safeWithdrawalRate;
  
  // Discount back to present value
  return futureFireNumber / Math.pow(1 + realRate, yearsToRetirement);
};

export const calculateFullFireNumber = (state: CalculatorState): number => {
  return (state.retirementAnnualSpending * 100) / state.safeWithdrawalRate;
};

export const calculateYearsToCoastFire = (state: CalculatorState): number | null => {
  const coastFireNumber = calculateCoastFireNumber(state);
  
  // If already at Coast FIRE, return 0
  if (state.currentInvestedAssets >= coastFireNumber) {
    return 0;
  }
  
  // If no monthly contributions, will never reach Coast FIRE
  if (state.monthlyContributions <= 0) {
    return null;
  }
  
  let currentAssets = state.currentInvestedAssets;
  let years = 0;
  const maxYears = 100; // Prevent infinite loop
  
  while (currentAssets < coastFireNumber && years < maxYears) {
    currentAssets = calculateFutureValue(
      currentAssets,
      state.investmentGrowthRate,
      1,
      state.monthlyContributions,
      state.inflationRate
    );
    years++;
    
    // Check if we've passed retirement age
    if (state.currentAge + years > state.targetRetirementAge) {
      return null;
    }
  }
  
  return years < maxYears ? years : null;
};

export const generateChartData = (state: CalculatorState): ChartData[] => {
  const data: ChartData[] = [];
  const yearsToProject = state.showExtendedChart ? state.endAge - state.currentAge : 70 - state.currentAge;
  
  let currentPathNetWorth = state.currentInvestedAssets;
  let noContributionsAfterCoastNetWorth = state.currentInvestedAssets;
  let hasReachedCoastFire = false;
  
  for (let year = 0; year <= yearsToProject; year++) {
    const age = state.currentAge + year;
    const coastFireNumber = calculateCoastFireNumber({
      ...state,
      currentAge: age
    });
    
    // Check if Coast FIRE is reached this year
    if (!hasReachedCoastFire && noContributionsAfterCoastNetWorth >= coastFireNumber) {
      hasReachedCoastFire = true;
    }
    
    // Calculate current path (with continued monthly contributions)
    currentPathNetWorth = calculateFutureValue(
      currentPathNetWorth,
      state.investmentGrowthRate,
      1,
      state.monthlyContributions,
      state.inflationRate
    );
    
    // Calculate path with no contributions after reaching Coast FIRE
    noContributionsAfterCoastNetWorth = calculateFutureValue(
      noContributionsAfterCoastNetWorth,
      state.investmentGrowthRate,
      1,
      hasReachedCoastFire ? 0 : state.monthlyContributions,
      state.inflationRate
    );
    
    const fullFireNum = calculateFullFireNumber(state);
    
    const socialSecurityImpact = state.showAdvancedFields && age >= state.socialSecurityAge
      ? noContributionsAfterCoastNetWorth + (state.monthlySocialSecurity * 12 * (100 / state.safeWithdrawalRate))
      : undefined;
    
    data.push({
      age,
      coastFireNetWorth: coastFireNumber,
      currentPathNetWorth,
      noContributionsAfterCoastNetWorth,
      fullFireNumber: fullFireNum,
      socialSecurityImpact
    });
  }
  
  return data;
};

export const getFIREMessage = (state: CalculatorState): Message[] => {
  const messages: Message[] = [];
  const coastFireNumber = calculateCoastFireNumber(state);
  const yearsToCoastFire = calculateYearsToCoastFire(state);
  const isOnTrack = yearsToCoastFire !== null;
  
  // Primary Coast FIRE status message
  if (state.currentInvestedAssets >= coastFireNumber) {
    messages.push({
      type: 'success',
      priority: 1,
      message: `Congratulations! You've already reached Coast FIRE! Your current investments will grow to cover your retirement needs without additional contributions.`
    });
  } else {
    messages.push({
      type: 'success',
      priority: 1,
      message: isOnTrack
        ? `If you continue on your current path, you will reach Coast FIRE by age ${state.currentAge + yearsToCoastFire}, which is ${yearsToCoastFire} years from now.`
        : `If you continue on your current path, you will never reach Coast FIRE. Adjust your plan to reach financial independence.`
    });
  }

  // High inflation warning
  if (state.inflationRate >= 7) {
    messages.push({
      type: 'warning',
      priority: 2,
      message: `Your inflation assumption of ${state.inflationRate}% is notably high. High inflation can significantly impact your retirement needs. Consider stress-testing your plan with different inflation scenarios.`
    });
  }

  // Overly optimistic returns warning
  if (state.investmentGrowthRate >= 15) {
    messages.push({
      type: 'warning',
      priority: 2,
      message: `A ${state.investmentGrowthRate}% annual return may be overly optimistic. The S&P 500's historical average is closer to 10%. Consider using a more conservative growth rate for planning.`
    });
  }

  // Negative real return warning
  if (state.investmentGrowthRate <= state.inflationRate) {
    messages.push({
      type: 'warning',
      priority: 2,
      message: `Your expected investment return (${state.investmentGrowthRate}%) is less than inflation (${state.inflationRate}%). This means your money is losing purchasing power over time. Consider a more growth-oriented investment strategy.`
    });
  }

  // Very early retirement warning
  if (state.targetRetirementAge < 45) {
    messages.push({
      type: 'warning',
      priority: 2,
      message: `Retiring before age 45 requires significant savings and a robust investment strategy. Make sure to account for healthcare costs before Medicare eligibility at 65.`
    });
  }

  // Monthly Contributions Messages
  if (state.monthlyContributions < 100) {
    messages.push({
      type: 'warning',
      priority: 2,
      message: `Your monthly contribution of ${formatMoney(state.monthlyContributions)} is relatively low. Increasing your contributions could help you reach Coast FIRE sooner.`
    });
  }

  // Sort messages by priority and return top 3
  return messages
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);
};