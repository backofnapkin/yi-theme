import React from 'react';

interface InputButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function InputButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: InputButtonProps) {
  const baseClasses = "px-6 py-2 rounded-lg font-semibold transition-colors";
  
  const variants = {
    primary: `
      bg-gradient-to-br from-green-50 to-emerald-50 
      text-gray-700 
      hover:from-green-100 hover:to-emerald-100 
      active:from-green-200 active:to-emerald-200 
      border border-emerald-100 
      shadow-sm
    `,
    secondary: `
      border border-gray-300 
      text-gray-600 
      hover:bg-gray-50 
      active:bg-gray-100
    `
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}