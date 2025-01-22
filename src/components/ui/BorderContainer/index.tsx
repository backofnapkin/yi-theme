// src/components/ui/BorderContainer/index.tsx
import React from 'react';

interface BorderContainerProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  contentClassName?: string;  // For spacing within the container
}

export function BorderContainer({
  children,
  title,
  className = '',
  contentClassName = 'space-y-6'  // Default internal spacing
}: BorderContainerProps) {
  return (
    <div className={`border border-gray-200 rounded-xl shadow-sm p-6 ${className}`}>
      {title && (
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {title}
        </h2>
      )}
      <div className={contentClassName}>
        {children}
      </div>
    </div>
  );
}