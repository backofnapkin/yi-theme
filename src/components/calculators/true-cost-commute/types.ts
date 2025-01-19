export interface CommuteData {
    distance: number;
    timeMinutes: number;
    timeSeconds: number;
    costPerMile: number;
    hourlyWage: number;
    workdaysPerWeek: number;
    gasPrice: number;
    carPayment: number;
    milesPerGallon: number;
  }
  
  export const defaultData: CommuteData = {
    distance: 30,
    timeMinutes: 53,
    timeSeconds: 36,
    costPerMile: 0.58,
    hourlyWage: 29.81,
    workdaysPerWeek: 5,
    gasPrice: 3.25,
    carPayment: 737,
    milesPerGallon: 25.4
  };