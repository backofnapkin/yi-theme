import React, { useState, useEffect, useRef } from 'react';
import { Info } from 'lucide-react';

interface InfoButtonProps {
  text: string;
}

export function InfoButton({ text }: InfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="relative inline-block ml-1">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-[rgba(var(--color-text),0.6)] hover:text-[rgb(var(--color-text))] transition-colors rounded-full hover:bg-[rgba(var(--color-text),0.1)]"
        aria-label="Show information"
      >
        <Info className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          ref={tooltipRef}
          className="absolute z-50 w-64 p-3 bg-[rgb(var(--color-fill))] rounded-lg shadow-lg border border-[rgba(var(--color-border),0.3)] right-0 mt-1"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-sm text-[rgb(var(--color-text))]">{text}</p>
        </div>
      )}
    </div>
  );
}