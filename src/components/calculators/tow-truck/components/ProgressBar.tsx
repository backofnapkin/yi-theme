import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

interface Step {
  id: number;
  name: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function ProgressBar({ steps, currentStep, onStepClick }: ProgressBarProps) {
  const handleNextStep = () => {
    const nextStep = Math.min(currentStep + 1, steps.length);
    onStepClick(nextStep);
  };

  return (
    <div className="mb-8">
      {/* Mobile view - only show current step */}
      <div className="md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600">Step {currentStep} of {steps.length}</p>
            <h4 className="mt-1 text-lg font-semibold text-gray-900">
              {steps[currentStep - 1].name}
            </h4>
          </div>
          <button
            onClick={handleNextStep}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 shadow-sm"
          >
            {currentStep < steps.length ? 'Next' : 'View Results'}
          </button>
        </div>
        <div className="mt-4 bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop view - show all steps */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Progress</h2>
          <p className="text-sm font-medium text-emerald-600">Step {currentStep} of {steps.length}</p>
        </div>
        
        <div className="relative">
          {/* Progress bar background */}
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full" />
          
          {/* Progress bar fill */}
          <div 
            className="absolute top-5 left-0 h-1 bg-emerald-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
          
          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              
              return (
                <button
                  key={step.id}
                  onClick={() => onStepClick(step.id)}
                  className="flex flex-col items-center group"
                  disabled={step.id > currentStep}
                >
                  {/* Step circle */}
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full 
                    transition-all duration-200
                    ${isCompleted 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : isCurrent 
                        ? 'bg-white border-2 border-emerald-600 text-emerald-600 shadow-md' 
                        : 'bg-white border-2 border-gray-300 text-gray-400'
                    }
                    ${step.id <= currentStep ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'}
                  `}>
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  
                  {/* Step name */}
                  <span className={`
                    mt-2 text-sm font-medium transition-colors duration-200
                    ${isCompleted 
                      ? 'text-emerald-600' 
                      : isCurrent 
                        ? 'text-emerald-600' 
                        : 'text-gray-500'
                    }
                  `}>
                    {step.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}