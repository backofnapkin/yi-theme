export interface MowerSettings {
    width: number;
    type: 'push' | 'riding' | 'residential-zero-turn' | 'commercial-zero-turn';
  }
  
  export interface LawnConditions {
    trees: number;
    hasParkway: boolean;
    hasFlowerBeds: boolean;
    hasFence: boolean;
    isOvergrown: boolean;
    isSloped: boolean;
    isWet: boolean;
    hasPetWaste: boolean;
    hasPlaysets: boolean;
    hasOther: boolean;
  }
  
  export interface CrewSettings {
    size: 1 | 2 | 3 | 4;
    hourlyRate: number;
  }
  
  export interface BlowerSettings {
    type: 'backpack' | 'handheld' | 'manual';
  }
  
  export interface CalculationResult {
    totalMinutes: number;
    mowingOnlyMinutes: number;
    targetCharge: number;
    breakdown: {
      baseMowingTime: number;
      conditionAdjustments: number;
      blowerTime: number;
      crewEfficiencyReduction: number;
      conditionDetails?: {
        trees: number;
        treeCount: number;
        parkway: number;
        flowerBeds: number;
        fence: number;
        overgrown: number;
        sloped: number;
        wet: number;
        petWaste: number;
        playsets: number;
        other: number;
      };
      blowerType?: 'backpack' | 'handheld' | 'manual';
      crewSize: number;
    };
  }