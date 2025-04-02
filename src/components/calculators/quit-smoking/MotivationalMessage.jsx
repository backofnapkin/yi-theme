import React from 'react';

const MotivationalMessage = ({ yearSavings, twentyYearSavings }) => {
  // Function to get motivational message based on savings amount
  const getMotivationalMessage = (amount) => {
    if (amount < 500) return "Even small savings add up! That's money back in your pocket instead of going up in smoke.";
    if (amount < 1000) return "With $500, grab a new wardrobe and strut your stuff. Smoke-free looks way cooler than ashtray chic!";
    if (amount < 1500) return "A grand gets you a fancy smartphone. Now you can text 'I quit!' without coughing up a lung!";
    if (amount < 2000) return "Pocket $1,500 and score a coffee machine plus beans. Brews so good you'll forget cigarettes ever existed!";
    if (amount < 2500) return "With $2,000, snag a gaming console and games. Who needs smoke breaks when you're slaying dragons?";
    if (amount < 3000) return "Your $2,500 buys a weekend getaway. Fresh air beats choking on smoke any day, right?";
    if (amount < 4000) return "Pedal into health with $3,000 for a bike and gear. Cigarettes can't catch you now!";
    if (amount < 5000) return "Drop $4,000 on a home theater. Movie nights are better without that smoky popcorn vibe!";
    if (amount < 7500) return "With $5,000, book that international flight. Jet off and leave the nicotine gremlins behind!";
    if (amount < 10000) return "Score a used car with $7,500. Drive away from smoky habits in style, windows down!";
    if (amount < 12000) return "Your $10,000 revamps the kitchen. Cook like a pro without burning… well, anything but toast!";
    if (amount < 15000) return "Pump $12,000 into a trainer and gym. Get ripped while laughing at cigarettes' weak game!";
    if (amount < 20000) return "With $15,000, hit the tropics. Sip coconuts, not smoke, you beachside quitter you!";
    if (amount < 25000) return "Turn $20,000 into a small biz. Sell 'I Quit' tees and watch the profits roll in, smoke-free!";
    if (amount < 50000) return "Your $25,000 buys solar panels. Power up green while cigs sulk in the dark ages!";
    if (amount < 100000) return "Drop $50,000 on a home down payment. Build a castle where smoke's just a bad fairy tale!";
    return "With over $50,000, you've got a treasure chest! Fund retirement, pay someone's college tuition, or slap a fat down payment on a house. Look at you, quitting smoking and basically winning at life!";
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const yearMessage = getMotivationalMessage(yearSavings);
  const twentyYearMessage = getMotivationalMessage(twentyYearSavings);

  return (
    <div className="motivational-message p-4 bg-green-50 border-l-4 border-green-500 rounded">
      <h3 className="text-xl font-semibold mb-4">Motivational Stats</h3>
      
      <div className="space-y-4">
        <div className="year-message">
          <h4 className="font-medium text-lg">In 1 year:</h4>
          <p>
            You could save approximately {formatCurrency(yearSavings)}. {yearMessage}
          </p>
        </div>
        
        <div className="twenty-year-message">
          <h4 className="font-medium text-lg">In 20 years with reinvestment:</h4>
          <p>
            You could accumulate {formatCurrency(twentyYearSavings)}. {twentyYearMessage}
          </p>
        </div>
        
        <div className="mt-4 text-green-700 font-medium">
          Take a deep breath of fresh air and financial freedom!
        </div>
      </div>
    </div>
  );
};

export default MotivationalMessage;