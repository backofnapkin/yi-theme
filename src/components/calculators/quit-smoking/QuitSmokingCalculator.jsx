import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SavingsTable from './SavingsTable';
import MotivationalMessage from './MotivationalMessage';
import CalculatorForm from './CalculatorForm';
import ActionButtons from './ActionButtons';
import SavingsMilestone from './SavingsMilestone';
import {
  calculateDailyCost,
  calculateRegularSavings,
  calculateCompoundSavings,
  formatCurrency,
  generateChartData
} from './financialUtils';

const QuitSmokingCalculator = () => {
  const [inputs, setInputs] = useState({
    dailyCigarettes: 10,
    costPerPack: 8,
    cigarettesPerPack: 20,
    annualReturn: 10
  });
  
  const [results, setResults] = useState(null);
  const [calculationPerformed, setCalculationPerformed] = useState(false);
  const resultsRef = useRef(null);

  const calculateSavings = () => {
    // Daily cost calculation
    const dailyCost = calculateDailyCost(
      inputs.dailyCigarettes,
      inputs.costPerPack,
      inputs.cigarettesPerPack
    );
    
    // Time periods in days
    const periods = {
      month: 30,
      year: 365,
      fiveYears: 365 * 5,
      tenYears: 365 * 10,
      twentyYears: 365 * 20
    };
    
    // Calculate savings without reinvestment
    const regularSavings = {
      month: calculateRegularSavings(dailyCost, periods.month),
      year: calculateRegularSavings(dailyCost, periods.year),
      fiveYears: calculateRegularSavings(dailyCost, periods.fiveYears),
      tenYears: calculateRegularSavings(dailyCost, periods.tenYears),
      twentyYears: calculateRegularSavings(dailyCost, periods.twentyYears)
    };
    
    // Calculate savings with reinvestment (compound interest)
    const monthlyContribution = dailyCost * 30;
    const annualRate = inputs.annualReturn / 100;
    
    const compoundSavings = {
      year: calculateCompoundSavings(monthlyContribution, annualRate, 1),
      fiveYears: calculateCompoundSavings(monthlyContribution, annualRate, 5),
      tenYears: calculateCompoundSavings(monthlyContribution, annualRate, 10),
      twentyYears: calculateCompoundSavings(monthlyContribution, annualRate, 20)
    };
    
    // Generate chart data
    const chartData = generateChartData(dailyCost, monthlyContribution, annualRate, 20);
    
    return {
      regularSavings,
      compoundSavings,
      chartData
    };
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const savingsResults = calculateSavings();
    setResults(savingsResults);
    setCalculationPerformed(true);
    
    // Scroll to results after calculation
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  const copyToClipboard = () => {
    if (!results) return;
    
    const { regularSavings, compoundSavings } = results;
    
    const textToCopy = `
Quit Smoking Financial Calculator Results
-----------------------------------------

Your Input:
- Daily cigarette consumption: ${inputs.dailyCigarettes}
- Cost per pack: $${inputs.costPerPack.toFixed(2)}
- Cigarettes per pack: ${inputs.cigarettesPerPack}
- Annual investment return rate: ${inputs.annualReturn}%

Total Money Saved (Without Reinvestment):
- 1 month: $${regularSavings.month.toFixed(2)}
- 1 year: $${regularSavings.year.toFixed(2)}
- 5 years: $${regularSavings.fiveYears.toFixed(2)}
- 10 years: $${regularSavings.tenYears.toFixed(2)}
- 20 years: $${regularSavings.twentyYears.toFixed(2)}

Total Money Saved with Reinvestment (${inputs.annualReturn}% Annual Return):
- 1 year: $${compoundSavings.year.toFixed(2)}
- 5 years: $${compoundSavings.fiveYears.toFixed(2)}
- 10 years: $${compoundSavings.tenYears.toFixed(2)}
- 20 years: $${compoundSavings.twentyYears.toFixed(2)}

By quitting smoking, you could save $${regularSavings.year.toFixed(2)} in just one year.
After 20 years with reinvestment, this could grow to $${compoundSavings.twentyYears.toFixed(2)}.

That's a difference of $${(compoundSavings.twentyYears - regularSavings.twentyYears).toFixed(2)} from investing your savings!
    `;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        alert('Results copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy results: ', err);
        alert('Failed to copy results. Please try again.');
      });
  };
  
  const downloadTxtFile = () => {
    if (!results) return;
    
    const { regularSavings, compoundSavings } = results;
    
    const textContent = `
Quit Smoking Financial Calculator Results
-----------------------------------------

Your Input:
- Daily cigarette consumption: ${inputs.dailyCigarettes}
- Cost per pack: $${inputs.costPerPack.toFixed(2)}
- Cigarettes per pack: ${inputs.cigarettesPerPack}
- Annual investment return rate: ${inputs.annualReturn}%

Total Money Saved (Without Reinvestment):
- 1 month: $${regularSavings.month.toFixed(2)}
- 1 year: $${regularSavings.year.toFixed(2)}
- 5 years: $${regularSavings.fiveYears.toFixed(2)}
- 10 years: $${regularSavings.tenYears.toFixed(2)}
- 20 years: $${regularSavings.twentyYears.toFixed(2)}

Total Money Saved with Reinvestment (${inputs.annualReturn}% Annual Return):
- 1 year: $${compoundSavings.year.toFixed(2)}
- 5 years: $${compoundSavings.fiveYears.toFixed(2)}
- 10 years: $${compoundSavings.tenYears.toFixed(2)}
- 20 years: $${compoundSavings.twentyYears.toFixed(2)}

By quitting smoking, you could save $${regularSavings.year.toFixed(2)} in just one year.
After 20 years with reinvestment, this could grow to $${compoundSavings.twentyYears.toFixed(2)}.

That's a difference of $${(compoundSavings.twentyYears - regularSavings.twentyYears).toFixed(2)} from investing your savings!

-------------------------------------
Generated on: ${new Date().toLocaleDateString()}
    `;
    
    const element = document.createElement('a');
    const file = new Blob([textContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'quit-smoking-savings.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <div className="quit-smoking-calculator bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Quit Smoking Financial Calculator
        </h2>
        
        <CalculatorForm 
          inputs={inputs} 
          handleInputChange={handleInputChange} 
          handleSubmit={handleSubmit}
        />
      </div>
      
      {calculationPerformed && results && (
        <div ref={resultsRef} className="results p-6 space-y-8">
          <SavingsTable 
            regularSavings={results.regularSavings} 
            compoundSavings={results.compoundSavings} 
            annualReturn={inputs.annualReturn}
          />
          
          <div className="chart-container">
            <h3 className="text-xl font-semibold mb-4">Compound Growth Chart</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={results.chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="year" 
                    label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} 
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${Math.round(value).toLocaleString()}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${Math.round(value).toLocaleString()}`, undefined]}
                    labelFormatter={(value) => `Year ${value}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="regularSavings" 
                    name="Without Reinvestment" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="compoundSavings" 
                    name={`With ${inputs.annualReturn}% Annual Return`} 
                    stroke="#82ca9d" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <MotivationalMessage 
              yearSavings={results.regularSavings.year} 
              twentyYearSavings={results.compoundSavings.twentyYears} 
            />
            
            <SavingsMilestone totalSavings={results.regularSavings.year} />
          </div>
          
          <ActionButtons 
            copyToClipboard={copyToClipboard}
            downloadTxtFile={downloadTxtFile}
          />
        </div>
      )}
    </div>
  );
};

export default QuitSmokingCalculator;