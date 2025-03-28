// src/components/calculators/tree-removal/TreeRemovalUtils.js

/**
 * Tree size options with their height ranges
 */
export const treeHeightOptions = [
    { value: 'Small (up to 10 feet)', label: 'Small (up to 10 feet)', avgCostRange: '$300 - $500' },
    { value: '10–20 feet', label: '10–20 feet', avgCostRange: '$400 - $600' },
    { value: '20–30 feet', label: '20–30 feet', avgCostRange: '$500 - $700' },
    { value: '30–40 feet', label: '30–40 feet', avgCostRange: '$700 - $900' },
    { value: '40–50 feet', label: '40–50 feet', avgCostRange: '$900 - $1,200' },
    { value: '50–60 feet', label: '50–60 feet', avgCostRange: '$1,200 - $1,800' },
    { value: 'Over 60 feet', label: 'Over 60 feet', avgCostRange: '$1,800 - $3,000' }
  ];
  
  /**
   * Tree type options with their difficulty adjustments and reasons
   */
  export const treeTypes = [
    { 
      name: 'General Tree Type', 
      adjustment: 0, 
      reason: 'This category includes common, non-problematic trees that do not add complexity to removal.'
    },
    { 
      name: 'Oak', 
      adjustment: 20, 
      reason: 'Dense wood and large branches increase cutting, lifting, and hauling effort.'
    },
    { 
      name: 'Maple', 
      adjustment: 10, 
      reason: 'Complex branch system and moderate wood density require additional time.'
    },
    { 
      name: 'Pine', 
      adjustment: 10, 
      specialCondition: 'height === "Over 60 feet"',
      reason: 'Lightweight wood offsets challenges; height can complicate removal near homes if over 60 feet in height.'
    },
    { 
      name: 'Birch', 
      adjustment: 0, 
      reason: 'Easy to cut and remove due to light wood and small root systems.'
    },
    { 
      name: 'Palm', 
      adjustment: 15, 
      reason: 'Trunk density and frond removal require specialized tools and time.'
    },
    { 
      name: 'Cedar', 
      adjustment: 10, 
      reason: 'Thick canopy and potential access challenges due to location in hilly or forested areas.'
    },
    { 
      name: 'Cottonwood', 
      adjustment: 15, 
      reason: 'Weak wood and large size increase safety risks, requiring more time and equipment.'
    },
    { 
      name: 'Dogwood', 
      adjustment: 0, 
      reason: 'Small size and soft wood make them straightforward to remove.'
    },
    { 
      name: 'Elm', 
      adjustment: 20, 
      reason: 'Branch density and resistance to cutting tools add time and complexity.'
    },
    { 
      name: 'Sycamore', 
      adjustment: 25, 
      reason: 'Extremely heavy wood, sprawling roots, and large branches require more equipment and labor.'
    },
    { 
      name: 'Spruce', 
      adjustment: 0, 
      reason: 'Generally easy to cut; lightweight wood makes them manageable.'
    },
    { 
      name: 'Fir', 
      adjustment: 0, 
      reason: 'Minimal complexity for removal due to soft wood and manageable branches.'
    },
    { 
      name: 'Unknown', 
      adjustment: 0, 
      reason: 'Using standard pricing without adjustments for unknown tree types.'
    }
  ];
  
  /**
   * Condition options for tree health state
   */
  export const conditionOptions = [
    { name: 'Healthy', adjustment: 0, description: 'No additional difficulty or safety concerns.' },
    { name: 'Dead/Dying', adjustment: 5, description: 'Brittle wood can be unpredictable and requires additional safety measures.' },
    { name: 'Leaning/Dangerous', adjustment: 10, description: 'Requires specialized techniques and additional safety precautions.' }
  ];
  
  /**
   * Location options for tree accessibility
   */
  export const locationOptions = [
    { name: 'Easy Access', adjustment: 0, description: 'Open area, direct equipment access possible.' },
    { name: 'Medium Access', adjustment: 10, description: 'Some obstacles or limited access for equipment.' },
    { name: 'Difficult Access', adjustment: 20, description: 'Hard to reach areas, near structures, power lines, or on steep terrain.' }
  ];
  
  /**
   * Additional service options with default costs
   */
  export const additionalServices = [
    { id: 'stumpRemoval', name: 'Stump Removal', defaultCost: 150, description: 'Complete removal of the stump and major roots.' },
    { id: 'stumpGrinding', name: 'Stump Grinding', defaultCost: 100, description: 'Grinding the stump down below ground level.' },
    { id: 'debrisCleanup', name: 'Debris Cleanup', defaultCost: 200, description: 'Removal of all branches, wood, and foliage from the property.' },
    { id: 'permitFees', name: 'Permit Fees', defaultCost: 75, description: 'Local municipality permits required for removal.' },
    { id: 'emergencyRemoval', name: 'Emergency Removal', defaultCost: 300, description: 'Urgent removal due to hazardous conditions.' }
  ];
  
  /**
   * Calculate tree removal cost based on tree parameters
   *
   * @param {Object} tree - Tree object with all parameters
   * @return {Object} - Object with cost breakdown
   */
  export const calculateTreeCost = (tree) => {
    // Get adjustment percentages
    const treeTypeObj = treeTypes.find(type => type.name === tree.treeType);
    let treeTypeAdjustment = treeTypeObj ? treeTypeObj.adjustment : 0;
    
    // Special handling for Pine trees over 60 feet
    if (tree.treeType === 'Pine' && tree.height === 'Over 60 feet') {
      treeTypeAdjustment = 10;
    } else if (tree.treeType === 'Pine') {
      treeTypeAdjustment = 0;
    }
    
    const conditionObj = conditionOptions.find(cond => cond.name === tree.condition);
    const conditionAdjustment = conditionObj ? conditionObj.adjustment : 0;
    
    const locationObj = locationOptions.find(loc => loc.name === tree.location);
    const locationAdjustment = locationObj ? locationObj.adjustment : 0;
    
    // Calculate base cost with adjustments
    const totalAdjustmentPercent = treeTypeAdjustment + conditionAdjustment + locationAdjustment;
    const adjustedBaseCost = tree.baseCost * (1 + totalAdjustmentPercent / 100);
    
    // Calculate additional costs
    const stumpRemovalCost = tree.stumpRemoval ? tree.stumpRemovalCost : 0;
    const stumpGrindingCost = tree.stumpGrinding ? tree.stumpGrindingCost : 0;
    const debrisCleanupCost = tree.debrisCleanup ? tree.debrisCleanupCost : 0;
    const permitFeesCost = tree.permitFees ? tree.permitFeesCost : 0;
    const emergencyRemovalCost = tree.emergencyRemoval ? tree.emergencyRemovalCost : 0;
    
    // Calculate total cost for this tree
    const totalCost = adjustedBaseCost + stumpRemovalCost + stumpGrindingCost + 
                     debrisCleanupCost + permitFeesCost + emergencyRemovalCost;
    
    return {
      baseCost: tree.baseCost,
      adjustedBaseCost,
      treeTypeAdjustment,
      treeTypeReason: treeTypeObj ? treeTypeObj.reason : '',
      conditionAdjustment,
      locationAdjustment,
      stumpRemovalCost,
      stumpGrindingCost,
      debrisCleanupCost,
      permitFeesCost,
      emergencyRemovalCost,
      totalCost,
    };
  };
  
  /**
   * Format currency values for display
   * 
   * @param {number} amount - Amount to format
   * @return {string} - Formatted currency string
   */
  export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  /**
   * Get estimated cost range based on tree height
   * 
   * @param {string} height - Tree height category
   * @return {string} - Price range
   */
  export const getHeightCostRange = (height) => {
    const option = treeHeightOptions.find(opt => opt.value === height);
    return option ? option.avgCostRange : 'Varies';
  };
  
  /**
   * Calculate recommended base price for a tree based on height
   * 
   * @param {string} height - Tree height category
   * @return {number} - Recommended base price
   */
  export const getRecommendedBasePrice = (height) => {
    switch (height) {
      case 'Small (up to 10 feet)':
        return 400;
      case '10–20 feet':
        return 500;
      case '20–30 feet':
        return 600;
      case '30–40 feet':
        return 800;
      case '40–50 feet':
        return 1000;
      case '50–60 feet':
        return 1500;
      case 'Over 60 feet':
        return 2000;
      default:
        return 800;
    }
  };