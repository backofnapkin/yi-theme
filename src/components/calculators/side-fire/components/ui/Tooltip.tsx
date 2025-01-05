import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
  
    return (
      <div className="relative inline-block">
        <div
          onClick={() => setIsVisible(!isVisible)}
          className="cursor-help"
        >
          {children}
        </div>
        {isVisible && (
          <>
            {/* Overlay that covers the entire viewport */}
            <div 
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40"
              onClick={() => setIsVisible(false)}
            />
            
            {/* Tooltip content */}
            <div className="absolute z-50 w-72 px-4 py-3 text-sm bg-white rounded-lg shadow-xl -translate-x-1/2 left-1/2 bottom-full mb-2 border border-gray-200">
              <div className="relative">
                <p className="text-gray-900 font-medium">{content}</p>
                <div className="absolute w-3 h-3 bg-white border-b border-r border-gray-200 rotate-45 -bottom-1.5 left-1/2 -translate-x-1/2"></div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }