import React from 'react';
import { Clock, DollarSign, Scissors, Wind, ChevronDown, Users, Info } from 'lucide-react';
import { Tooltip } from '../../../ui/Tooltip';
import type { CalculationResult } from '../types';

interface Props {
  results: CalculationResult;
  hourlyRate: number;
}

export const CalculatorResults: React.FC<Props> = ({ results, hourlyRate }) => {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div className="mt-2 space-y-3 bg-gray-50 p-2 rounded-lg">
      <h2 className="text-2xl font-bold text-center">Mowing Time Estimate:</h2>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Clock className="w-5 h-5" />
            <h3 className="font-semibold">Total Time</h3>
            <Tooltip content="Total estimated time to complete the job, including mowing, cleanup, and all condition adjustments. Accounts for crew size efficiency.">
              <Info className="w-4 h-4 text-emerald-600 cursor-help" />
            </Tooltip>
          </div>
          <p className="text-2xl font-bold text-skin-emerald-text">{results.totalMinutes} minutes</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <Scissors className="w-5 h-5" />
            <h3 className="font-semibold">Mowing Only</h3>
            <Tooltip content="Base time for just mowing, before adding time for obstacles, cleanup, or crew efficiency adjustments.">
              <Info className="w-4 h-4 text-emerald-600 cursor-help" />
            </Tooltip>
          </div>
          <p className="text-2xl font-bold text-skin-emerald-text">{results.mowingOnlyMinutes} minutes</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <DollarSign className="w-5 h-5" />
            <h3 className="font-semibold">Target Charge</h3>
            <Tooltip content="Recommended price based on total time and hourly rate per crew member. Includes all time adjustments and crew costs.">
              <Info className="w-4 h-4 text-emerald-600 cursor-help" />
            </Tooltip>
          </div>
          <p className="text-2xl font-bold text-skin-red-text">
            ${results.targetCharge.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Based on ${hourlyRate}/hour per person ({results.breakdown.crewSize} {results.breakdown.crewSize === 1 ? 'person' : 'people'})
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <Wind className="w-5 h-5" />
            <h3 className="font-semibold">Time Summary</h3>
            <Tooltip content="Breakdown of time additions and reductions, including base mowing time, condition adjustments, cleanup time, and crew efficiency savings.">
              <Info className="w-4 h-4 text-emerald-600 cursor-help" />
            </Tooltip>
          </div>
          <ul className="space-y-1 text-sm">
            <li>Base Mowing: {results.breakdown.baseMowingTime} min</li>
            <li>Conditions: +{results.breakdown.conditionAdjustments} min</li>
            <li>Blower Time: +{results.breakdown.blowerTime} min</li>
            <li>Crew Efficiency: -{results.breakdown.crewEfficiencyReduction} min</li>
          </ul>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 w-full text-left text-gray-700 font-semibold"
        >
          <ChevronDown className={`w-5 h-5 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          Detailed Time Breakdown
          <Tooltip content="Comprehensive breakdown of all time calculations, including specific adjustments for each lawn condition and crew efficiency details.">
            <Info className="w-4 h-4 text-emerald-600 cursor-help" />
          </Tooltip>
        </button>
        
        {showDetails && (
          <div className="bg-gradient-to-br from-orange-100 to-amber-100 border border-amber-200 p-6 rounded-lg shadow-md mt-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Base Mowing Time</h4>
                <p className="text-sm text-blue-700">
                  {results.breakdown.baseMowingTime} minutes for basic mowing
                </p>
              </div>

              {results.breakdown.conditionDetails && (
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Condition Adjustments</h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    {results.breakdown.conditionDetails.trees > 0 && (
                      <li>• Trees: +{results.breakdown.conditionDetails.trees} min ({results.breakdown.conditionDetails.treeCount} trees × 1 min each)</li>
                    )}
                    {results.breakdown.conditionDetails.parkway > 0 && (
                      <li>• Parkway: +{results.breakdown.conditionDetails.parkway} min (5 min per 2,500 sq ft)</li>
                    )}
                    {results.breakdown.conditionDetails.flowerBeds > 0 && (
                      <li>• Flower Beds: +{results.breakdown.conditionDetails.flowerBeds} min (5 min per 2,500 sq ft)</li>
                    )}
                    {results.breakdown.conditionDetails.fence > 0 && (
                      <li>• Fence Line: +{results.breakdown.conditionDetails.fence} min (5 min per 2,500 sq ft)</li>
                    )}
                    {results.breakdown.conditionDetails.overgrown > 0 && (
                      <li>• Overgrown Grass: +{results.breakdown.conditionDetails.overgrown} min (5 min per 1,000 sq ft)</li>
                    )}
                    {results.breakdown.conditionDetails.sloped > 0 && (
                      <li>• Sloped Terrain: +{results.breakdown.conditionDetails.sloped} min (5 min per 1,000 sq ft)</li>
                    )}
                    {results.breakdown.conditionDetails.wet > 0 && (
                      <li>• Wet Grass: +{results.breakdown.conditionDetails.wet} min (1 min per 1,000 sq ft)</li>
                    )}
                    {results.breakdown.conditionDetails.petWaste > 0 && (
                      <li>• Pet Waste: +{results.breakdown.conditionDetails.petWaste} min (2 min per 1,000 sq ft)</li>
                    )}
                    {results.breakdown.conditionDetails.playsets > 0 && (
                      <li>• Play Sets: +{results.breakdown.conditionDetails.playsets} min (1 min per 1,000 sq ft)</li>
                    )}
                    {results.breakdown.conditionDetails.other > 0 && (
                      <li>• Other Obstacles: +{results.breakdown.conditionDetails.other} min (2 min per 1,000 sq ft)</li>
                    )}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Cleanup & Crew</h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>Cleanup: +{results.breakdown.blowerTime} minutes
                    <div className="text-blue-600 text-xs mt-1">
                      Using {results.breakdown.blowerType} ({
                        results.breakdown.blowerType === 'backpack' ? '3 min' :
                        results.breakdown.blowerType === 'handheld' ? '10 min' :
                        '60 min'
                      } per 1,000 sq ft)
                    </div>
                  </li>
                  <li className="mt-2">
                    Crew Efficiency: {results.breakdown.crewSize} {results.breakdown.crewSize === 1 ? 'person' : 'people'}
                    <div className="text-blue-600 text-xs mt-1">
                      {results.breakdown.crewSize === 1 ? 'No time reduction' :
                       results.breakdown.crewSize === 2 ? '45% time reduction' :
                       results.breakdown.crewSize === 3 ? '65% time reduction' :
                       '75% time reduction'}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};