import React from 'react';
import { formatCurrency } from './financialUtils';

const SavingsMilestone = ({ totalSavings }) => {
  // Define milestone amounts and their corresponding achievements
  const milestones = [
    { amount: 500, achievement: "New wardrobe", icon: "👕" },
    { amount: 1000, achievement: "Fancy smartphone", icon: "📱" },
    { amount: 1500, achievement: "Coffee machine", icon: "☕" },
    { amount: 2000, achievement: "Gaming console", icon: "🎮" },
    { amount: 2500, achievement: "Weekend getaway", icon: "🏖️" },
    { amount: 3000, achievement: "New bike", icon: "🚲" },
    { amount: 4000, achievement: "Home theater", icon: "🎬" },
    { amount: 5000, achievement: "International flight", icon: "✈️" },
    { amount: 7500, achievement: "Used car", icon: "🚗" },
    { amount: 10000, achievement: "Kitchen renovation", icon: "🍳" },
    { amount: 15000, achievement: "Luxury vacation", icon: "🌴" },
    { amount: 20000, achievement: "Small business startup", icon: "💼" },
    { amount: 25000, achievement: "Solar panels", icon: "☀️" },
    { amount: 50000, achievement: "Home down payment", icon: "🏠" },
    { amount: 100000, achievement: "College education", icon: "🎓" }
  ];
  
  // Find the next milestone
  const achievedMilestones = milestones.filter(m => totalSavings >= m.amount);
  const nextMilestone = milestones.find(m => totalSavings < m.amount);
  
  // Calculate progress to next milestone
  const lastAchievedAmount = achievedMilestones.length > 0 
    ? achievedMilestones[achievedMilestones.length - 1].amount 
    : 0;
    
  const progressPercentage = nextMilestone 
    ? Math.min(100, Math.max(0, ((totalSavings - lastAchievedAmount) / (nextMilestone.amount - lastAchievedAmount)) * 100))
    : 100;

  return (
    <div className="savings-milestone bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-3">Savings Milestones</h3>
      
      {achievedMilestones.length > 0 && (
        <div className="achieved-milestones mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Achieved:</h4>
          <div className="flex flex-wrap gap-2">
            {achievedMilestones.map((milestone, index) => (
              <div 
                key={index}
                className="achievement-badge bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
              >
                <span className="mr-1">{milestone.icon}</span>
                <span>{formatCurrency(milestone.amount, 0)} - {milestone.achievement}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {nextMilestone && (
        <div className="next-milestone">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Next Goal:</h4>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{nextMilestone.icon}</span>
            <div>
              <div className="font-medium">{formatCurrency(nextMilestone.amount, 0)} - {nextMilestone.achievement}</div>
              <div className="text-sm text-gray-600">
                {formatCurrency(totalSavings, 0)} of {formatCurrency(nextMilestone.amount, 0)} saved
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="h-2.5 rounded-full bg-green-500" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-right mt-1 text-gray-500">
            {formatCurrency(nextMilestone.amount - totalSavings, 0)} to go
          </div>
        </div>
      )}
      
      {!nextMilestone && achievedMilestones.length === milestones.length && (
        <div className="all-achieved text-green-700 font-medium flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <span>Congratulations! You've reached all milestones!</span>
        </div>
      )}
    </div>
  );
};

export default SavingsMilestone;