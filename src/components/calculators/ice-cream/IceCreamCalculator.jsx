import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { calculateMonthlyRevenue, seasonalityFactors } from './seasonality.js';
import { calculateProfits } from './calculations.js';
import MenuItem from './MenuItem.jsx';
import ExpenseItem from './ExpenseItem.jsx';
import ResultsSection from './ResultsSection.jsx';

const IceCreamCalculator = () => {
  // Menu items state
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Scoop',
      price: 6,
      unitsSold: 75,
      ingredientCost: 1,
      packagingCost: 0.45
    }
  ]);

  // Operations state
  const [operations, setOperations] = useState({
    daysOpen: 7,
    monthsOpen: 12,
    wastePercentage: 2.5,
    revenueGrowth: 5,   // Annual revenue growth percentage
    expenseGrowth: 3    // Annual expense growth percentage
  });

  // Expenses state
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Labor', amount: 5000 },
    { id: 2, name: 'Lease', amount: 4000 }
    // Removed Utilities from default expenses
  ]);

  // Results state
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Effect to calculate results when inputs change
  useEffect(() => {
    if (showResults) {
      calculateResults();
    }
  }, [menuItems, operations, expenses, showResults]);

  // Add a new menu item
  const addMenuItem = () => {
    const newId = menuItems.length > 0 ? Math.max(...menuItems.map(item => item.id)) + 1 : 1;
    setMenuItems([
      ...menuItems,
      {
        id: newId,
        name: 'New Item',
        price: 6,
        unitsSold: 50,
        ingredientCost: 1,
        packagingCost: 0.45
      }
    ]);
  };

  // Update menu item properties
  const updateMenuItem = (id, field, value) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Remove a menu item
  const removeMenuItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  // Update operations settings
  const updateOperations = (field, value) => {
    setOperations({
      ...operations,
      [field]: value
    });
  };

  // Add a new expense
  const addExpense = () => {
    const newId = expenses.length > 0 ? Math.max(...expenses.map(expense => expense.id)) + 1 : 1;
    setExpenses([
      ...expenses,
      {
        id: newId,
        name: 'New Expense',
        amount: 0
      }
    ]);
  };

  // Update expense properties
  const updateExpense = (id, field, value) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
  };

  // Remove an expense
  const removeExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Calculate results
  const calculateResults = () => {
    // Call the calculation function from calculations.js
    const calculatedResults = calculateProfits(menuItems, operations, expenses);
    setResults(calculatedResults);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowResults(true);
    calculateResults();
  };

  // Handle data export
  const exportData = () => {
    if (!results) return;
    
    let exportText = "ICE CREAM BUSINESS PROFIT CALCULATOR RESULTS\n\n";
    
    // Add menu items
    exportText += "MENU ITEMS:\n";
    menuItems.forEach(item => {
      exportText += `- ${item.name}: $${item.price} per unit, ${item.unitsSold} units sold per day\n`;
      exportText += `  Costs: $${item.ingredientCost} ingredients, $${item.packagingCost} packaging\n`;
    });
    
    // Add operations
    exportText += "\nOPERATIONS:\n";
    exportText += `- Days Open: ${operations.daysOpen} days per week\n`;
    exportText += `- Months Open: ${operations.monthsOpen} months per year\n`;
    exportText += `- Waste Percentage: ${operations.wastePercentage}%\n`;
    exportText += `- Annual Revenue Growth: ${operations.revenueGrowth}%\n`;
    exportText += `- Annual Expense Growth: ${operations.expenseGrowth}%\n`;
    
    // Add expenses
    exportText += "\nMONTHLY EXPENSES:\n";
    expenses.forEach(expense => {
      exportText += `- ${expense.name}: $${expense.amount.toFixed(2)}\n`;
    });
    
    // Add results
    exportText += "\nSALES PROJECTIONS:\n";
    exportText += `- Daily Sales: $${results.dailyRevenue.toFixed(2)}\n`;
    exportText += `- Monthly Sales: $${results.monthlyRevenue.toFixed(2)}\n`;
    exportText += `- Annual Sales: $${results.annualRevenue.toFixed(2)}\n\n`;
    
    // Add profit results
    exportText += "PROFIT PROJECTIONS:\n";
    exportText += `- Daily Profit: $${results.dailyProfit.toFixed(2)}\n`;
    exportText += `- Monthly Profit: $${results.monthlyProfit.toFixed(2)}\n`;
    exportText += `- Annual Profit: $${results.annualProfit.toFixed(2)}\n\n`;
    
    // Per unit profit
    exportText += "PROFIT PER UNIT:\n";
    results.profitPerUnit.forEach(item => {
      exportText += `- ${item.name}: $${item.profit.toFixed(2)} profit per unit, ${item.margin.toFixed(1)}% margin\n`;
    });
    
    // Create and trigger download
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ice-cream-business-projection.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy results to clipboard - Updated to match text file contents
  const copyResults = () => {
    if (!results) return;
    
    // Use the same comprehensive format as the text file download
    let exportText = "ICE CREAM BUSINESS PROFIT CALCULATOR RESULTS\n\n";
    
    // Add menu items
    exportText += "MENU ITEMS:\n";
    menuItems.forEach(item => {
      exportText += `- ${item.name}: $${item.price} per unit, ${item.unitsSold} units sold per day\n`;
      exportText += `  Costs: $${item.ingredientCost} ingredients, $${item.packagingCost} packaging\n`;
    });
    
    // Add operations
    exportText += "\nOPERATIONS:\n";
    exportText += `- Days Open: ${operations.daysOpen} days per week\n`;
    exportText += `- Months Open: ${operations.monthsOpen} months per year\n`;
    exportText += `- Waste Percentage: ${operations.wastePercentage}%\n`;
    exportText += `- Annual Revenue Growth: ${operations.revenueGrowth}%\n`;
    exportText += `- Annual Expense Growth: ${operations.expenseGrowth}%\n`;
    
    // Add expenses
    exportText += "\nMONTHLY EXPENSES:\n";
    expenses.forEach(expense => {
      exportText += `- ${expense.name}: $${expense.amount.toFixed(2)}\n`;
    });
    
    // Add results
    exportText += "\nSALES PROJECTIONS:\n";
    exportText += `- Daily Sales: $${results.dailyRevenue.toFixed(2)}\n`;
    exportText += `- Monthly Sales: $${results.monthlyRevenue.toFixed(2)}\n`;
    exportText += `- Annual Sales: $${results.annualRevenue.toFixed(2)}\n\n`;
    
    // Add profit results
    exportText += "PROFIT PROJECTIONS:\n";
    exportText += `- Daily Profit: $${results.dailyProfit.toFixed(2)}\n`;
    exportText += `- Monthly Profit: $${results.monthlyProfit.toFixed(2)}\n`;
    exportText += `- Annual Profit: $${results.annualProfit.toFixed(2)}\n\n`;
    
    // Per unit profit
    exportText += "PROFIT PER UNIT:\n";
    results.profitPerUnit.forEach(item => {
      exportText += `- ${item.name}: $${item.profit.toFixed(2)} profit per unit, ${item.margin.toFixed(1)}% margin\n`;
    });
    
    navigator.clipboard.writeText(exportText)
      .then(() => {
        alert('Results copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy results. Please try the download option instead.');
      });
  };

  // Handle number input changes in a more user-friendly way
  const handleInputChange = (e, field) => {
    const value = e.target.value;
    
    // Allow empty values (so user can delete and type a new value)
    if (value === '') {
      updateOperations(field, '');
      return;
    }
    
    // Convert to number if it's a valid number
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateOperations(field, numValue);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      {/* Header with icon and description */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center mb-2">
          <i className="ri-ice-cream-line text-3xl text-emerald-500 mr-3"></i>
          <h2 className="text-2xl font-bold">Ice Cream Business Profit Calculator</h2>
        </div>
        <p className="text-gray-600 text-center">
          Estimate sales, costs, and profitability for your ice cream shop or truck with seasonal adjustments and 5-year projections.
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Revenue Inputs Section */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-4 flex items-center">
            <i className="ri-money-dollar-circle-line mr-2"></i>
            Revenue Inputs
          </h3>
          
          {menuItems.map(item => (
            <MenuItem
              key={item.id}
              item={item}
              updateItem={updateMenuItem}
              removeItem={removeMenuItem}
              isRemovable={menuItems.length > 1}
            />
          ))}
          
          <button 
            type="button" 
            onClick={addMenuItem}
            className="text-skin-emerald-text flex items-center mt-4 hover:underline"
          >
            <i className="ri-add-circle-line mr-1"></i> Add Menu Item
          </button>
        </div>

        {/* Operations Section */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-4 flex items-center">
            <i className="ri-store-line mr-2"></i>
            Operations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Row 1: Days and Months */}
            <div className="form-group">
              <label htmlFor="days-open" className="block text-sm font-medium text-gray-700 mb-1">
                Days Open per Week
              </label>
              <select 
                id="days-open" 
                value={operations.daysOpen}
                onChange={(e) => updateOperations('daysOpen', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {[1, 2, 3, 4, 5, 6, 7].map(day => (
                  <option key={day} value={day}>{day} day{day > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="months-open" className="block text-sm font-medium text-gray-700 mb-1">
                Months Open per Year
              </label>
              <select 
                id="months-open" 
                value={operations.monthsOpen}
                onChange={(e) => updateOperations('monthsOpen', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                  <option key={month} value={month}>{month} month{month > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Row 2: Growth rates and waste percentage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="form-group">
              <label htmlFor="waste-percentage" className="block text-sm font-medium text-gray-700 mb-1">
                Waste Percentage (%)
              </label>
              <input 
                type="number" 
                id="waste-percentage" 
                value={operations.wastePercentage}
                onChange={(e) => handleInputChange(e, 'wastePercentage')}
                step="0.1" 
                min="0" 
                max="100" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="revenue-growth" className="block text-sm font-medium text-gray-700 mb-1">
                Annual Revenue Growth (%)
              </label>
              <input 
                type="number" 
                id="revenue-growth" 
                value={operations.revenueGrowth}
                onChange={(e) => handleInputChange(e, 'revenueGrowth')}
                step="0.1" 
                min="0" 
                max="100" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="expense-growth" className="block text-sm font-medium text-gray-700 mb-1">
                Annual Expense Growth (%)
              </label>
              <input 
                type="number" 
                id="expense-growth" 
                value={operations.expenseGrowth}
                onChange={(e) => handleInputChange(e, 'expenseGrowth')}
                step="0.1" 
                min="0" 
                max="100" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Cost Inputs Section */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-4 flex items-center">
            <i className="ri-funds-line mr-2"></i>
            Cost Inputs
          </h3>
          
          {expenses.map(expense => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              updateExpense={updateExpense}
              removeExpense={removeExpense}
              isRemovable={expense.name !== 'Labor' && expense.name !== 'Lease'}
            />
          ))}
          
          <button 
            type="button" 
            onClick={addExpense}
            className="text-skin-red-text flex items-center mt-4 hover:underline"
          >
            <i className="ri-add-circle-line mr-1"></i> Add Expense
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button 
            type="submit" 
            className="bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 active:from-green-200 active:to-emerald-200 text-gray-700 border border-emerald-100 shadow-sm font-medium py-3 px-6 rounded-md transition-colors"
          >
            <i className="ri-calculator-line mr-2"></i>
            Calculate Ice Cream Profit
          </button>
        </div>
      </form>

      {/* Results Section */}
      {showResults && results && (
        <ResultsSection 
          results={results}
          menuItems={menuItems}
          operations={operations}
          expenses={expenses}
          exportData={exportData}
          copyResults={copyResults}
        />
      )}
    </div>
  );
};

export default IceCreamCalculator;