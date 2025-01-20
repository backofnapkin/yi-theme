// src/components/ui/ResetButton/index.tsx
import React from 'react';
import { RotateCcw } from 'lucide-react';

interface ResetButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function ResetButton({
  className = '',
  ...props
}: ResetButtonProps) {
  return (
    <button
      className={`
        flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl
        shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      <RotateCcw className="w-5 h-5" />
      Reset
    </button>
  );
}