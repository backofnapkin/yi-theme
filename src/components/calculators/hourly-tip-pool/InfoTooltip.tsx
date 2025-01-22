import React from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  text: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ text }) => {
  return (
    <div className="group relative inline-block ml-2">
      <Info className="h-4 w-4 text-blue-500 cursor-help" />
      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute z-10 p-2 -left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-black text-white text-sm rounded-lg pointer-events-none">
        {text}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-8 border-transparent border-t-black"></div>
      </div>
    </div>
  );
};