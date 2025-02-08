export type IncomeRange = 
  | 'Under $30,000'
  | '$30,000-$59,999'
  | '$60,000-$99,999'
  | '$100,000-$149,999'
  | '$150,000+';

export type QuizQuestion = {
  id: number;
  question: string;
  icon: string;
  options: {
    id: string;
    text: string;
    score: number;
  }[];
};

export type UserAnswers = {
  [key: number]: string;
};

export type SpendingCategory = 'Free Spending' | 'Balanced' | 'Frugal' | 'Cheap';

export type ResultsData = {
  category: SpendingCategory;
  rawScore: number;
  adjustedScore: number;
  maxPossibleScore: number;
  feedback: string;
  incomeMultiplier: number;
};