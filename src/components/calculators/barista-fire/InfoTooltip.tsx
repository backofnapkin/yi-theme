import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface InfoTooltipProps {
  text: string | React.ReactNode;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ text }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const updateTooltipPosition = () => {
      if (!tooltipRef.current || !triggerRef.current) return;

      const tooltip = tooltipRef.current;
      const tooltipRect = tooltip.getBoundingClientRect();

      // Reset position first
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translateX(-50%)';

      // After reset, get new position
      const updatedTooltipRect = tooltip.getBoundingClientRect();

      // Check if tooltip extends beyond right edge
      if (updatedTooltipRect.right > window.innerWidth) {
        const overflow = updatedTooltipRect.right - window.innerWidth;
        tooltip.style.left = `calc(50% - ${overflow + 8}px)`;
      }

      // Check if tooltip extends beyond left edge
      if (updatedTooltipRect.left < 0) {
        tooltip.style.left = `calc(50% - ${updatedTooltipRect.left - 8}px)`;
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', updateTooltipPosition);
    window.addEventListener('scroll', updateTooltipPosition);

    if (isOpen) {
      updateTooltipPosition();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updateTooltipPosition);
      window.removeEventListener('scroll', updateTooltipPosition);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block ml-2" ref={triggerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
      </div>
      {isOpen && (
        <div
          ref={tooltipRef}
          className="absolute z-50 w-64 p-4 mt-2 text-sm rounded-lg shadow-lg"
          style={{ 
            backgroundColor: 'rgb(251, 251, 251)',
            border: '1px solid rgb(104, 157, 106)',
            color: 'rgb(80, 73, 69)',
            transform: 'translateX(-50%)',
            left: '50%',
            maxWidth: 'calc(100vw - 32px)'
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};