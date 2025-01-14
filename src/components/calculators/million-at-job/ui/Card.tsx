import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`
        relative 
        rounded-xl 
        shadow-sm 
        p-6 
        bg-skin-fill
        border
        border-skin-base
        ${className}
      `}
    >
      {children}
    </div>
  );
};