export interface CalculatorInputs {
    initialInvestment: number;
    projectedReturn: number;
    debtServiceEnabled: boolean;
    debtInterestRate: number;
    years: number;
    months: number;
    taxRate: number;
    inflationRate: number;
    goalAmount: number;
  }
  
  export interface CalculatorResults {
    futureValue: number;
    afterTaxValue: number;
    realValue: number;
    debtServiceSavings: number;
    netOpportunityCost: number;
  }
  
  export function calculateResults(inputs: CalculatorInputs): CalculatorResults {
    const totalMonths = inputs.years * 12 + inputs.months;
    
    // Calculate future value of investment
    const monthlyReturnRate = inputs.projectedReturn / 100 / 12;
    const futureValue = inputs.initialInvestment * Math.pow(1 + monthlyReturnRate, totalMonths);
    
    // Calculate after-tax value
    const totalGain = futureValue - inputs.initialInvestment;
    const taxAmount = totalGain * (inputs.taxRate / 100);
    const afterTaxValue = futureValue - taxAmount;
    
    // Calculate real value (inflation-adjusted)
    const realValue = afterTaxValue / Math.pow(1 + inputs.inflationRate / 100, inputs.years + inputs.months / 12);
    
    // Calculate debt service savings
    // This represents how much interest you would save by paying off debt instead of investing
    const monthlyDebtRate = inputs.debtInterestRate / 100 / 12;
    const debtServiceSavings = inputs.debtServiceEnabled ? 
      inputs.initialInvestment * (Math.pow(1 + monthlyDebtRate, totalMonths) - 1) : 
      0;
    
    // Calculate net opportunity cost
    // Positive value means investing is better, negative means paying debt is better
    // We compare after-tax investment value against initial investment plus debt interest saved
    const netOpportunityCost = inputs.debtServiceEnabled ?
      afterTaxValue - (inputs.initialInvestment + debtServiceSavings) :
      afterTaxValue - inputs.initialInvestment;
    
    return {
      futureValue,
      afterTaxValue,
      realValue,
      debtServiceSavings,
      netOpportunityCost
    };
  }