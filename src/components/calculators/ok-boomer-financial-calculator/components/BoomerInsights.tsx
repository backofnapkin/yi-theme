import React from 'react';
import { LightbulbIcon, Quote, MessageCircle, ThumbsUp } from 'lucide-react';

interface BoomerInsightsProps {
  selectedEra: 'early' | 'core' | 'late';
}

const insights = {
  early: [
    "I put myself through college on a minimum wage summer job at the hardware store. State college tuition was $500 a year and gas was 36 cents! These kids today wanting loan forgiveness just don't want to work hard like we did.",
    "When I started, my salary was $7,000 a year. Sounds low? That was enough to buy a brand new Mustang for $2,700!",
    "Property taxes on a house? About $200... a year!"
  ],
  core: [
    "Mortgage rates were 13.4% when we bought our first house for $70,300 in 1983. These kids complaining about their mortgages don't understand real hardship!",
    "I stayed loyal to one company for 30 years, got a pension, healthcare, and a gold watch at retirement. These kids today jumping jobs every 2 years don't understand the value of commitment!",
    "Walk into bank. Get 10% interest on a savings account. That's how we did passive income!"
  ],
  late: [
    "Need a job? Just look in the newspaper classifieds. They're full of positions paying $25,000… More than enough to buy a house!",
    "Bought my first condo in 1995 for $85,000. Sold it in 2005 for $300,000. Pure skill, definitely not a housing bubble!",
    "Imagine buying Amazon stock at $18... and your friends calling you crazy!"
  ]
};

const BoomerInsights: React.FC<BoomerInsightsProps> = ({ selectedEra }) => {
  return (
    <div className="bg-gradient-to-br from-orange-100 to-amber-100 border border-amber-200 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-2">
        <LightbulbIcon className="w-6 h-6 text-amber-600" />
        <h2 className="text-xl font-semibold text-gray-900">Boomer Wisdom</h2>
      </div>
      
      <div className="space-y-6">
        {insights[selectedEra].map((insight, index) => (
          <div 
            key={index} 
            className="flex items-start gap-3 bg-white/60 p-4 rounded-lg border border-amber-100"
          >
            {index === 0 && (
              <MessageCircle className="h-5 w-5 mt-1 text-blue-600 flex-shrink-0" />
            )}
            {index === 1 && (
              <Quote className="h-5 w-5 mt-1 text-purple-600 flex-shrink-0" />
            )}
            {index === 2 && (
              <ThumbsUp className="h-5 w-5 mt-1 text-green-600 flex-shrink-0" />
            )}
            <div>
              <p className="italic text-gray-700 leading-relaxed">
                "{insight}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoomerInsights;