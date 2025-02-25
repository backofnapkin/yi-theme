import pkg from 'lodash'; // Changed to default import
const { mean, sortBy, maxBy } = pkg; // Destructure required functions
import type { FinancialInputs, SimulationResults } from "../types";

class SeededRandom {
  private state: Uint32Array;

  constructor(seed: number) {
    this.state = new Uint32Array(4);
    this.setSeed(seed);
  }

  private setSeed(seed: number): void {
    const hashCode = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      return hash;
    };

    const s1 = hashCode(seed.toString());
    const s2 = hashCode((seed * 2).toString());
    const s3 = hashCode((seed * 3).toString());
    const s4 = hashCode((seed * 4).toString());

    this.state[0] = s1 >>> 0;
    this.state[1] = s2 >>> 0;
    this.state[2] = s3 >>> 0;
    this.state[3] = s4 >>> 0;
  }

  private rotl(x: number, k: number): number {
    return (x << k) | (x >>> (32 - k));
  }

  next(): number {
    const result = this.rotl(this.state[1] * 5, 7) * 9;
    const t = this.state[1] << 9;

    this.state[2] ^= this.state[0];
    this.state[3] ^= this.state[1];
    this.state[1] ^= this.state[2];
    this.state[0] ^= this.state[3];

    this.state[2] ^= t;
    this.state[3] = this.rotl(this.state[3], 11);

    return (result >>> 0) / 4294967296;
  }

  nextGaussian(mean: number = 0, stdDev: number = 1): number {
    let u1: number, u2: number, s: number;
    do {
      u1 = 2 * this.next() - 1;
      u2 = 2 * this.next() - 1;
      s = u1 * u1 + u2 * u2;
    } while (s >= 1 || s === 0);

    const mul = Math.sqrt(-2.0 * Math.log(s) / s);
    return mean + stdDev * u1 * mul;
  }
}

function gaussianRandom(rng: SeededRandom, mean: number, stdev: number): number {
  return rng.nextGaussian(mean, stdev);
}

function generateCorrelatedReturns(
  rng: SeededRandom,
  mean: number,
  stdev: number,
  years: number,
  correlation: number = 0.1
): number[] {
  const returns: number[] = [];
  let lastReturn = gaussianRandom(rng, mean, stdev);
  returns.push(lastReturn);

  for (let i = 1; i < years; i++) {
    const newRandom = gaussianRandom(rng, mean, stdev);
    lastReturn = correlation * lastReturn + (1 - correlation) * newRandom;
    returns.push(lastReturn);
  }

  return returns;
}

function generateDeterministicSeed(inputs: FinancialInputs): number {
  const seedString = JSON.stringify({
    age: Number(inputs.currentAge),
    retirement: Number(inputs.retirementAge),
    length: Number(inputs.retirementLength),
    current: Math.round(Number(inputs.currentInvestments)),
    monthly: Math.round(Number(inputs.monthlyInvestments)),
    spend: Math.round(Number(inputs.retirementAnnualSpend)),
    allocation: inputs.assetAllocation.map((a) => ({
      p: Math.round(Number(a.percentage)),
      r: Math.round(Number(a.expectedReturn) * 10),
      v: Math.round(Number(a.volatility) * 10),
    })),
    inflation: Math.round(Number(inputs.inflationRate) * 10),
    tax: Math.round(Number(inputs.taxRate)),
    fees: Math.round(Number(inputs.investmentFees) * 100),
    count: Number(inputs.simulationCount),
    rebalancing: inputs.rebalancingFrequency,
  });

  return Array.from(seedString).reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
}

interface SimulationOptions {
  seed?: number;
  useDeterministicSeed?: boolean;
}

export function runMonteCarloSimulation(
  inputs: FinancialInputs,
  options: SimulationOptions = {}
): SimulationResults {
  const totalYears = Number(inputs.retirementAge) - Number(inputs.currentAge) + Number(inputs.retirementLength);
  const paths: number[][] = [];

  if (inputs.assetAllocation.reduce((sum, a) => sum + Number(a.percentage), 0) !== 100) {
    throw new Error("Asset allocation must sum to 100%");
  }

  const baseSeed = options.useDeterministicSeed
    ? generateDeterministicSeed(inputs)
    : options.seed ?? Date.now();

  for (let sim = 0; sim < Number(inputs.simulationCount); sim++) {
    const pathSeed = baseSeed + sim * 1000000;
    const pathRng = new SeededRandom(pathSeed);
    const path = simulatePath(inputs, totalYears, pathRng);
    paths.push(path);
  }

  const percentilePaths = calculatePercentilePaths(paths, totalYears);
  const metrics = calculatePortfolioMetrics(paths, inputs);

  return { percentilePaths, metrics };
}

const FAILURE_THRESHOLD = 50000;

function simulatePath(inputs: FinancialInputs, totalYears: number, rng: SeededRandom): number[] {
  let portfolio: number = Number(inputs.currentInvestments);
  const path: number[] = [portfolio];

  const assetReturns = inputs.assetAllocation.map((asset) =>
    generateCorrelatedReturns(rng, Number(asset.expectedReturn) / 100, Number(asset.volatility) / 100, totalYears)
  );

  for (let year = 1; year <= totalYears; year++) {
    const isRetired = year > Number(inputs.retirementAge) - Number(inputs.currentAge);

    let yearlyReturn = 0;
    inputs.assetAllocation.forEach((asset, index) => {
      yearlyReturn += (Number(asset.percentage) / 100) * assetReturns[index][year - 1];
    });

    portfolio *= 1 + yearlyReturn - Number(inputs.investmentFees) / 100;

    if (!isRetired) {
      portfolio += Number(inputs.monthlyInvestments) * 12;
    }

    if (isRetired) {
      const withdrawal =
        Number(inputs.retirementAnnualSpend) *
        Math.pow(1 + Number(inputs.inflationRate) / 100, year - (Number(inputs.retirementAge) - Number(inputs.currentAge)));
      const afterTaxWithdrawal = withdrawal / (1 - Number(inputs.taxRate) / 100);
      portfolio -= afterTaxWithdrawal;
    }

    if (portfolio < FAILURE_THRESHOLD) {
      portfolio = 0;
      path.push(portfolio);
      for (let i = year + 1; i <= totalYears; i++) {
        path.push(0);
      }
      break;
    }

    path.push(portfolio);
  }

  return path;
}

function calculatePercentilePaths(paths: number[][], totalYears: number): SimulationResults["percentilePaths"] {
  const percentilePaths: SimulationResults["percentilePaths"] = {
    p95: [],
    p75: [],
    p50: [],
    p25: [],
    p05: [],
    failed: [],
  };

  const failedPaths = paths.filter((path) => path[path.length - 1] <= 0);
  const successfulPaths = paths.filter((path) => path[path.length - 1] > 0);

  // Create a Set to track which failed paths we've already recorded
  const recordedFailedPaths = new Set<number>();

  for (let year = 0; year <= totalYears; year++) {
    const yearValues = successfulPaths.map((path) => path[year]);

    if (yearValues.length > 0) {
      const sortedValues = sortBy(yearValues);
      const totalSuccessfulPaths = sortedValues.length;

      const p95Index = Math.min(Math.floor(totalSuccessfulPaths * 0.95), totalSuccessfulPaths - 1);
      const p75Index = Math.min(Math.floor(totalSuccessfulPaths * 0.75), totalSuccessfulPaths - 1);
      const p50Index = Math.min(Math.floor(totalSuccessfulPaths * 0.50), totalSuccessfulPaths - 1);
      const p25Index = Math.min(Math.floor(totalSuccessfulPaths * 0.25), totalSuccessfulPaths - 1);
      const p05Index = Math.min(Math.floor(totalSuccessfulPaths * 0.05), totalSuccessfulPaths - 1);

      percentilePaths.p95.push({ year, portfolioValue: sortedValues[p95Index] ?? 0 });
      percentilePaths.p75.push({ year, portfolioValue: sortedValues[p75Index] ?? 0 });
      percentilePaths.p50.push({ year, portfolioValue: sortedValues[p50Index] ?? 0 });
      percentilePaths.p25.push({ year, portfolioValue: sortedValues[p25Index] ?? 0 });
      percentilePaths.p05.push({ year, portfolioValue: sortedValues[p05Index] ?? 0 });
    } else {
      percentilePaths.p95.push({ year, portfolioValue: 0 });
      percentilePaths.p75.push({ year, portfolioValue: 0 });
      percentilePaths.p50.push({ year, portfolioValue: 0 });
      percentilePaths.p25.push({ year, portfolioValue: 0 });
      percentilePaths.p05.push({ year, portfolioValue: 0 });
    }

    // Track each failed path at the year it first fails
    failedPaths.forEach((path, pathIndex) => {
      // Only process this path if we haven't already recorded it
      if (!recordedFailedPaths.has(pathIndex)) {
        const value = path[year];
        const prevValue = year > 0 ? path[year - 1] : Infinity;
        
        // Check if this path failed at this specific year
        // (Either the value is ≤ 0 for the first time, or it's the first year and already ≤ 0)
        if (value <= 0 && (year === 0 || prevValue > 0)) {
          percentilePaths.failed.push({
            year,
            portfolioValue: 0,
            isFailed: true,
          });
          
          // Mark this path as recorded so we don't count it again
          recordedFailedPaths.add(pathIndex);
        }
      }
    });
  }

  return percentilePaths;
}

function calculateSuccessRate(paths: number[][]): number {
  const successfulPaths = paths.filter((path) => path[path.length - 1] > FAILURE_THRESHOLD).length;
  return (successfulPaths / paths.length) * 100;
}

function calculatePortfolioMetrics(paths: number[][], inputs: FinancialInputs): SimulationResults["metrics"] {
  const endingBalances = paths.map((path) => path[path.length - 1]);
  const successfulPaths = endingBalances.filter((balance) => balance > FAILURE_THRESHOLD);
  const totalPaths = paths.length;
  const successRate = (successfulPaths.length / totalPaths) * 100;

  return {
    successRate,
    medianEndingBalance: sortBy(endingBalances)[Math.floor(endingBalances.length / 2)] ?? 0,
    traditional4PercentRule: {
      successRate: calculateSuccessRate(paths.map((path) => [...path])),
      medianEndingBalance: mean(endingBalances) ?? 0,
    },
  };
}