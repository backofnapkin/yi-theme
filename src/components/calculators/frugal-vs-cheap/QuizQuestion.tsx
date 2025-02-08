import React from 'react';
import { Info } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { QuizQuestion as QuizQuestionType } from './types';
import { Tooltip } from './Tooltip';

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswer: string | null;
  onSelectAnswer: (answerId: string) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
}) => {
  // @ts-ignore - Dynamic icon import
  const IconComponent = Icons[question.icon];

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-skin-card rounded-xl shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <IconComponent className="w-8 h-8 text-skin-active" />
        <h3 className="text-xl font-semibold text-skin-base">{question.question}</h3>
        <Tooltip content="Choose the option that best matches your behavior">
          <Info className="w-5 h-5 text-skin-base opacity-70 cursor-help" />
        </Tooltip>
      </div>
      <div className="space-y-3">
        {question.options.map((option) => (
          <label
            key={option.id}
            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${
                selectedAnswer === option.id
                  ? 'border-skin-base bg-skin-fill'
                  : 'border-skin-base border-opacity-20 hover:border-opacity-100 hover:bg-[rgb(var(--color-border-active))] hover:bg-opacity-10'
              }`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.id}
              checked={selectedAnswer === option.id}
              onChange={() => onSelectAnswer(option.id)}
              className="w-4 h-4 text-skin-active focus:ring-skin-active"
            />
            <span className="ml-3 text-skin-base">{option.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
};