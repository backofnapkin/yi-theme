import type { CalculatorState, CalculationResults } from './types';

const WEEKS_PER_MONTH = 4.33;
const MONTHS_PER_YEAR = 12;
const HOURS_PER_WEEK = 40;
const WEEKS_PER_YEAR = 52;

export function calculateResults(state: CalculatorState): CalculationResults {
  // Monthly revenue calculations
  const monthlyDumpsterRentals = 
    state.dumpsterCount * 
    state.rentalsPerMonth * 
    (state.rentalPricePerWeek * WEEKS_PER_MONTH / state.rentalsPerMonth);

  const monthlyAdditionalServices = state.additionalServices.map(service => ({
    name: service.name,
    amount: service.revenuePerMonth
  }));

  const monthlyRevenue = {
    dumpsterRentals: monthlyDumpsterRentals,
    junkRemoval: state.junkRemovalRevenue,
    additionalServices: monthlyAdditionalServices,
    total: monthlyDumpsterRentals + 
           state.junkRemovalRevenue + 
           monthlyAdditionalServices.reduce((sum, service) => sum + service.amount, 0)
  };

  // Monthly expense calculations
  const monthlyWages = 
    state.fullTimeDrivers * 
    state.driverWagePerHour * 
    HOURS_PER_WEEK * 
    WEEKS_PER_MONTH;

  const monthlyMaintenance = 
    (state.maintenanceCostPerYear * state.dumpsterCount) / MONTHS_PER_YEAR;

  const monthlyExpenses = {
    maintenance: monthlyMaintenance,
    wages: monthlyWages,
    fuel: state.fuelCostPerMonth,
    marketing: state.marketingCostsPerMonth,
    insurance: state.insuranceCostPerMonth,
    loanPayment: state.loanRepaymentPerMonth,
    software: state.softwareCostsPerMonth,
    total: monthlyMaintenance +
           monthlyWages +
           state.fuelCostPerMonth +
           state.marketingCostsPerMonth +
           state.insuranceCostPerMonth +
           state.loanRepaymentPerMonth +
           state.softwareCostsPerMonth
  };

  const monthlyProfit = monthlyRevenue.total - monthlyExpenses.total;

  // Annual calculations
  const annualRevenue = {
    dumpsterRentals: monthlyRevenue.dumpsterRentals * MONTHS_PER_YEAR,
    junkRemoval: monthlyRevenue.junkRemoval * MONTHS_PER_YEAR,
    additionalServices: monthlyAdditionalServices.map(service => ({
      name: service.name,
      amount: service.amount * MONTHS_PER_YEAR
    })),
    total: monthlyRevenue.total * MONTHS_PER_YEAR
  };

  const annualExpenses = {
    maintenance: monthlyExpenses.maintenance * MONTHS_PER_YEAR,
    wages: monthlyExpenses.wages * MONTHS_PER_YEAR,
    fuel: monthlyExpenses.fuel * MONTHS_PER_YEAR,
    marketing: monthlyExpenses.marketing * MONTHS_PER_YEAR,
    insurance: monthlyExpenses.insurance * MONTHS_PER_YEAR,
    loanPayment: monthlyExpenses.loanPayment * MONTHS_PER_YEAR,
    software: monthlyExpenses.software * MONTHS_PER_YEAR,
    total: monthlyExpenses.total * MONTHS_PER_YEAR
  };

  const annualProfit = monthlyProfit * MONTHS_PER_YEAR;

  // Breakeven calculations
  const totalInvestment = 
    (state.rollOffTrucks * state.rollOffTruckCost) +
    (state.dumpsterCount * state.dumpsterCost);

  // Calculate revenue per rental
  const revenuePerRental = state.rentalPricePerWeek * WEEKS_PER_MONTH / state.rentalsPerMonth;

  // Calculate variable costs per rental (maintenance only)
  const variableCostsPerRental = state.maintenanceCostPerYear / (state.rentalsPerMonth * MONTHS_PER_YEAR);

  // Calculate fixed costs per year
  const annualFixedCosts = 
    annualExpenses.wages +
    annualExpenses.fuel +
    annualExpenses.marketing +
    annualExpenses.insurance +
    annualExpenses.loanPayment +
    annualExpenses.software;

  // Calculate contribution margin per rental
  const contributionMarginPerRental = revenuePerRental - variableCostsPerRental;

  // Calculate rentals needed to break even
  const rentalsToBreakeven = Math.ceil(
    (totalInvestment + annualFixedCosts) / contributionMarginPerRental
  );

  const monthsToBreakeven = Math.ceil(rentalsToBreakeven / (state.dumpsterCount * state.rentalsPerMonth));

  // ROI calculations
  const firstYearROI = (annualProfit / totalInvestment) * 100;

  // 10-year projections with 3% annual growth
  const GROWTH_RATE = 0.03;
  const projections = Array.from({ length: 10 }, (_, index) => {
    const year = index + 1;
    const growthFactor = Math.pow(1 + GROWTH_RATE, year - 1);

    const yearlyRevenue = {
      dumpsterRentals: annualRevenue.dumpsterRentals * growthFactor,
      junkRemoval: annualRevenue.junkRemoval * growthFactor,
      additionalServices: annualRevenue.additionalServices.map(service => ({
        name: service.name,
        amount: service.amount * growthFactor
      })),
      total: annualRevenue.total * growthFactor
    };

    const yearlyExpenses = {
      maintenance: annualExpenses.maintenance * growthFactor,
      wages: annualExpenses.wages * growthFactor,
      fuel: annualExpenses.fuel * growthFactor,
      marketing: annualExpenses.marketing * growthFactor,
      insurance: annualExpenses.insurance * growthFactor,
      loanPayment: annualExpenses.loanPayment, // Loan payments typically don't increase
      software: annualExpenses.software * growthFactor,
      total: 0
    };

    yearlyExpenses.total = Object.values(yearlyExpenses)
      .reduce((sum, value) => typeof value === 'number' ? sum + value : sum, 0);

    // Calculate yearly breakeven rentals considering growth in expenses
    const yearlyBreakevenRentals = Math.ceil(
      (yearlyExpenses.total + (totalInvestment / 10)) / // Distribute investment cost over 10 years
      (contributionMarginPerRental * growthFactor)
    );

    return {
      year,
      revenue: yearlyRevenue,
      expenses: yearlyExpenses,
      profit: yearlyRevenue.total - yearlyExpenses.total,
      breakevenRentals: yearlyBreakevenRentals
    };
  });

  return {
    monthly: {
      revenue: monthlyRevenue,
      expenses: monthlyExpenses,
      profit: monthlyProfit
    },
    annual: {
      revenue: annualRevenue,
      expenses: annualExpenses,
      profit: annualProfit
    },
    breakeven: {
      rentalsPerDumpster: Math.ceil(rentalsToBreakeven / state.dumpsterCount),
      monthsToBreakeven
    },
    projections,
    roi: {
      paybackPeriodMonths: monthsToBreakeven,
      firstYearROI
    }
  };
}