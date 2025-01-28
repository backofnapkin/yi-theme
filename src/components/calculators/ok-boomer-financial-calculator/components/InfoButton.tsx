import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip } from '../../../ui/Tooltip';

interface InfoButtonProps {
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const InfoButton: React.FC<InfoButtonProps> = ({ content, position = 'top' }) => {
  return (
    <Tooltip content={content}>
      <div
        className="p-1 text-gray-400 hover:text-emerald-600 focus:text-emerald-600 transition-colors cursor-pointer rounded-full hover:bg-emerald-50 focus:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        role="button"
        tabIndex={0}
        aria-label="More information"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.currentTarget.click();
          }
        }}
      >
        <Info className="w-4 h-4" />
      </div>
    </Tooltip>
  );
};

export default InfoButton;