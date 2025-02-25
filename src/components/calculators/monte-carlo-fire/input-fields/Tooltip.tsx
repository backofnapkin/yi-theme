import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="inline-flex items-center"
      >
        <Info className="w-4 h-4 ml-2 text-gray-400 hover:text-emerald-600 transition-colors duration-200" />
      </button>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className="absolute z-50 w-64 p-3 mt-2 -ml-2 text-sm bg-white rounded-lg shadow-lg border border-emerald-100"
          style={{ transform: 'translateX(-50%)' }}
        >
          <div className="relative">
            <div className="absolute -top-[10px] left-1/2 -ml-[5px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-white" />
            <div className="absolute -top-[11px] left-1/2 -ml-[6px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[11px] border-b-emerald-100" />
          </div>
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;