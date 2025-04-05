import React from 'react';

const MenuItem = ({ item, updateItem, removeItem, isRemovable }) => {
  // Improved input handling to allow deletion and better user experience
  const handleChange = (field, value) => {
    if (['price', 'unitsSold', 'ingredientCost', 'packagingCost'].includes(field)) {
      // Allow empty string for better UX when clearing fields
      if (value === '') {
        updateItem(item.id, field, '');
        return;
      }
      
      // Convert to number if it's a valid number
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        updateItem(item.id, field, numValue);
      }
    } else {
      updateItem(item.id, field, value);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">Menu Item</h4>
        {isRemovable && (
          <button 
            type="button" 
            onClick={() => removeItem(item.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Remove menu item"
          >
            <i className="ri-delete-bin-line"></i>
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="form-group">
          <label htmlFor={`menu-item-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">
            Menu Item
          </label>
          <input 
            type="text" 
            id={`menu-item-${item.id}`} 
            value={item.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor={`price-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">
            Price per Unit ($)
          </label>
          <input 
            type="number" 
            id={`price-${item.id}`} 
            value={item.price}
            onChange={(e) => handleChange('price', e.target.value)}
            step="0.01" 
            min="0" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor={`units-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">
            Units Sold per Day
          </label>
          <input 
            type="number" 
            id={`units-${item.id}`} 
            value={item.unitsSold}
            onChange={(e) => handleChange('unitsSold', e.target.value)}
            step="1" 
            min="0" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor={`ingredient-cost-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">
            Cost of Ingredients ($)
          </label>
          <input 
            type="number" 
            id={`ingredient-cost-${item.id}`} 
            value={item.ingredientCost}
            onChange={(e) => handleChange('ingredientCost', e.target.value)}
            step="0.01" 
            min="0" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor={`packaging-cost-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">
            Packaging Costs ($)
          </label>
          <input 
            type="number" 
            id={`packaging-cost-${item.id}`} 
            value={item.packagingCost}
            onChange={(e) => handleChange('packagingCost', e.target.value)}
            step="0.01" 
            min="0" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            required
          />
        </div>
      </div>
    </div>
  );
};

export default MenuItem;