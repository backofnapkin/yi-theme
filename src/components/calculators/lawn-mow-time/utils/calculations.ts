import type { 
  MowerSettings, 
  LawnConditions, 
  CrewSettings, 
  BlowerSettings,
  CalculationResult
} from '../types';

// Base speed is ~67 sq ft/min with a 21" push mower
const BASE_SPEED = 66.67;

// Mower efficiency multipliers based on real-world performance
const MOWER_EFFICIENCY = {
  'push': 0.7, // Base efficiency
  'riding': 1.0,
  'residential-zero-turn': 1.3,
  'commercial-zero-turn': 1.5
} as const;

// Square feet that can be mowed per minute based on mower width
function calculateBaseMowingSpeed(mowerWidthInches: number, mowerType: keyof typeof MOWER_EFFICIENCY): number {
  // Example: A 21" push mower can cut about 1,000 sq ft in 15 minutes under ideal conditions
  // Formula: (mower width in inches * efficiency multiplier * baseline speed)
  const widthMultiplier = mowerWidthInches / 21; // Normalize to 21" mower
  
  return BASE_SPEED * widthMultiplier * MOWER_EFFICIENCY[mowerType];
}

// Calculate additional time for lawn conditions
function calculateConditionAdjustments(
  lawnSize: number,
  conditions: LawnConditions
): { totalTime: number; details: CalculationResult['breakdown']['conditionDetails'] } {
  let additionalMinutes = 0;
  const details: CalculationResult['breakdown']['conditionDetails'] = {
    trees: 0,
    treeCount: conditions.trees,
    parkway: 0,
    flowerBeds: 0,
    fence: 0,
    overgrown: 0,
    sloped: 0,
    wet: 0,
    petWaste: 0,
    playsets: 0,
    other: 0
  };
  
  // Tree trimming (1 min per tree)
  details.trees = Math.round(conditions.trees);
  additionalMinutes += details.trees;
  
  // Convert lawn size to thousands of square feet for calculations
  const perThousandSqFt = Math.ceil(lawnSize / 1000);
  
  if (conditions.hasParkway) {
    details.parkway = Math.round(perThousandSqFt * 2); // 2 min per 1,000 sq ft
    additionalMinutes += details.parkway;
  }
  
  if (conditions.hasFlowerBeds) {
    details.flowerBeds = Math.round(perThousandSqFt * 2); // 2 min per 1,000 sq ft
    additionalMinutes += details.flowerBeds;
  }
  
  if (conditions.hasFence) {
    details.fence = Math.round(perThousandSqFt * 2); // 2 min per 1,000 sq ft
    additionalMinutes += details.fence;
  }
  
  if (conditions.isOvergrown) {
    details.overgrown = Math.round(perThousandSqFt * 5); // 5 min per 1,000 sq ft
    additionalMinutes += details.overgrown;
  }
  
  if (conditions.isSloped) {
    details.sloped = Math.round(perThousandSqFt * 5); // 5 min per 1,000 sq ft
    additionalMinutes += details.sloped;
  }
  
  if (conditions.isWet) {
    details.wet = Math.round(perThousandSqFt * 1); // 1 min per 1,000 sq ft
    additionalMinutes += details.wet;
  }
  
  if (conditions.hasPetWaste) {
    details.petWaste = Math.round(perThousandSqFt * 2); // 2 min per 1,000 sq ft
    additionalMinutes += details.petWaste;
  }
  
  if (conditions.hasPlaysets) {
    details.playsets = Math.round(perThousandSqFt * 1); // 1 min per 1,000 sq ft
    additionalMinutes += details.playsets;
  }
  
  if (conditions.hasOther) {
    details.other = Math.round(perThousandSqFt * 2); // 2 min per 1,000 sq ft
    additionalMinutes += details.other;
  }
  
  return {
    totalTime: Math.round(additionalMinutes),
    details: details
  };
}

// Calculate blower time based on type and lawn size
function calculateBlowerTime(
  lawnSize: number,
  blowerType: BlowerSettings['type']
): number {
  const perThousandSqFt = Math.ceil(lawnSize / 1000);
  
  switch (blowerType) {
    case 'backpack':
      return Math.round(perThousandSqFt * 3);
    case 'handheld':
      return Math.round(perThousandSqFt * 10);
    case 'manual':
      return Math.round(perThousandSqFt * 60);
  }
}

// Apply crew size efficiency
function applyCrewEfficiency(totalMinutes: number, crewSize: CrewSettings['size']): number {
  const efficiencyMultiplier = {
    1: 1,      // No reduction
    2: 0.55,   // 45% reduction
    3: 0.35,   // 65% reduction
    4: 0.25    // 75% reduction
  }[crewSize];
  
  return Math.round(totalMinutes * efficiencyMultiplier);
}

// Calculate cost based on time, hourly rate, and crew size
function calculateCost(totalMinutes: number, hourlyRate: number, crewSize: number): number {
  // Each crew member needs to make the hourly rate, so multiply by crew size
  return (totalMinutes / 60) * hourlyRate * crewSize;
}

// Main calculation function
export function calculateLawnService(
  mowerSettings: MowerSettings,
  lawnSize: number,
  lawnConditions: LawnConditions,
  blowerSettings: BlowerSettings,
  crewSettings: CrewSettings
): CalculationResult {
  // Calculate base mowing time
  const baseMowingSpeed = calculateBaseMowingSpeed(mowerSettings.width, mowerSettings.type);
  const baseMowingTime = Math.round(lawnSize / baseMowingSpeed);
  
  // Calculate additional time from conditions
  const { totalTime: conditionTime, details: conditionDetails } = calculateConditionAdjustments(lawnSize, lawnConditions);
  
  // Calculate blower time
  const blowerTime = calculateBlowerTime(lawnSize, blowerSettings.type);
  
  // Sum up total time before crew efficiency
  const totalTimeBeforeCrew = baseMowingTime + conditionTime + blowerTime;
  
  // Apply crew efficiency
  const finalTotalTime = applyCrewEfficiency(totalTimeBeforeCrew, crewSettings.size);
  
  // Calculate cost
  const totalCost = calculateCost(finalTotalTime, crewSettings.hourlyRate, crewSettings.size);
  
  return {
    totalMinutes: Math.round(finalTotalTime),
    mowingOnlyMinutes: Math.round(baseMowingTime),
    targetCharge: Math.round(totalCost),
    breakdown: {
      baseMowingTime: Math.round(baseMowingTime),
      conditionAdjustments: Math.round(conditionTime),
      blowerTime: Math.round(blowerTime),
      crewEfficiencyReduction: Math.round(totalTimeBeforeCrew - finalTotalTime),
      conditionDetails: conditionDetails,
      blowerType: blowerSettings.type,
      crewSize: crewSettings.size
    }
  };
}