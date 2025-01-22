import React from 'react';
import { AlertCircle, TrendingUp, DollarSign, Users, Truck } from 'lucide-react';
import type { CalculatorInputs } from './FoodTruckBusinessCalculator';

interface FeedbackInsightsProps {
  inputs: CalculatorInputs;
}

const FeedbackInsights: React.FC<FeedbackInsightsProps> = ({ inputs }) => {
  const totalWeeklySales = Object.values(inputs.dailySales).reduce((sum, sales) => sum + sales, 0);
  const weeklyRevenue = (totalWeeklySales * inputs.averageSpend) + (inputs.monthlyEventRevenue / 4);
  const monthlyRevenue = weeklyRevenue * 4;
  const monthlyLaborCost = inputs.includeLaborCost
    ? inputs.hourlyWage * inputs.numberOfEmployees * inputs.dailyOperatingHours * inputs.workDaysPerWeek * 4
    : 0;
  const laborCostPercentage = (monthlyLaborCost / monthlyRevenue) * 100;

  const insights = [];

  // COGS Analysis
  if (inputs.cogsPercentage > 35) {
    insights.push({
      icon: <DollarSign className="h-5 w-5 mt-1 text-blue-600 flex-shrink-0" />,
      title: "High COGS Percentage",
      description: `Your COGS (${inputs.cogsPercentage}%) is above the recommended range of 30-35%. Consider:
        • Reviewing supplier costs and negotiating better rates
        • Optimizing portion sizes
        • Adjusting menu prices
        • Reducing food waste through better inventory management`
    });
  }

  // Average Spend Analysis
  if (inputs.averageSpend < 10) {
    insights.push({
      icon: <TrendingUp className="h-5 w-5 mt-1 text-purple-600 flex-shrink-0" />,
      title: "Low Average Customer Spend",
      description: `Your average customer spend ($${inputs.averageSpend}) is relatively low. Consider:
        • Adding premium menu items
        • Creating value-adding combo meals
        • Implementing strategic upselling techniques
        • Introducing seasonal specialty items`
    });
  }

  // Catering Revenue Analysis
  if (inputs.monthlyEventRevenue === 0) {
    insights.push({
      icon: <Truck className="h-5 w-5 mt-1 text-green-600 flex-shrink-0" />,
      title: "Untapped Catering Potential",
      description: `You haven't included any catering revenue. Consider:
        • Developing special catering menus
        • Partnering with local event planners
        • Creating corporate lunch packages
        • Marketing your services for private events`
    });
  }

  // Labor Cost Analysis
  if (inputs.includeLaborCost && laborCostPercentage > 25) {
    insights.push({
      icon: <Users className="h-5 w-5 mt-1 text-blue-600 flex-shrink-0" />,
      title: "High Labor Costs",
      description: `Your labor costs (${laborCostPercentage.toFixed(1)}% of revenue) are above optimal levels. Consider:
        • Optimizing staff scheduling
        • Cross-training employees for multiple roles
        • Reviewing operational hours
        • Implementing efficiency-improving systems`
    });
  }

  // Fuel Cost Analysis
  if (inputs.monthlyFuelCosts > 500) {
    insights.push({
      icon: <AlertCircle className="h-5 w-5 mt-1 text-purple-600 flex-shrink-0" />,
      title: "High Fuel Costs",
      description: `Your monthly fuel costs ($${inputs.monthlyFuelCosts}) are relatively high. Consider:
        • Optimizing your route planning
        • Clustering event locations
        • Regular vehicle maintenance
        • Exploring fuel-efficient alternatives`
    });
  }

  return (
    <div className="!bg-gradient-to-br !from-orange-100 !to-amber-100 !border !border-amber-200 p-6 rounded-lg shadow-md">
      <div className="space-y-4 text-gray-700">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-3">
            {insight.icon}
            <div>
              <h3 className="font-medium text-gray-900">{insight.title}</h3>
              <p className="whitespace-pre-line">{insight.description}</p>
            </div>
          </div>
        ))}
        
        {insights.length === 0 && (
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 mt-1 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900">Healthy Business Metrics</h3>
              <p>
                Your business metrics are within healthy ranges! Continue monitoring and optimizing your operations
                to maintain this positive performance.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackInsights;