export const convertHoursToTimeUnits = (hours: number) => {
  const years = Math.floor(hours / 8760);
  const months = Math.floor((hours % 8760) / 730);
  const days = Math.floor(((hours % 8760) % 730) / 24);
  return { years, months, days };
};

export const calculateTimeValues = (timeMinutes: number, timeSeconds: number, workdaysPerWeek: number) => {
  const dailyTimeHours = (timeMinutes + timeSeconds / 60) / 60;
  const weeklyTimeHours = dailyTimeHours * workdaysPerWeek;
  const annualTimeHours = weeklyTimeHours * 52;
  const tenYearTimeHours = annualTimeHours * 10;
  const twentyYearTimeHours = annualTimeHours * 20;
  const thirtyYearTimeHours = annualTimeHours * 30;

  return {
    dailyTimeHours,
    weeklyTimeHours,
    annualTimeHours,
    tenYearTimeHours,
    twentyYearTimeHours,
    thirtyYearTimeHours
  };
};

export const calculateFinancialCosts = (data: {
  distance: number;
  workdaysPerWeek: number;
  milesPerGallon: number;
  gasPrice: number;
  carPayment: number;
  costPerMile: number;
  annualTimeHours: number;
  hourlyWage: number;
}) => {
  const annualDistance = data.distance * data.workdaysPerWeek * 52;
  const annualGasCost = (annualDistance / data.milesPerGallon) * data.gasPrice;
  const annualCarPayments = data.carPayment * 12;
  const annualDirectDrivingCost = annualDistance * data.costPerMile;
  const annualTimeCost = data.annualTimeHours * data.hourlyWage;
  
  // Include all costs in the total
  const totalAnnualCost = annualDirectDrivingCost + annualGasCost + annualCarPayments + annualTimeCost;

  return {
    annualDistance,
    annualGasCost,
    annualCarPayments,
    annualDirectDrivingCost,
    annualTimeCost,
    totalAnnualCost
  };
};