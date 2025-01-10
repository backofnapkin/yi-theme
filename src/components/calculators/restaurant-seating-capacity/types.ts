export interface TableOption {
    id: string;
    type: 'table' | 'booth';
    name: string;
    capacity: number;
    shape: 'square' | 'round' | 'rectangle' | 'single-sided' | 'double-sided';
    dimensions: {
      width: number;
      depth: number;
    };
    spaceRequired: {
      width: number;
      depth: number;
    };
    quantity: number;
  }
  
  export interface SpacingOption {
    id: string;
    name: string;
    value: number;
    description: string;
  }
  
  export interface CalculationResult {
    usedSpace: number;
    remainingSpace: number;
    utilizationPercentage: number;
    totalSeatingCapacity: number;
    remainingSeatingCapacity: number;
    suggestedSeating: TableOption[];
  }