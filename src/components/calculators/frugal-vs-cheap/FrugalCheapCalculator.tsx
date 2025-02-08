import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { IncomeSelector } from './IncomeSelector';
import { QuizQuestion } from './QuizQuestion';
import { ResultsDisplay } from './ResultsDisplay';
import { quizQuestions } from './questions';
import { calculateResults } from './calculateResults';
import type { IncomeRange, UserAnswers } from './types';
import { BorderContainer } from './BorderContainer';

export const FrugalCheapCalculator: React.FC = () => {
  const [selectedIncome, setSelectedIncome] = useState<IncomeRange | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [showResults, setShowResults] = useState(false);

  const handleIncomeSelect = (income: IncomeRange) => {
    setSelectedIncome(income);
    setCurrentQuestion(1);
  };

  const handleAnswerSelect = (answerId: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answerId,
    }));

    // Add small delay for better UX
    setTimeout(() => {
      // Check if this was the last question
      if (currentQuestion === quizQuestions.length) {
        setShowResults(true);
      } else {
        setCurrentQuestion((prev) => prev + 1);
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleRetake = () => {
    setSelectedIncome(null);
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
  };

  const renderContent = () => {
    if (showResults && selectedIncome) {
      const results = calculateResults(userAnswers, quizQuestions, selectedIncome);
      return (
        <ResultsDisplay
          results={results}
          income={selectedIncome}
          onRetake={handleRetake}
        />
      );
    }

    if (currentQuestion === 0) {
      return (
        <BorderContainer>
          <IncomeSelector
            selectedIncome={selectedIncome}
            onSelectIncome={handleIncomeSelect}
          />
        </BorderContainer>
      );
    }

    const question = quizQuestions[currentQuestion - 1];
    return (
      <BorderContainer>
        <div className="space-y-6">
          <QuizQuestion
            question={question}
            selectedAnswer={userAnswers[currentQuestion]}
            onSelectAnswer={handleAnswerSelect}
          />
          <div className="flex justify-start items-center">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 text-skin-base hover:text-skin-active transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </BorderContainer>
    );
  };

  return (
    <div className="min-h-screen bg-skin-fill py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold text-skin-base mb-2">
            Frugal or Cheap? The Calculator.
          </h1>
          <p className="text-skin-base opacity-80">
            Find out where you land on the spectrum between being financially savvy and just plain cheap based on annual income and behavior.
          </p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};