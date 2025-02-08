import type { IncomeRange, ResultsData, SpendingCategory } from './types';

const INCOME_MULTIPLIERS: Record<IncomeRange, number> = {
  'Under $30,000': 0.8,
  '$30,000-$59,999': 0.9,
  '$60,000-$99,999': 1.0,
  '$100,000-$149,999': 1.2,
  '$150,000+': 1.5,
};

const CATEGORY_RANGES: Record<IncomeRange, Record<SpendingCategory, [number, number]>> = {
  'Under $30,000': {
    'Free Spending': [7, 10],
    'Balanced': [11, 14],
    'Frugal': [15, 22],
    'Cheap': [23, 29],
  },
  '$30,000-$59,999': {
    'Free Spending': [8, 12],
    'Balanced': [13, 16],
    'Frugal': [17, 24],
    'Cheap': [25, 32],
  },
  '$60,000-$99,999': {
    'Free Spending': [9, 14],
    'Balanced': [15, 18],
    'Frugal': [19, 27],
    'Cheap': [28, 36],
  },
  '$100,000-$149,999': {
    'Free Spending': [11, 17],
    'Balanced': [18, 22],
    'Frugal': [23, 32],
    'Cheap': [33, 43],
  },
  '$150,000+': {
    'Free Spending': [14, 20],
    'Balanced': [21, 27],
    'Frugal': [28, 40],
    'Cheap': [41, 54],
  },
};

const FEEDBACK: Record<SpendingCategory, string> = {
  'Free Spending': "You're the life of the party and everyone's favorite dinner companion! You're definitely not a tight wad or even frugal. You give generously! Just make sure to put some money aside for an emergency fund and retirement savings for your future.",
  'Balanced': "You've found that sweet spot between penny-pinching and money-tossing. You know when to splurge and when to save. Keep doing what you're doing! You are neither frugal, nor cheap. You've reached a higher level of financial zen.",
  'Frugal': "You're like a financial ninja - striking the perfect balance between saving money and enjoying life. You probably know the price of everything in your grocery store, but you'll still buy cake for a friend's birthday. You're officially frugal… not cheap!",
  'Cheap': "The results are in: you're cheap. Not frugal, not thrifty - cheap! You probably have a spreadsheet tracking the cost per square of toilet paper. Being money-conscious is great, but you've turned savings into an extreme sport.",
};

export function calculateResults(
  answers: Record<number, string>,
  questions: { options: { id: string; score: number }[] }[],
  income: IncomeRange
): ResultsData {
  // Calculate raw score
  const rawScore = Object.entries(answers).reduce((total, [questionId, answerId]) => {
    const question = questions[parseInt(questionId) - 1];
    const option = question.options.find((opt) => opt.id === answerId);
    return total + (option?.score || 0);
  }, 0);

  const incomeMultiplier = INCOME_MULTIPLIERS[income];
  const adjustedScore = Math.round(rawScore * incomeMultiplier);

  // Determine category based on adjusted score
  let category: SpendingCategory = 'Balanced';
  for (const [cat, [min, max]] of Object.entries(CATEGORY_RANGES[income])) {
    if (adjustedScore >= min && adjustedScore <= max) {
      category = cat as SpendingCategory;
      break;
    }
  }

  return {
    category,
    rawScore,
    adjustedScore,
    maxPossibleScore: Math.round(36 * incomeMultiplier), // 36 is max possible raw score (9 questions × 4 points)
    feedback: FEEDBACK[category],
    incomeMultiplier,
  };
}