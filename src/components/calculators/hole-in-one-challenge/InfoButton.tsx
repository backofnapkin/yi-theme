import { useRef, useEffect, useState } from 'react';
import { Info } from 'lucide-react';

interface InfoButtonProps {
  content: string;
}

export function InfoButton({ content }: InfoButtonProps) {
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
    <div className="relative inline-block z-[60]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-emerald-600 hover:text-emerald-700 focus:outline-none transition-colors"
      >
        <Info size={16} />
      </button>
      {isOpen && (
        <div
          ref={tooltipRef}
          className="absolute z-[70] w-64 p-3 mt-2 -translate-x-1/2 left-1/2 text-sm bg-[#ffffff] text-gray-900 border-2 border-emerald-500 rounded-lg shadow-lg"
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#ffffff] border-l-2 border-t-2 border-emerald-500 transform rotate-45" />
          <div className="relative bg-[#ffffff] z-[1]">{content}</div>
        </div>
      )}
    </div>
  );
}