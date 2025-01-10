import React, { useState } from 'react';
import { Printer, RotateCcw } from 'lucide-react';
import type { TableOption, SpacingOption, CalculationResult } from './types';
import { DEFAULT_DINING_AREA, MAX_DINING_AREA, TABLE_OPTIONS, BOOTH_OPTIONS, SPACING_OPTIONS } from './constants';
import { InfoTooltip } from './InfoTooltip';
import { SpaceUtilizationDashboard } from './SpaceUtilizationDashboard';
import { SeatingSelector } from './SeatingSelector';

export const RestaurantSeatingCapacityCalculator: React.FC = () => {
  const [diningArea, setDiningArea] = useState(DEFAULT_DINING_AREA);
  const [selectedSpacing, setSelectedSpacing] = useState<SpacingOption>(SPACING_OPTIONS[1]);
  const [tables, setTables] = useState<TableOption[]>(TABLE_OPTIONS);
  const [booths, setBooths] = useState<TableOption[]>(BOOTH_OPTIONS);
  const [results, setResults] = useState<CalculationResult | null>(null);

  const handleTableQuantityChange = (id: string, quantity: number) => {
    setTables(tables.map(table => 
      table.id === id ? { ...table, quantity } : table
    ));
  };

  const handleBoothQuantityChange = (id: string, quantity: number) => {
    setBooths(booths.map(booth => 
      booth.id === id ? { ...booth, quantity } : booth
    ));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  const resetCalculator = () => {
    setDiningArea(DEFAULT_DINING_AREA);
    setSelectedSpacing(SPACING_OPTIONS[1]);
    setTables(TABLE_OPTIONS.map(table => ({ ...table, quantity: 0 })));
    setBooths(BOOTH_OPTIONS.map(booth => ({ ...booth, quantity: 0 })));
    setResults(null);
  };

  const calculateResults = () => {
    let totalUsedSpace = 0;
    let totalSeats = 0;

    [...tables, ...booths].forEach(item => {
      if (item.quantity > 0) {
        const itemSpace = (item.spaceRequired.width + selectedSpacing.value) * 
                         (item.spaceRequired.depth + selectedSpacing.value) * 
                         item.quantity;
        totalUsedSpace += itemSpace;
        totalSeats += item.capacity * item.quantity;
      }
    });

    totalUsedSpace = totalUsedSpace / 144;

    const remainingSpace = Math.max(0, diningArea - totalUsedSpace);
    const utilizationPercentage = (totalUsedSpace / diningArea) * 100;

    const avgSpacePerSeat = 15;
    const remainingSeats = Math.floor(remainingSpace / avgSpacePerSeat);

    const suggestedSeating = generateSuggestedSeating(remainingSpace);

    setResults({
      usedSpace: totalUsedSpace,
      remainingSpace,
      utilizationPercentage,
      totalSeatingCapacity: Math.floor(diningArea / avgSpacePerSeat),
      remainingSeatingCapacity: remainingSeats,
      suggestedSeating
    });
  };

  const generateSuggestedSeating = (remainingSpace: number): TableOption[] => {
    const suggestions: TableOption[] = [];
    if (remainingSpace < 50) return suggestions;

    const options = [...TABLE_OPTIONS, ...BOOTH_OPTIONS];
    options.sort((a, b) => a.spaceRequired.width * a.spaceRequired.depth - 
                          b.spaceRequired.width * b.spaceRequired.depth);

    for (const option of options) {
      const spaceNeeded = (option.spaceRequired.width + selectedSpacing.value) * 
                         (option.spaceRequired.depth + selectedSpacing.value) / 144;
      if (spaceNeeded <= remainingSpace) {
        suggestions.push({
          ...option,
          quantity: Math.floor(remainingSpace / spaceNeeded)
        });
      }
    }

    return suggestions.slice(0, 3);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="print:hidden">
        <h1 className="text-3xl font-bold mb-6 text-[rgb(80,73,69)]">Restaurant Seating Capacity Calculator</h1>
        
        <div className="space-y-6 bg-[rgb(251,251,251)] p-6 rounded-lg border border-[rgb(104,157,106)] shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-lg font-medium text-[rgb(80,73,69)]">
                Total Dining Area
                <InfoTooltip text="Enter the total square footage of your dining area, excluding kitchen, restrooms, and storage areas." />
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  placeholder={DEFAULT_DINING_AREA.toString()}
                  value={diningArea || ''}
                  onChange={(e) => setDiningArea(Math.min(MAX_DINING_AREA, Math.max(0, Number(e.target.value))))}
                  onFocus={handleFocus}
                  onWheel={handleWheel}
                  className="w-full px-4 py-2 border border-[rgb(104,157,106)] rounded-md focus:ring-2 focus:ring-[rgb(14,192,124)] focus:border-[rgb(14,192,124)] bg-white"
                  min="0"
                  max={MAX_DINING_AREA}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center text-lg font-medium text-[rgb(80,73,69)]">
                Table Spacing
                <InfoTooltip text="Select the desired spacing between tables for optimal comfort and flow." />
              </label>
              <select
                value={selectedSpacing.id}
                onChange={(e) => setSelectedSpacing(SPACING_OPTIONS.find(opt => opt.id === e.target.value) || SPACING_OPTIONS[1])}
                className="mt-2 w-full px-4 py-2 border border-[rgb(104,157,106)] rounded-md focus:ring-2 focus:ring-[rgb(14,192,124)] focus:border-[rgb(14,192,124)] bg-white"
              >
                {SPACING_OPTIONS.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name} ({option.value}") - {option.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 text-[rgb(80,73,69)]">Table Options</h3>
            <SeatingSelector
              options={tables}
              onQuantityChange={handleTableQuantityChange}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 text-[rgb(80,73,69)]">Booth Options</h3>
            <SeatingSelector
              options={booths}
              onQuantityChange={handleBoothQuantityChange}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={calculateResults}
              className="flex-1 bg-[rgb(14,192,124)] text-white py-3 px-6 rounded-lg hover:bg-[rgb(12,172,111)] transition-colors"
            >
              Calculate Seating Space
            </button>
            <button
              onClick={resetCalculator}
              className="flex items-center justify-center gap-2 bg-[rgb(241,241,241)] text-[rgb(80,73,69)] py-3 px-6 rounded-lg hover:bg-[rgb(231,231,231)] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {results && (
        <div className="space-y-6 print:mt-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[rgb(80,73,69)]">Results</h2>
            <button
              onClick={handlePrint}
              className="print:hidden flex items-center gap-2 px-4 py-2 bg-[rgb(241,241,241)] rounded-lg hover:bg-[rgb(231,231,231)] transition-colors text-[rgb(80,73,69)]"
            >
              <Printer className="w-4 h-4" />
              Print Results
            </button>
          </div>

          <SpaceUtilizationDashboard
            usedSpace={results.usedSpace}
            remainingSpace={results.remainingSpace}
            utilizationPercentage={results.utilizationPercentage}
          />
<div className="calc-panel p-6 rounded-lg border border-[rgb(var(--color-border))] shadow-md">
  <h3 className="text-xl font-semibold mb-4 text-[rgb(var(--color-text))]">Seating Capacity</h3>
  <div className="grid md:grid-cols-2 gap-4">
    <div className="p-4 calc-panel-secondary rounded-lg">
      <p className="text-sm text-[rgb(var(--color-text))]">Total Possible Capacity</p>
      <p className="text-2xl font-bold text-[rgb(var(--color-text-active))]">{results.totalSeatingCapacity} seats</p>
    </div>
    <div className="p-4 calc-panel-secondary rounded-lg">
      <p className="text-sm text-[rgb(var(--color-text))]">Remaining Capacity</p>
      <p className="text-2xl font-bold text-[rgb(var(--color-text-active))]">{results.remainingSeatingCapacity} seats</p>
    </div>
  </div>
</div>

          {results.utilizationPercentage > 100 && (
            <div className="bg-[rgb(254,242,242)] border-l-4 border-[rgb(239,68,68)] p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  ⚠️
                </div>
                <div className="ml-3">
                  <p className="text-[rgb(185,28,28)]">
                    Warning: The selected seating arrangement exceeds the available space. 
                    Please reduce the number of tables or booths.
                  </p>
                </div>
              </div>
            </div>
          )}

          {results.suggestedSeating.length > 0 && (
            <div className="bg-[rgb(251,251,251)] p-6 rounded-lg border border-[rgb(104,157,106)] shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-[rgb(80,73,69)]">Suggested Additional Seating</h3>
              <div className="space-y-3">
                {results.suggestedSeating.map((suggestion, index) => (
                  <div key={index} className="p-3 bg-[rgb(241,241,241)] rounded-lg">
                    <p className="text-[rgb(80,73,69)]">
                      {suggestion.quantity}x {suggestion.name} 
                      (adds {suggestion.quantity * suggestion.capacity} seats)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};