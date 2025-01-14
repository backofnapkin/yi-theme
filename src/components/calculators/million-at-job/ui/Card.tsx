import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  // Base card styles for the clean, minimal look
  const baseStyles = 'bg-white border border-gray-200 rounded-xl shadow-sm p-6';
  
  return (
    <div 
      className={`
        ${baseStyles}
        ${className}
      `}
    >
      {children}
    </div>
  );
};