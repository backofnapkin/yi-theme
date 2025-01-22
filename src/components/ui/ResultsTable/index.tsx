import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  format?: (value: any) => string | number;
  className?: string | ((value: any) => string);
}

interface ResultsTableProps {
  title?: string;
  columns: Column[];
  data: any[];
  expandable?: boolean;
  highlightRowCondition?: (row: any) => boolean;
  footerNote?: React.ReactNode;
  className?: string;
}

export function ResultsTable({
  title = 'Detailed Results',
  columns,
  data,
  expandable = true,
  highlightRowCondition,
  footerNote,
  className = ''
}: ResultsTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`border border-gray-200 rounded-xl shadow-sm ${className}`}>
      <button
        className="w-full px-6 py-3 flex items-center justify-between text-left border-b border-gray-200 hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-semibold text-gray-700">{title}</span>
        {isExpanded ? 
          <ChevronUp className="w-5 h-5 text-gray-400" /> : 
          <ChevronDown className="w-5 h-5 text-gray-400" />
        }
      </button>
      
      {isExpanded && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map(column => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr
                  key={index}
                  className={`
                    ${highlightRowCondition?.(row) 
                      ? 'bg-green-50 ring-2 ring-emerald-600 ring-inset font-medium'
                      : 'hover:bg-gray-50'
                    }
                    transition-colors
                  `}
                >
                  {columns.map(column => {
                    const cellClassName = typeof column.className === 'function' 
                      ? column.className(row[column.key])
                      : column.className;
                    
                    return (
                      <td
                        key={column.key}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${cellClassName || ''}`}
                      >
                        {column.format 
                          ? column.format(row[column.key])
                          : row[column.key]
                        }
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isExpanded && footerNote && (
        <div className="mt-4 mx-6 mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">{footerNote}</p>
        </div>
      )}
    </div>
  );
}