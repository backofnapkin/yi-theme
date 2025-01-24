import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip } from '../../ui/Tooltip';

interface InfoTooltipProps {
  text: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ text }) => {
  return (
    <Tooltip content={text}>
      <div className="inline-flex items-center ml-2">
        <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
      </div>
    </Tooltip>
  );
};