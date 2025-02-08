import type { QuizQuestion } from './types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'When tipping at restaurants or coffee shops…',
    icon: 'Utensils',
    options: [
      { id: 'a', text: 'I leave 20% or more, regardless of service.', score: 1 },
      { id: 'b', text: 'I tip 15-20% for normal service.', score: 2 },
      { id: 'c', text: 'I only tip 10% because "service is never that great anyway."', score: 3 },
      { id: 'd', text: 'I already paid for the food, why should I pay extra for someone to do their job?', score: 4 }
    ]
  },
  {
    id: 2,
    question: 'When it comes to charitable giving…',
    icon: 'Heart',
    options: [
      { id: 'a', text: 'I regularly donate a set percentage of my income or tithe.', score: 1 },
      { id: 'b', text: 'I give when I can to causes I care about.', score: 2 },
      { id: 'c', text: 'I only donate during tax season because "might as well get something out of it."', score: 3 },
      { id: 'd', text: 'Everyone has problems, I\'m not a bank.', score: 4 }
    ]
  },
  {
    id: 3,
    question: 'For essential items like shoes, mattresses, or winter coats…',
    icon: 'ShoppingBag',
    options: [
      { id: 'a', text: 'I buy premium brands focusing on quality.', score: 1 },
      { id: 'b', text: 'I research the best value considering quality and longevity.', score: 2 },
      { id: 'c', text: 'I buy the cheapest option and complain when it breaks.', score: 3 },
      { id: 'd', text: 'Duct tape fixes everything, why buy new?', score: 4 }
    ]
  },
  {
    id: 4,
    question: 'When dining out with friends…',
    icon: 'Users',
    options: [
      { id: 'a', text: 'I often treat others to dinners or drinks.', score: 1 },
      { id: 'b', text: 'I split bills, but don\'t stress about small price differences.', score: 2 },
      { id: 'c', text: 'I had the side salad, why should I pay for your steak?', score: 3 },
      { id: 'd', text: 'I head to the bathroom when the bill arrives.', score: 4 }
    ]
  },
  {
    id: 5,
    question: 'For home and car maintenance…',
    icon: 'Wrench',
    options: [
      { id: 'a', text: 'I schedule regular preventive maintenance.', score: 1 },
      { id: 'b', text: 'I handle issues promptly when they arise.', score: 2 },
      { id: 'c', text: 'That sound\'s been there for months, it\'s fine.', score: 3 },
      { id: 'd', text: 'If it ain\'t completely broken, don\'t fix it. Run until the wheels fall off.', score: 4 }
    ]
  },
  {
    id: 6,
    question: 'Regarding entertainment and hobbies…',
    icon: 'Gamepad2',
    options: [
      { id: 'a', text: 'I pursue interests regardless of cost.', score: 1 },
      { id: 'b', text: 'I budget for activities I truly value.', score: 2 },
      { id: 'c', text: '"Fun" activities that aren\'t free? No thanks.', score: 3 },
      { id: 'd', text: 'I can watch YouTube at home for free and chill.', score: 4 }
    ]
  },
  {
    id: 7,
    question: 'When shopping for regular items…',
    icon: 'ShoppingCart',
    options: [
      { id: 'a', text: 'I buy what I want when I want it.', score: 1 },
      { id: 'b', text: 'I use sales and discounts for planned purchases.', score: 2 },
      { id: 'c', text: 'I\'ll wait until it goes on clearance... again.', score: 3 },
      { id: 'd', text: 'Everything\'s overpriced these days anyway due to inflation.', score: 4 }
    ]
  },
  {
    id: 8,
    question: 'When gift giving…',
    icon: 'Gift',
    options: [
      { id: 'a', text: 'I give generously without strict budgets.', score: 1 },
      { id: 'b', text: 'I set reasonable budgets for gifts.', score: 2 },
      { id: 'c', text: 'Here\'s a lovely handmade coupon book...', score: 3 },
      { id: 'd', text: 'I don\'t believe in commercial holidays. It\'s a scam!', score: 4 }
    ]
  },
  {
    id: 9,
    question: 'My approach to grocery shopping is…',
    icon: 'Store',
    options: [
      { id: 'a', text: 'I buy whatever I want without checking prices.', score: 1 },
      { id: 'b', text: 'I compare prices on major items and use store loyalty programs.', score: 2 },
      { id: 'c', text: 'I build my grocery shopping list around coupons and stock up when there\'s a deal.', score: 3 },
      { id: 'd', text: 'The expired food section has perfectly good deals.', score: 4 }
    ]
  }
];