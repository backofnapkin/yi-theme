import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleInfoProps {
  title: string;
  children: React.ReactNode;
  variant?: 'early' | 'core' | 'late';
}

const CollapsibleInfo: React.FC<CollapsibleInfoProps> = ({ 
  title, 
  children, 
  variant = 'core'  // default to core style if not specified
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-lg shadow-md overflow-hidden mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors bg-gray-50/30"
      >
        <h3 className="text-lg font-semibold text-gray-800">
          {title}
        </h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50/30">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleInfo;