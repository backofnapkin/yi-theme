import type { CalculatorState, Message, ChartData } from './types';

export const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

export const calculateRealRate = (nominalRate: number, inflationRate: number): number => {
  return (1 + nominalRate / 100) / (1 + inflationRate / 100) - 1;
};

export const calculateBaristaFireNumber = (state: CalculatorState): number => {
  const annualExpenses = state.retirementAnnualSpending - (state.monthlyBaristaIncome * 12);
  return Math.max(0, (annualExpenses * 100) / state.safeWithdrawalRate);
};

export const calculateFullFireNumber = (state: CalculatorState): number => {
  return (state.retirementAnnualSpending * 100) / state.safeWithdrawalRate;
};

export const calculateFutureValue = (
  principal: number,
  rate: number,
  years: number,
  annualAddition = 0,
  inflationRate = 3
): number => {
  const realRate = calculateRealRate(rate, inflationRate);
  let fv = principal * Math.pow(1 + realRate, years);
  
  if (annualAddition > 0) {
    fv += annualAddition * ((Math.pow(1 + realRate, years) - 1) / realRate);
  }
  
  return fv;
};

export const getFIREMessage = (calculatorState: CalculatorState): Message[] => {
  const messages: Message[] = [];
  const baristaFireNumber = calculateBaristaFireNumber(calculatorState);
  const fullFireNumber = calculateFullFireNumber(calculatorState);
  
  const yearsToTarget = calculatorState.baristaFireAge - calculatorState.currentAge;
  const projectedNetWorth = calculateFutureValue(
    calculatorState.currentInvestedAssets,
    calculatorState.investmentGrowthRate,
    yearsToTarget,
    calculatorState.annualIncomeAfterTax - calculatorState.currentAnnualSpending,
    calculatorState.inflationRate
  );

  // Calculate some key metrics for messages
  const annualSavings = calculatorState.annualIncomeAfterTax - calculatorState.currentAnnualSpending;
  const savingsRate = (annualSavings / calculatorState.annualIncomeAfterTax) * 100;
  const monthlyBaristaIncome = calculatorState.monthlyBaristaIncome * 12;
  const percentageToGoal = (projectedNetWorth / baristaFireNumber) * 100;
  const additionalNeeded = Math.max(0, baristaFireNumber - projectedNetWorth);

  // New check for negative or zero savings
  if (annualSavings <= 0) {
    messages.push({
      type: 'warning',
      priority: 1,
      message: `Your current income of ${formatMoney(calculatorState.annualIncomeAfterTax)} doesn't exceed your spending of ${formatMoney(calculatorState.currentAnnualSpending)}. Without positive savings, you won't be able to build the investment portfolio needed for Barista FIRE.`
    });
  }

  // New check for high inflation impact
  if (calculatorState.inflationRate >= 5 && projectedNetWorth < baristaFireNumber) {
    messages.push({
      type: 'warning',
      priority: 1,
      message: `High inflation of ${calculatorState.inflationRate}% is significantly reducing your real investment returns. This makes reaching your Barista FIRE goal of ${formatMoney(baristaFireNumber)} challenging with current savings and investment assumptions.`
    });
  }

  // Success Messages
  if (projectedNetWorth >= baristaFireNumber) {
    messages.push({
      type: 'success',
      priority: 1,
      message: `You're on track to reach Barista FIRE by age ${calculatorState.baristaFireAge}! Your projected net worth of ${formatMoney(projectedNetWorth)} exceeds your Barista FIRE target of ${formatMoney(baristaFireNumber)} (in today's dollars).`
    });

    if (projectedNetWorth >= fullFireNumber) {
      messages.push({
        type: 'opportunity',
        priority: 2,
        message: `You're actually on track for full FIRE! You could potentially retire completely by age ${calculatorState.baristaFireAge} without needing part-time work.`
      });
    }
  } else {
    // Not on track - different messages based on how close they are
    if (percentageToGoal >= 75) {
      messages.push({
        type: 'action',
        priority: 1,
        message: `You're close! You're projected to reach ${Math.round(percentageToGoal)}% of your Barista FIRE goal. Consider increasing your savings rate or adjusting your target age to bridge the ${formatMoney(additionalNeeded)} gap.`
      });
    } else if (percentageToGoal >= 50) {
      messages.push({
        type: 'action',
        priority: 1,
        message: `You're making progress with ${Math.round(percentageToGoal)}% of your goal, but need an additional ${formatMoney(additionalNeeded)} to reach Barista FIRE by age ${calculatorState.baristaFireAge}.`
      });
    } else {
      messages.push({
        type: 'warning',
        priority: 1,
        message: `You're currently projected to reach ${Math.round(percentageToGoal)}% of your Barista FIRE goal. Consider adjusting your plan to bridge the ${formatMoney(additionalNeeded)} gap.`
      });
    }
  }

  // Savings Rate Messages
  if (savingsRate < 10) {
    messages.push({
      type: 'warning',
      priority: 2,
      message: `Your current savings rate of ${Math.round(savingsRate)}% is relatively low. Increasing your savings rate could significantly accelerate your journey to Barista FIRE.`
    });
  } else if (savingsRate >= 50) {
    messages.push({
      type: 'success',
      priority: 3,
      message: `Impressive! Your ${Math.round(savingsRate)}% savings rate puts you in an excellent position to reach your financial goals.`
    });
  }

  // Part-time Income Messages
  if (monthlyBaristaIncome < 1000) {
    messages.push({
      type: 'warning',
      priority: 2,
      message: `Your planned part-time income of ${formatMoney(monthlyBaristaIncome)} per year is quite low. Consider exploring opportunities that could provide more income during your Barista FIRE phase.`
    });
  }

  // Investment Return Messages
  if (calculatorState.investmentGrowthRate > 10) {
    messages.push({
      type: 'warning',
      priority: 3,
      message: `Your expected return of ${calculatorState.investmentGrowthRate}% might be optimistic. Consider using a more conservative 7% return for planning.`
    });
  }

  // Social Security Messages
  if (calculatorState.showAdvancedFields && calculatorState.socialSecurityAge < 67) {
    messages.push({
      type: 'info',
      priority: 4,
      message: `Taking Social Security at age ${calculatorState.socialSecurityAge} will result in reduced benefits. Consider if waiting until full retirement age (67) might be more beneficial.`
    });
  }

  // Time to Target Messages
  if (yearsToTarget < 5) {
    messages.push({
      type: 'warning',
      priority: 2,
      message: `Your target Barista FIRE age is only ${yearsToTarget} years away. Make sure you have a solid plan for transitioning to part-time work.`
    });
  }

  // Sort messages by priority and return top 3
  return messages
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);
};

export const generateChartData = (state: CalculatorState): ChartData[] => {
  const data: ChartData[] = [];
  const yearsToProject = state.showExtendedChart ? state.endAge - state.currentAge : 70 - state.currentAge;
  
  let previousBaristaFireNetWorth = state.currentInvestedAssets;
  let previousCurrentJobNetWorth = state.currentInvestedAssets;
  
  for (let year = 0; year <= yearsToProject; year++) {
    const age = state.currentAge + year;
    
    const baristaAnnualIncome = state.monthlyBaristaIncome * 12;
    const fullTimeAnnualSavings = state.annualIncomeAfterTax - state.currentAnnualSpending;
    const baristaAnnualSavings = Math.max(0, baristaAnnualIncome - state.retirementAnnualSpending);
    
    const realRate = calculateRealRate(state.investmentGrowthRate, state.inflationRate);
    
    if (year === 0) {
      previousBaristaFireNetWorth = state.currentInvestedAssets;
    } else {
      const annualSavings = age < state.baristaFireAge ? fullTimeAnnualSavings : baristaAnnualSavings;
      previousBaristaFireNetWorth = previousBaristaFireNetWorth * (1 + realRate) + annualSavings;
    }
    
    if (year === 0) {
      previousCurrentJobNetWorth = state.currentInvestedAssets;
    } else {
      previousCurrentJobNetWorth = previousCurrentJobNetWorth * (1 + realRate) + fullTimeAnnualSavings;
    }

    const fullFireNum = (state.retirementAnnualSpending * 100) / state.safeWithdrawalRate;

    const socialSecurityImpact = state.showAdvancedFields && age >= state.socialSecurityAge
      ? previousBaristaFireNetWorth + (state.monthlySocialSecurity * 12 * (100 / state.safeWithdrawalRate))
      : undefined;

    data.push({
      age,
      baristaFireNetWorth: previousBaristaFireNetWorth,
      currentJobNetWorth: previousCurrentJobNetWorth,
      fullFireNumber: fullFireNum,
      socialSecurityImpact
    });
  }

  return data;
};