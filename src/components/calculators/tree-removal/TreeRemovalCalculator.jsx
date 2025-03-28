// src/components/calculators/tree-removal/TreeRemovalCalculator.jsx
import React, { useState, useEffect } from 'react';
import { 
  treeHeightOptions, 
  treeTypes, 
  conditionOptions, 
  locationOptions, 
  additionalServices,
  calculateTreeCost,
  formatCurrency,
  getRecommendedBasePrice
} from './TreeRemovalUtils';
import './TreeRemovalPrint.css';

const TreeRemovalCalculator = () => {
  // Default property name
  const [propertyName, setPropertyName] = useState("Dan's House");
  
  // Tree entries state (array of tree objects)
  const [trees, setTrees] = useState([
    {
      id: 1,
      height: '30–40 feet',
      baseCost: 800,
      treeType: 'General Tree Type',
      condition: 'Healthy',
      location: 'Easy Access',
      stumpRemoval: false,
      stumpRemovalCost: 150,
      stumpGrinding: false,
      stumpGrindingCost: 100,
      debrisCleanup: false,
      debrisCleanupCost: 200,
      permitFees: false,
      permitFeesCost: 75,
      emergencyRemoval: false,
      emergencyRemovalCost: 300
    }
  ]);
  
  // Track the next tree ID
  const [nextTreeId, setNextTreeId] = useState(2);
  
  // Results state
  const [showResults, setShowResults] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [treeCosts, setTreeCosts] = useState([]);

  // Add a new tree to the list
  const addTree = () => {
    const defaultHeight = '30–40 feet';
    const newTree = {
      id: nextTreeId,
      height: defaultHeight,
      baseCost: getRecommendedBasePrice(defaultHeight),
      treeType: 'General Tree Type',
      condition: 'Healthy',
      location: 'Easy Access',
      stumpRemoval: false,
      stumpRemovalCost: additionalServices.find(s => s.id === 'stumpRemoval').defaultCost,
      stumpGrinding: false,
      stumpGrindingCost: additionalServices.find(s => s.id === 'stumpGrinding').defaultCost,
      debrisCleanup: false,
      debrisCleanupCost: additionalServices.find(s => s.id === 'debrisCleanup').defaultCost,
      permitFees: false,
      permitFeesCost: additionalServices.find(s => s.id === 'permitFees').defaultCost,
      emergencyRemoval: false,
      emergencyRemovalCost: additionalServices.find(s => s.id === 'emergencyRemoval').defaultCost,
    };
    
    setTrees([...trees, newTree]);
    setNextTreeId(nextTreeId + 1);
  };
  
  // Remove a tree from the list
  const removeTree = (id) => {
    if (trees.length > 1) {
      setTrees(trees.filter(tree => tree.id !== id));
    }
  };
  
  // Update a tree property
  const updateTree = (id, field, value) => {
    setTrees(
      trees.map(tree => {
        if (tree.id !== id) return tree;
        
        // Special case: if height changes, suggest new base cost
        if (field === 'height') {
          return { 
            ...tree, 
            [field]: value,
            baseCost: getRecommendedBasePrice(value)
          };
        }
        
        return { ...tree, [field]: value };
      })
    );
  };
  
  // Handle checkbox changes with cost
  const handleCheckboxChange = (id, field) => {
    setTrees(
      trees.map(tree => 
        tree.id === id ? { ...tree, [field]: !tree[field] } : tree
      )
    );
  };
  
  // Calculate all costs
  const calculateCosts = () => {
    const calculatedTreeCosts = trees.map(tree => ({
      ...tree,
      ...calculateTreeCost(tree)
    }));
    
    setTreeCosts(calculatedTreeCosts);
    
    // Calculate overall total
    const overall = calculatedTreeCosts.reduce(
      (sum, tree) => sum + tree.totalCost, 0
    );
    
    setTotalCost(overall);
    setShowResults(true);
  };
  
  // Reset the form
  const resetCalculator = () => {
    setShowResults(false);
  };
  
  // Print the estimate
  const printEstimate = () => {
    // Set visible flag first
    setShowResults(true);
    
    // Add a class to the body to control print styles
    document.body.classList.add('printing-estimate');
    
    // Short delay to ensure DOM is updated before printing
    setTimeout(() => {
      // Print the estimate
      window.print();
      
      // Remove the class after printing
      setTimeout(() => {
        document.body.classList.remove('printing-estimate');
      }, 500);
    }, 100);
  };
  
  return (
    <div className="tree-removal-calculator mt-8 bg-white rounded-lg shadow-md">
      {/* Input Form */}
      <div className={`calculator-form p-6 ${showResults ? 'hidden print:block' : ''}`}>
        <h2 className="text-2xl font-bold mb-6 text-skin-base">Tree Removal Cost Calculator</h2>
        
        <div className="mb-4">
          <label htmlFor="propertyName" className="block text-sm font-medium text-gray-700 mb-1">
            Property Name
          </label>
          <input
            type="text"
            id="propertyName"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
          />
        </div>
        
        {trees.map((tree, index) => (
          <div key={tree.id} className="tree-entry border border-gray-200 rounded p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-skin-base">Tree #{index + 1}</h3>
              {trees.length > 1 && (
                <button
                  type="button"
                  className="text-red-600 hover:text-red-800"
                  onClick={() => removeTree(tree.id)}
                >
                  Remove Tree
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tree Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tree Size (Height)
                </label>
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={tree.height}
                  onChange={(e) => updateTree(tree.id, 'height', e.target.value)}
                >
                  {treeHeightOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} ({option.avgCostRange})
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Base Cost */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Tree Removal Cost
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                  <input
                    type="number"
                    className="w-full p-2 pl-7 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={tree.baseCost}
                    onChange={(e) => updateTree(tree.id, 'baseCost', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              {/* Tree Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tree Type
                </label>
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={tree.treeType}
                  onChange={(e) => updateTree(tree.id, 'treeType', e.target.value)}
                >
                  {treeTypes.map(type => (
                    <option key={type.name} value={type.name}>
                      {type.name} {type.adjustment > 0 ? `(+${type.adjustment}%)` : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Tree Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition
                </label>
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={tree.condition}
                  onChange={(e) => updateTree(tree.id, 'condition', e.target.value)}
                >
                  {conditionOptions.map(option => (
                    <option key={option.name} value={option.name}>
                      {option.name} {option.adjustment > 0 ? `(+${option.adjustment}%)` : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  value={tree.location}
                  onChange={(e) => updateTree(tree.id, 'location', e.target.value)}
                >
                  {locationOptions.map(option => (
                    <option key={option.name} value={option.name}>
                      {option.name} {option.adjustment > 0 ? `(+${option.adjustment}%)` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-md font-medium mb-2 text-skin-base">Additional Services</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stump Removal */}
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      type="checkbox"
                      id={`stumpRemoval-${tree.id}`}
                      checked={tree.stumpRemoval}
                      onChange={() => handleCheckboxChange(tree.id, 'stumpRemoval')}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </div>
                  <div className="ml-3 flex-grow">
                    <label htmlFor={`stumpRemoval-${tree.id}`} className="text-sm font-medium text-gray-700">
                      Stump Removal
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      <input
                        type="number"
                        className="w-full p-1 pl-7 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mt-1"
                        value={tree.stumpRemovalCost}
                        onChange={(e) => updateTree(tree.id, 'stumpRemovalCost', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Stump Grinding */}
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      type="checkbox"
                      id={`stumpGrinding-${tree.id}`}
                      checked={tree.stumpGrinding}
                      onChange={() => handleCheckboxChange(tree.id, 'stumpGrinding')}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </div>
                  <div className="ml-3 flex-grow">
                    <label htmlFor={`stumpGrinding-${tree.id}`} className="text-sm font-medium text-gray-700">
                      Stump Grinding
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      <input
                        type="number"
                        className="w-full p-1 pl-7 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mt-1"
                        value={tree.stumpGrindingCost}
                        onChange={(e) => updateTree(tree.id, 'stumpGrindingCost', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Debris Cleanup */}
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      type="checkbox"
                      id={`debrisCleanup-${tree.id}`}
                      checked={tree.debrisCleanup}
                      onChange={() => handleCheckboxChange(tree.id, 'debrisCleanup')}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </div>
                  <div className="ml-3 flex-grow">
                    <label htmlFor={`debrisCleanup-${tree.id}`} className="text-sm font-medium text-gray-700">
                      Debris Cleanup
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      <input
                        type="number"
                        className="w-full p-1 pl-7 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mt-1"
                        value={tree.debrisCleanupCost}
                        onChange={(e) => updateTree(tree.id, 'debrisCleanupCost', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Permit Fees */}
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      type="checkbox"
                      id={`permitFees-${tree.id}`}
                      checked={tree.permitFees}
                      onChange={() => handleCheckboxChange(tree.id, 'permitFees')}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </div>
                  <div className="ml-3 flex-grow">
                    <label htmlFor={`permitFees-${tree.id}`} className="text-sm font-medium text-gray-700">
                      Permit Fees
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      <input
                        type="number"
                        className="w-full p-1 pl-7 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mt-1"
                        value={tree.permitFeesCost}
                        onChange={(e) => updateTree(tree.id, 'permitFeesCost', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Emergency Removal */}
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      type="checkbox"
                      id={`emergencyRemoval-${tree.id}`}
                      checked={tree.emergencyRemoval}
                      onChange={() => handleCheckboxChange(tree.id, 'emergencyRemoval')}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </div>
                  <div className="ml-3 flex-grow">
                    <label htmlFor={`emergencyRemoval-${tree.id}`} className="text-sm font-medium text-gray-700">
                      Emergency Removal
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      <input
                        type="number"
                        className="w-full p-1 pl-7 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mt-1"
                        value={tree.emergencyRemovalCost}
                        onChange={(e) => updateTree(tree.id, 'emergencyRemovalCost', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="mb-4">
          <button
            type="button"
            className="bg-gradient-to-br from-green-500 to-emerald-500 text-white py-2 px-4 rounded hover:bg-green-600"
            onClick={addTree}
          >
            Add Another Tree
          </button>
        </div>
        
        <div className="mt-6">
          <button
            type="button"
            className="bg-gradient-to-br from-green-300 to-emerald-300 text-emerald-700 py-2 px-6 rounded-lg text-lg font-medium border-2 border-emerald-500 hover:bg-emerald-100"
            onClick={calculateCosts}
          >
            Calculate Tree Removal Cost
          </button>
        </div>
      </div>
      
      {/* Results Section */}
      <div className={`results p-6 ${showResults ? 'block' : 'hidden print:block'}`} id="results-section">
        <div className="mb-4 print:hidden">
          <button
            type="button"
            className="text-emerald-600 hover:text-emerald-800 mr-4"
            onClick={resetCalculator}
          >
            ← Back to Calculator
          </button>
          <button
            type="button"
            className="bg-gradient-to-br from-green-300 to-emerald-300 text-emerald-700 py-1 px-4 rounded border-2 border-emerald-500 hover:bg-emerald-100"
            onClick={printEstimate}
          >
            Print Estimate
          </button>
        </div>
        
        <div className="bg-white p-6 border border-gray-200 rounded-lg print:border-none printable-estimate">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-skin-base">{propertyName} Tree Removal Estimate</h2>
            <p className="text-gray-500">Estimate Date: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold mb-2 text-skin-base">Total Estimate: {formatCurrency(totalCost)}</h3>
          </div>
          
          {treeCosts.map((tree, index) => (
            <div key={tree.id} className="mb-8 pb-6 border-b border-gray-200 last:border-b-0">
              <h3 className="text-lg font-semibold mb-3 text-skin-base">Tree #{index + 1} - {tree.height}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-skin-base">Tree Details:</h4>
                  <ul className="space-y-1 mt-1">
                    <li><span className="text-gray-600">Type:</span> {tree.treeType}</li>
                    <li><span className="text-gray-600">Condition:</span> {tree.condition}</li>
                    <li><span className="text-gray-600">Location:</span> {tree.location}</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-skin-base">Cost Breakdown:</h4>
                  <ul className="space-y-1 mt-1">
                    <li><span className="text-gray-600">Base Removal Cost:</span> {formatCurrency(tree.baseCost)}</li>
                    
                    {(tree.treeTypeAdjustment > 0 || tree.conditionAdjustment > 0 || tree.locationAdjustment > 0) && (
                      <li>
                        <span className="text-gray-600">Complexity Adjustments:</span>
                        <ul className="pl-4">
                          {tree.treeTypeAdjustment > 0 && (
                            <li><span className="text-gray-600">Tree Type ({tree.treeType}):</span> +{tree.treeTypeAdjustment}%</li>
                          )}
                          {tree.conditionAdjustment > 0 && (
                            <li><span className="text-gray-600">Condition ({tree.condition}):</span> +{tree.conditionAdjustment}%</li>
                          )}
                          {tree.locationAdjustment > 0 && (
                            <li><span className="text-gray-600">Location ({tree.location}):</span> +{tree.locationAdjustment}%</li>
                          )}
                        </ul>
                      </li>
                    )}
                    
                    <li><span className="text-gray-600">Adjusted Base Cost:</span> {formatCurrency(tree.adjustedBaseCost)}</li>
                    
                    {tree.stumpRemovalCost > 0 && (
                      <li><span className="text-gray-600">Stump Removal:</span> {formatCurrency(tree.stumpRemovalCost)}</li>
                    )}
                    
                    {tree.stumpGrindingCost > 0 && (
                      <li><span className="text-gray-600">Stump Grinding:</span> {formatCurrency(tree.stumpGrindingCost)}</li>
                    )}
                    
                    {tree.debrisCleanupCost > 0 && (
                      <li><span className="text-gray-600">Debris Cleanup:</span> {formatCurrency(tree.debrisCleanupCost)}</li>
                    )}
                    
                    {tree.permitFeesCost > 0 && (
                      <li><span className="text-gray-600">Permit Fees:</span> {formatCurrency(tree.permitFeesCost)}</li>
                    )}
                    
                    {tree.emergencyRemovalCost > 0 && (
                      <li><span className="text-gray-600">Emergency Removal:</span> {formatCurrency(tree.emergencyRemovalCost)}</li>
                    )}
                    
                    <li className="font-semibold mt-2"><span className="text-gray-600">Total for this tree:</span> {formatCurrency(tree.totalCost)}</li>
                  </ul>
                </div>
              </div>
              
              {tree.treeTypeAdjustment > 0 && (
                <div className="mt-3 text-sm bg-gray-50 p-3 rounded">
                  <p><strong>Note on {tree.treeType} trees:</strong> {tree.treeTypeReason}</p>
                </div>
              )}
            </div>
          ))}
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-skin-base">National Averages for Tree Removal:</h3>
            <ul className="space-y-1">
              <li>Small (up to 30 feet): $500 - $700</li>
              <li>Medium (30–60 feet): $700 - $900</li>
              <li>Large (over 60 feet): $900 - $3,000</li>
            </ul>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">This estimate is based on current industry standards and local averages. Actual costs may vary based on specific conditions found during on-site assessment. This estimate is valid for 30 days from the date shown above.</p>
            <p className="text-sm text-gray-600 mt-2">For a detailed on-site estimate, please contact our professional tree removal team.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeRemovalCalculator;