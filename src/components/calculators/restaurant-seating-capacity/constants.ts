import type { SpacingOption, TableOption } from './types';

export const DEFAULT_DINING_AREA = 1000;
export const MAX_DINING_AREA = 20000;

export const TABLE_OPTIONS: TableOption[] = [
  {
    id: '2p-table',
    type: 'table',
    name: '2-Person Table',
    capacity: 2,
    shape: 'square',
    dimensions: { width: 24, depth: 24 },
    spaceRequired: { width: 60, depth: 60 },
    quantity: 0
  },
  {
    id: '4p-table',
    type: 'table',
    name: '4-Person Table',
    capacity: 4,
    shape: 'square',
    dimensions: { width: 36, depth: 36 },
    spaceRequired: { width: 72, depth: 72 },
    quantity: 2
  },
  {
    id: '6p-table',
    type: 'table',
    name: '6-Person Table',
    capacity: 6,
    shape: 'rectangle',
    dimensions: { width: 36, depth: 60 },
    spaceRequired: { width: 72, depth: 96 },
    quantity: 0
  },
  {
    id: '8p-table',
    type: 'table',
    name: '8-Person Table',
    capacity: 8,
    shape: 'rectangle',
    dimensions: { width: 36, depth: 72 },
    spaceRequired: { width: 96, depth: 96 },
    quantity: 0
  }
];

export const BOOTH_OPTIONS: TableOption[] = [
  {
    id: '2p-booth',
    type: 'booth',
    name: '2-Person Booth (Single-Sided)',
    capacity: 2,
    shape: 'single-sided',
    dimensions: { width: 48, depth: 24 },
    spaceRequired: { width: 48, depth: 60 }, // Including 36" aisle space
    quantity: 0
  },
  {
    id: '4p-booth',
    type: 'booth',
    name: '4-Person Booth (Double-Sided)',
    capacity: 4,
    shape: 'double-sided',
    dimensions: { width: 48, depth: 48 },
    spaceRequired: { width: 48, depth: 84 }, // Including 36" aisle space
    quantity: 2
  },
  {
    id: '6p-booth',
    type: 'booth',
    name: '6-Person Booth',
    capacity: 6,
    shape: 'double-sided',
    dimensions: { width: 72, depth: 48 },
    spaceRequired: { width: 72, depth: 84 }, // Including 36" aisle space
    quantity: 0
  },
  {
    id: '8p-booth',
    type: 'booth',
    name: '8-Person Booth',
    capacity: 8,
    shape: 'double-sided',
    dimensions: { width: 96, depth: 48 },
    spaceRequired: { width: 96, depth: 84 }, // Including 36" aisle space
    quantity: 0
  }
];

export const SPACING_OPTIONS: SpacingOption[] = [
  {
    id: 'tight',
    name: 'Tight',
    value: 18,
    description: 'Ideal for small spaces'
  },
  {
    id: 'standard',
    name: 'Standard',
    value: 24,
    description: 'Recommended for comfort'
  },
  {
    id: 'spacious',
    name: 'Spacious',
    value: 30,
    description: 'For fine dining or luxury experience'
  }
];