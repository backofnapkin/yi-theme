import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  console.log('Card rendering with className:', className); // Add this line
  return (
    <div 
      className={`rounded-xl shadow-sm p-6 ${className}`}
      style={{border: '2px solid red'}} // Add this temporary test style
    >
      {children}
    </div>
  );
};