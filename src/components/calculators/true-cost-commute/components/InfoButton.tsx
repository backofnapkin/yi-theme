import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface InfoButtonProps {
  content: string | React.ReactNode;
}

const InfoButton: React.FC<InfoButtonProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-emerald-600 hover:opacity-80 focus:outline-none"
      >
        <Info className="w-4 h-4" />
      </button>
      {isOpen && (
        <div
          ref={tooltipRef}
          className="absolute z-10 w-64 p-4 mt-2 text-sm rounded-lg shadow-lg"
          style={{ 
            backgroundColor: 'rgb(251, 251, 251)',
            border: '1px solid rgb(104, 157, 106)',
            color: 'rgb(80, 73, 69)',
            transform: 'translateX(-50%)',
            left: '50%'
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default InfoButton;