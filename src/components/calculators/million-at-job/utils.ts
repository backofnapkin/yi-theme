import type { FilingStatus } from './types';

export const calculateTaxRate = (income: number, filingStatus: FilingStatus): number => {
  // Using 2024 tax brackets
  const brackets = filingStatus === 'single' 
    ? [
        { threshold: 578126, rate: 0.37 },
        { threshold: 231251, rate: 0.35 },
        { threshold: 182101, rate: 0.32 },
        { threshold: 95376, rate: 0.24 },
        { threshold: 44726, rate: 0.22 },
        { threshold: 11001, rate: 0.12 },
        { threshold: 0, rate: 0.10 }
      ]
    : [
        { threshold: 693751, rate: 0.37 },
        { threshold: 462501, rate: 0.35 },
        { threshold: 364201, rate: 0.32 },
        { threshold: 190751, rate: 0.24 },
        { threshold: 89451, rate: 0.22 },
        { threshold: 22001, rate: 0.12 },
        { threshold: 0, rate: 0.10 }
      ];

  let tax = 0;
  let remainingIncome = income;
  
  for (let i = 0; i < brackets.length - 1; i++) {
    const currentBracket = brackets[i];
    const nextBracket = brackets[i + 1];
    
    if (income > currentBracket.threshold) {
      const taxableInThisBracket = remainingIncome - currentBracket.threshold;
      tax += taxableInThisBracket * currentBracket.rate;
      remainingIncome = currentBracket.threshold;
    }
  }
  
  if (remainingIncome > 0) {
    tax += remainingIncome * brackets[brackets.length - 1].rate;
  }
  
  return tax / income; // Effective tax rate
};

export const calculateTimeToMillion = (
  annualIncome: number,
  taxRate: number,
  monthlyExpenses: number,
  investmentReturns: number
): {
  gross: number;
  afterTax: number;
  afterExpenses: number;
  invested: number;
} => {
  const afterTaxIncome = annualIncome * (1 - taxRate);
  const annualExpenses = monthlyExpenses * 12;
  const annualSavings = afterTaxIncome - annualExpenses;
  const target = 1000000;

  // Time to reach $1M with just gross income
  const gross = target / annualIncome;
  
  // Time to reach $1M with after-tax income
  const afterTax = target / afterTaxIncome;
  
  // Time to reach $1M with savings after expenses
  const afterExpenses = annualSavings > 0 ? target / annualSavings : Infinity;

  // Time to reach $1M with compound interest on investments
  let invested = Infinity;
  if (annualSavings > 0) {
    const r = investmentReturns / 100; // Convert percentage to decimal
    if (r === 0) {
      invested = target / annualSavings;
    } else {
      // Using the formula: FV = PMT * ((1 + r)^t - 1) / r
      // Where: FV = target, PMT = annualSavings, r = investment return rate
      // Solving for t (time): t = ln(FV * r / PMT + 1) / ln(1 + r)
      invested = Math.log(target * r / annualSavings + 1) / Math.log(1 + r);
    }
  }

  return {
    gross,
    afterTax,
    afterExpenses,
    invested
  };
};

export const formatYearsAndMonths = (years: number): { years: number; months: number } => {
  if (!isFinite(years)) {
    return { years: Infinity, months: 0 };
  }
  const fullYears = Math.floor(years);
  const months = Math.round((years - fullYears) * 12);
  
  // Handle case where months rounds to 12
  if (months === 12) {
    return { years: fullYears + 1, months: 0 };
  }
  
  return { years: fullYears, months };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};